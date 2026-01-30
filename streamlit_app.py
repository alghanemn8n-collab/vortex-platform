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
        return "<h1>Error: dist folder not found. Please run 'npm run build' first.</h1>"

    # Read index.html
    index_html = (DIST_DIR / "index.html").read_text(encoding='utf-8')
    
    # Read CSS and JS assets
    css_files = list(ASSETS_DIR.glob("*.css"))
    js_files = list(ASSETS_DIR.glob("*.js"))
    
    css_content = css_files[0].read_text(encoding='utf-8') if css_files else ""
    js_content = js_files[0].read_text(encoding='utf-8') if js_files else ""
    
    # Prepare the Shim (Mock Backend for Streamlit Cloud)
    shim = f"""
    <script>
        window.VORTEX_API_KEY = "{api_key}";
        
        // API Shim to handle calls in-browser on Streamlit Cloud
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {{
            // Handle Agents API
            if (url.includes('/api/agents')) {{
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
            
            // Handle Chat API
            if (url.includes('/api/chat')) {{
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
                    return new Response(JSON.stringify({{ success: false, message: "يرجى إدخال API Key في القائمة الجانبية." }}), {{ status: 400 }});
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
                    const text = data.candidates[0].content.parts[0].text;
                    return new Response(JSON.stringify({{ success: true, message: text }}), {{ status: 200 }});
                }} catch (e) {{
                    return new Response(JSON.stringify({{ success: false, message: "خطأ في الاتصال بـ Gemini API: " + e.message }}), {{ status: 500 }});
                }}
            }}
            
            return originalFetch(url, options);
        }};
    </script>
    """
    
    # Inline CSS and JS into index.html
    html = index_html
    html = html.replace('<link rel="stylesheet"', '<!-- <link rel="stylesheet"')
    html = html.replace('href="/assets/index', '--> <style>' + css_content + '</style> <!--')
    
    html = html.replace('<script type="module"', '<!-- <script type="module"')
    html = html.replace('src="/assets/index', '--> ' + shim + '<script>' + js_content + '</script> <!--')
    
    # Fix relative paths for static assets like vite.svg
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
