import streamlit as st
import os
import re
from pathlib import Path

st.set_page_config(page_title="Vortex AI Platform", layout="wide", initial_sidebar_state="collapsed")

# Configuration
BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "dist"
ASSETS_DIR = DIST_DIR / "assets"

def get_vortex_html(api_key):
    """Generate the HTML for the Vortex React app."""
    
    # Check if dist exists
    if not DIST_DIR.exists():
        return "<h1>Error: dist folder not found. Please run 'npm run build' first.</h1>"

    # Read index.html
    index_html = (DIST_DIR / "index.html").read_text(encoding='utf-8')
    
    # Find CSS file
    css_files = list(ASSETS_DIR.glob("*.css"))
    css_content = ""
    for css_file in css_files:
        css_content += css_file.read_text(encoding='utf-8')
    
    # Find main JS file
    js_files = list(ASSETS_DIR.glob("*.js"))
    if not js_files:
        return "<h1>Error: No JS files found in dist/assets.</h1>"
    
    # Get the main JS content
    main_js = js_files[0].read_text(encoding='utf-8')
    
    # Loading state
    loading_html = '''<div id="root" style="background:#050505; color:#00f0ff; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:Cairo, sans-serif; direction:rtl;"><h2>جارٍ تشغيل Vortex AI...</h2><div style="width:50px; height:50px; border:3px solid rgba(0,240,255,0.3); border-radius:50%; border-top-color:#00f0ff; animation:vx_spin 1s linear infinite;"></div><style>@keyframes vx_spin{to{transform:rotate(360deg)}}</style></div>'''
    
    # Build the complete HTML - inject shim BEFORE the app bundle loads
    # Use unique variable names with prefix to avoid collisions
    html_content = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vortex AI Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">
    <style>
    {css_content}
    </style>
    <script>
    // Vortex API Shim - using prefixed variables to avoid conflicts
    (function() {{
        'use strict';
        
        window.VORTEX_API_KEY = "{api_key}";
        console.log('Vortex: Shim initialized');
        
        var _vx_originalFetch = window.fetch;
        
        window.fetch = function(_vx_url, _vx_options) {{
            // Agents API
            if (_vx_url.indexOf('/api/agents') !== -1) {{
                console.log('Vortex: Intercepted agents call');
                var _vx_agents = JSON.parse(localStorage.getItem('vortex_agents') || '[]');
                
                if (_vx_options && _vx_options.method === 'POST') {{
                    var _vx_newAgent = JSON.parse(_vx_options.body);
                    _vx_newAgent.id = Date.now();
                    _vx_agents.push(_vx_newAgent);
                    localStorage.setItem('vortex_agents', JSON.stringify(_vx_agents));
                    return Promise.resolve(new Response(JSON.stringify({{ success: true, agent: _vx_newAgent }}), {{ status: 200 }}));
                }}
                if (_vx_options && _vx_options.method === 'DELETE') {{
                    var _vx_id = parseInt(_vx_url.split('/').pop());
                    _vx_agents = _vx_agents.filter(function(_vx_a) {{ return _vx_a.id !== _vx_id; }});
                    localStorage.setItem('vortex_agents', JSON.stringify(_vx_agents));
                    return Promise.resolve(new Response(JSON.stringify({{ success: true }}), {{ status: 200 }}));
                }}
                return Promise.resolve(new Response(JSON.stringify({{ agents: _vx_agents }}), {{ status: 200 }}));
            }}
            
            // Settings Status API
            if (_vx_url.indexOf('/api/settings/status') !== -1) {{
                var _vx_agentsData = JSON.parse(localStorage.getItem('vortex_agents') || '[]');
                return Promise.resolve(new Response(JSON.stringify({{ 
                    api_key_set: !!window.VORTEX_API_KEY,
                    agents_count: _vx_agentsData.length,
                    projects_count: 0
                }}), {{ status: 200 }}));
            }}
            
            // Chat API
            if (_vx_url.indexOf('/api/chat') !== -1) {{
                console.log('Vortex: Intercepted chat call');
                var _vx_body = JSON.parse(_vx_options.body);
                var _vx_userMessage = _vx_body.message;
                var _vx_agentId = _vx_body.agent_id;
                
                var _vx_instruction = "أنت مساعد ذكي لمنصة Vortex.";
                if (_vx_agentId) {{
                    var _vx_storedAgents = JSON.parse(localStorage.getItem('vortex_agents') || '[]');
                    var _vx_foundAgent = _vx_storedAgents.find(function(_vx_ag) {{ return _vx_ag.id === _vx_agentId; }});
                    if (_vx_foundAgent) _vx_instruction = _vx_foundAgent.instruction;
                }}

                if (!window.VORTEX_API_KEY) {{
                    return Promise.resolve(new Response(JSON.stringify({{ success: false, message: "يرجى إدخال Gemini API Key في القائمة الجانبية." }}), {{ status: 400 }}));
                }}

                var _vx_geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + window.VORTEX_API_KEY;
                return _vx_originalFetch(_vx_geminiUrl, {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{
                        system_instruction: {{ parts: [{{ text: _vx_instruction }}] }},
                        contents: [{{ role: 'user', parts: [{{ text: _vx_userMessage }}] }}]
                    }})
                }})
                .then(function(_vx_resp) {{ return _vx_resp.json(); }})
                .then(function(_vx_data) {{
                    if (_vx_data.error) throw new Error(_vx_data.error.message);
                    var _vx_text = _vx_data.candidates[0].content.parts[0].text;
                    return new Response(JSON.stringify({{ success: true, message: _vx_text }}), {{ status: 200 }});
                }})
                .catch(function(_vx_err) {{
                    return new Response(JSON.stringify({{ success: false, message: "Error: " + _vx_err.message }}), {{ status: 500 }});
                }});
            }}
            
            return _vx_originalFetch(_vx_url, _vx_options);
        }};
    }})();
    </script>
</head>
<body>
    {loading_html}
    <script type="module">
    {main_js}
    </script>
</body>
</html>'''
    
    return html_content

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
