import streamlit as st
import subprocess
import time
import requests
import os
from streamlit.components.v1 import html

st.set_page_config(page_title="Vortex AI Platform", layout="wide")

# Start FastAPI in the background
if 'backend_started' not in st.session_state:
    with st.spinner("Starting Vortex Backend..."):
        # Run uvicorn as a subprocess
        proc = subprocess.Popen(["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"])
        st.session_state.backend_started = True
        st.session_state.backend_proc = proc
        # Wait for it to start
        time.sleep(3)

# Show the React Site in an Iframe
st.title("🌀 Vortex AI Platform")
st.markdown("---")

# Use Iframe to display the React site served by FastAPI
st.components.v1.iframe("http://localhost:8000", height=800, scrolling=True)

st.sidebar.title("Settings")
api_key = st.sidebar.text_input("Gemini API Key", type="password", value=os.getenv("GOOGLE_API_KEY", ""))

if st.sidebar.button("Update Key"):
    resp = requests.post("http://localhost:8000/api/settings/apikey", json={"api_key": api_key})
    if resp.status_code == 200:
        st.sidebar.success("Key Updated!")
    else:
        st.sidebar.error("Failed to update key")

st.sidebar.markdown("""
### About Vortex
Vortex is a hybrid AI SaaS platform from Syria.
**Founder:** Mohammed Teiseer Al-Ghanem
[WhatsApp](https://wa.me/963980653019)
""")
