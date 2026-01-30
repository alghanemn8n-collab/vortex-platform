import streamlit as st
import os
import re
import base64
from pathlib import Path

st.set_page_config(page_title="Vortex AI Platform", layout="wide", initial_sidebar_state="collapsed")

# Configuration
BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "dist"
ASSETS_DIR = DIST_DIR / "assets"

def get_vortex_html(api_key):
    """Generate the HTML for the Vortex React app with proper module loading."""
    
    # Check if dist exists
    if not DIST_DIR.exists():
        return "<h1>Error: dist folder not found. Please run 'npm run build' first.</h1>"

    # Read index.html
    index_html = (DIST_DIR / "index.html").read_text(encoding='utf-8')
    
    # Find all CSS files and inline them
    css_content = ""
    for css_file in sorted(ASSETS_DIR.glob("*.css")):
        css_content += f"\n/* {css_file.name} */\n" + css_file.read_text(encoding='utf-8')
    
    # Find the main entry point JS file (index-*.js)
    main_js_file = None
    for js_file in ASSETS_DIR.glob("index-*.js"):
        main_js_file = js_file
        break
    
    if not main_js_file:
        return "<h1>Error: Main JS entry point not found in dist/assets.</h1>"
    
    # Read all JS files and create blob URLs for each
    js_files = {}
    for js_file in ASSETS_DIR.glob("*.js"):
        js_files[js_file.name] = js_file.read_text(encoding='utf-8')
    
    # Create inline script that sets up blob URLs for all modules
    # This allows proper ES module imports between chunks
    module_setup_script = """
    <script>
        console.log('Vortex: Setting up module system...');
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            const errorMsg = 'Vortex Error: ' + msg;
            console.error(errorMsg, error);
        };
    </script>
    """
    
    # API Shim Script
    shim_script = f"""
    <script>
        window.VORTEX_API_KEY = "{api_key}";
        console.log('Vortex: API Shim initialized.');
        
        // API Shim to handle calls in-browser
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {{
            if (url.includes('/api/agents')) {{
                console.log('Vortex Shim: Intercepted agents call');
                let agents = JSON.parse(localStorage.getItem('vortex_agents') || '[]');
                if (options && options.method === 'POST') {{
                    const newAgent = JSON.parse(options.body);
                    newAgent.id = Date.now();
                    agents.push(newAgent);
                    localStorage.setItem('vortex_agents', JSON.stringify(agents));
                    return new Response(JSON.stringify({{ success: true, agent: newAgent }}), {{ status: 200 }});
                }}
                if (options && options.method === 'DELETE') {{
                    const id = parseInt(url.split('/').pop());
                    agents = agents.filter(a => a.id !== id);
                    localStorage.setItem('vortex_agents', JSON.stringify(agents));
                    return new Response(JSON.stringify({{ success: true }}), {{ status: 200 }});
                }}
                return new Response(JSON.stringify({{ agents }}), {{ status: 200 }});
            }}
            
            if (url.includes('/api/settings/status')) {{
                return new Response(JSON.stringify({{ 
                    api_key_set: !!window.VORTEX_API_KEY,
                    agents_count: JSON.parse(localStorage.getItem('vortex_agents') || '[]').length,
                    projects_count: 0
                }}), {{ status: 200 }});
            }}
            
            if (url.includes('/api/chat')) {{
                console.log('Vortex Shim: Intercepted chat call');
                const body = JSON.parse(options.body);
                const userMessage = body.message;
                const agentId = body.agent_id;
                
                let instruction = "أنت مساعد ذكي لمنصة Vortex.";
                if (agentId) {{
                    const agents = JSON.parse(localStorage.getItem('vortex_agents') || '[]');
                    const agent = agents.find(a => a.id === agentId);
                    if (agent) instruction = agent.instruction;
                }}

                if (!window.VORTEX_API_KEY) {{
                    return new Response(JSON.stringify({{ success: false, message: "يرجى إدخال Gemini API Key في القائمة الجانبية." }}), {{ status: 400 }});
                }}

                try {{
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${{window.VORTEX_API_KEY}}`;
                    const resp = await originalFetch(geminiUrl, {{
                        method: 'POST',
                        headers: {{ 'Content-Type': 'application/json' }},
                        body: JSON.stringify({{
                            system_instruction: {{ parts: [{{ text: instruction }}] }},
                            contents: [{{ role: 'user', parts: [{{ text: userMessage }}] }}]
                        }})
                    }});
                    const data = await resp.json();
                    if (data.error) throw new Error(data.error.message);
                    const text = data.candidates[0].content.parts[0].text;
                    return new Response(JSON.stringify({{ success: true, message: text }}), {{ status: 200 }});
                }} catch (e) {{
                    return new Response(JSON.stringify({{ success: false, message: "Error: " + e.message }}), {{ status: 500 }});
                }}
            }}
            return originalFetch(url, options);
        }};
    </script>
    """
    
    # Build the complete HTML
    html = index_html
    
    # Remove existing script/link tags that reference assets
    html = re.sub(r'<script type="module" crossorigin src="/assets/[^"]+\.js"></script>', '', html)
    html = re.sub(r'<link rel="stylesheet" crossorigin href="/assets/[^"]+\.css">', '', html)
    
    # Loading state for #root
    loading_html = '''<div id="root" style="background:#050505; color:#00f0ff; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:Cairo, sans-serif; direction:rtl;"><h2>جارٍ تشغيل Vortex AI...</h2><div style="width:50px; height:50px; border:3px solid rgba(0,240,255,0.3); border-radius:50%; border-top-color:#00f0ff; animation:spin 1s linear infinite;"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>'''
    html = html.replace('<div id="root"></div>', loading_html)
    
    # Create a unified bundle by loading modules in the correct order
    # We need to: 1) inline vendor chunks as IIFEs, 2) then load the main app
    
    # Sort JS files: vendors first, then other chunks, then index last
    vendor_files = []
    other_files = []
    main_file_content = ""
    
    for name, content in js_files.items():
        if 'vendor' in name:
            vendor_files.append((name, content))
        elif name.startswith('index-'):
            main_file_content = content
        else:
            other_files.append((name, content))
    
    # Build combined JS with proper isolation
    # For Vite ESM builds in srcdoc, we need to convert to a single bundle
    # The modules share globals through window
    
    combined_js = """
// Vortex Combined Bundle
(function() {
    'use strict';
    
    // Module registry
    const __modules = {};
    const __exports = {};
    
"""
    
    # For each vendor, wrap it properly
    for name, content in sorted(vendor_files):
        combined_js += f"\n// === {name} ===\n"
        combined_js += content + "\n"
    
    # Add other chunks
    for name, content in sorted(other_files):
        combined_js += f"\n// === {name} ===\n"
        combined_js += content + "\n"
    
    # Add main entry
    combined_js += f"\n// === main entry ===\n"
    combined_js += main_file_content + "\n"
    
    combined_js += """
})();
"""
    
    # Inject everything into head
    injection = f"""
    {module_setup_script}
    <style>
    {css_content}
    </style>
    {shim_script}
    <script type="module">
    {combined_js}
    </script>
    """
    
    if '</head>' in html:
        html = html.replace('</head>', f'{injection}</head>')
    else:
        html = f"<html><head>{injection}</head><body>{html}</body></html>"
    
    # Fix relative paths
    html = html.replace('href="/vite.svg"', 'href="https://vortex-platform.netlify.app/vite.svg"')
    
    return html

# Sidebar for API Key
with st.sidebar:
    st.title("⚙️ الإعدادات")
    api_key = st.text_input("Gemini API Key", type="password", value=os.getenv("VITE_GEMINI_API_KEY", ""))
    st.info("سيتم استخدام هذا المفتاح لتشغيل الوكلاء مباشرة من متصفحك.")
    
    st.markdown("---")
    st.markdown("### حول المنصة")
    st.markdown("**Vortex** هي منصة سورية متطورة لحلول الذكاء الاصطناعي.")
    st.write("المؤسس: محمد تيسير الغانم")

# Render the React App
vortex_html = get_vortex_html(api_key)
st.components.v1.html(vortex_html, height=1000, scrolling=True)

# Hide Streamlit UI elements
st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {padding: 0;}
    iframe {border: none;}
</style>
""", unsafe_allow_html=True)
