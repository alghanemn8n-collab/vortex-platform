import streamlit as st
import os
from pathlib import Path

st.set_page_config(page_title="Vortex AI Platform", layout="wide", initial_sidebar_state="collapsed")

# Configuration
BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "dist"
ASSETS_DIR = DIST_DIR / "assets"

def get_vortex_html(api_key):
    # Check if dist exists
    if not DIST_DIR.exists():
        return "<h1>Error: dist folder not found. Please run 'build' first.</h1>"

    # Read index.html
    index_html = (DIST_DIR / "index.html").read_text(encoding='utf-8')
    
    # Read ALL CSS and JS assets
    css_content = ""
    for css_file in ASSETS_DIR.glob("*.css"):
        css_content += f"\n/* {css_file.name} */\n" + css_file.read_text(encoding='utf-8')
        
    js_content = ""
    for js_file in ASSETS_DIR.glob("*.js"):
        # We wrap in a block to avoid issues with multiple modules if any
        js_content += f"\n// --- {js_file.name} ---\n" + js_file.read_text(encoding='utf-8')
    
    # Prepare Diagnostic Script
    diagnostics = """
    <script>
        console.log('Vortex: Starting diagnostic shell...');
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            const errorMsg = 'Vortex Load Error: ' + msg + (url ? ' at ' + url + ':' + lineNo : '');
            console.error(errorMsg, error);
            const debugDiv = document.getElementById('vortex-debug') || document.createElement('div');
            debugDiv.id = 'vortex-debug';
            debugDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:rgba(255,0,0,0.9); color:white; padding:10px; z-index:99999; font-size:12px; font-family:monospace;';
            debugDiv.innerText = errorMsg;
            document.body.appendChild(debugDiv);
        };
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Vortex: Unhandled promise rejection:', event.reason);
        });
    </script>
    """
    
    # Prepare the Shim
    shim = f"""
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
    
    import re
    html = index_html
    
    # 1. Clean up existing tags
    html = re.sub(r'<script type="module" crossorigin src="/assets/index-.*?\.js"></script>', '', html)
    html = re.sub(r'<link rel="stylesheet" crossorigin href="/assets/index-.*?\.css">', '', html)
    
    # 2. Add Loading State to #root
    loading_html = '<div id="root" style="background:#050505; color:#00f0ff; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:Cairo, sans-serif; direction:rtl;"><h2>جارٍ تشغيل Vortex AI...</h2><div style="width:50px; height:50px; border:3px solid rgba(0,240,255,0.3); border-radius:50%; border-top-color:#00f0ff; animation:spin 1s linear infinite;"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>'
    html = html.replace('<div id="root"></div>', loading_html)
    
    # 3. Inject Everything
    injection = f"""
    {diagnostics}
    <style>
    {css_content}
    </style>
    {shim}
    <script type="module">
    {js_content}
    </script>
    """
    
    if '</head>' in html:
        html = html.replace('</head>', f'{injection}</head>')
    else:
        html = f"<html><head>{injection}</head><body>{html}</body></html>"
    
    # Fix relative paths for static assets
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

# Add custom CSS to hide Streamlit UI elements for a cleaner look
st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {padding: 0;}
    iframe {border: none;}
</style>
""", unsafe_allow_html=True)
