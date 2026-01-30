"""
Vortex Platform - FastAPI Backend
Serves original frontend and provides agent API endpoints
"""
import os
import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests

# ============================================
# Configuration
# ============================================
BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "dist"  # Frontend build is in root
DATA_DIR = BASE_DIR / "data"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# API Key - from environment
API_KEY = os.getenv('GOOGLE_API_KEY', os.getenv('VITE_GEMINI_API_KEY', ''))

# ============================================
# Pydantic Models
# ============================================
class AgentConfig(BaseModel):
    id: Optional[int] = None
    name: str
    instruction: str
    model: str = "gemini-2.0-flash"
    tools: List[str] = []

class ProjectConfig(BaseModel):
    id: Optional[int] = None
    name: str
    description: str = ""
    agents: List[AgentConfig] = []

class ChatMessage(BaseModel):
    message: str
    agent_id: Optional[int] = None
    session_id: str = "default"

class APIKeyUpdate(BaseModel):
    api_key: str

# ============================================
# FastAPI App
# ============================================
app = FastAPI(
    title="Vortex Platform API",
    description="Backend API for Vortex AI Platform",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Data Storage Functions
# ============================================
def load_projects() -> List[Dict]:
    projects_file = DATA_DIR / "projects.json"
    if projects_file.exists():
        try:
            with open(projects_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_projects(projects: List[Dict]):
    projects_file = DATA_DIR / "projects.json"
    with open(projects_file, 'w', encoding='utf-8') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)

def load_agents() -> List[Dict]:
    agents_file = DATA_DIR / "agents.json"
    if agents_file.exists():
        try:
            with open(agents_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_agents(agents: List[Dict]):
    agents_file = DATA_DIR / "agents.json"
    with open(agents_file, 'w', encoding='utf-8') as f:
        json.dump(agents, f, ensure_ascii=False, indent=2)

# ============================================
# Agent Execution
# ============================================
def execute_agent_chat(agent: Dict, user_message: str, api_key: str) -> str:
    """Execute agent using Gemini API directly"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{agent.get('model', 'gemini-2.0-flash')}:generateContent?key={api_key}"
    
    payload = {
        "system_instruction": {
            "parts": [{"text": agent.get('instruction', 'أنت مساعد ذكي.')}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 2000
        }
    }
    
    try:
        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"خطأ من API: {response.status_code}"
            
    except requests.exceptions.Timeout:
        return "انتهت مهلة الاتصال"
    except Exception as e:
        return f"خطأ: {str(e)}"

# ============================================
# API Endpoints - Projects
# ============================================
@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    return {"projects": load_projects()}

@app.post("/api/projects")
async def create_project(project: ProjectConfig):
    """Create a new project"""
    projects = load_projects()
    max_id = max([p.get('id', 0) for p in projects], default=0)
    
    new_project = {
        "id": max_id + 1,
        "name": project.name,
        "description": project.description,
        "agents": [a.dict() for a in project.agents]
    }
    
    projects.append(new_project)
    save_projects(projects)
    
    return {"success": True, "project": new_project}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: int):
    """Delete a project"""
    projects = load_projects()
    projects = [p for p in projects if p.get('id') != project_id]
    save_projects(projects)
    return {"success": True}

# ============================================
# API Endpoints - Agents
# ============================================
@app.get("/api/agents")
async def get_agents():
    """Get all agents"""
    return {"agents": load_agents()}

@app.post("/api/agents")
async def create_agent(agent: AgentConfig):
    """Create a new agent"""
    agents = load_agents()
    max_id = max([a.get('id', 0) for a in agents], default=0)
    
    new_agent = agent.dict()
    new_agent['id'] = max_id + 1
    
    agents.append(new_agent)
    save_agents(agents)
    
    return {"success": True, "agent": new_agent}

@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: int, agent: AgentConfig):
    """Update an agent"""
    agents = load_agents()
    
    for i, a in enumerate(agents):
        if a.get('id') == agent_id:
            updated = agent.dict()
            updated['id'] = agent_id
            agents[i] = updated
            save_agents(agents)
            return {"success": True, "agent": updated}
    
    raise HTTPException(status_code=404, detail="Agent not found")

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: int):
    """Delete an agent"""
    agents = load_agents()
    agents = [a for a in agents if a.get('id') != agent_id]
    save_agents(agents)
    return {"success": True}

# ============================================
# API Endpoints - Chat
# ============================================
@app.post("/api/chat")
async def chat(message: ChatMessage):
    """Chat with an agent"""
    global API_KEY
    
    if not API_KEY:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "API Key غير مُعيّن"}
        )
    
    # Get agent if specified
    agent = None
    if message.agent_id:
        agents = load_agents()
        for a in agents:
            if a.get('id') == message.agent_id:
                agent = a
                break
    
    if not agent:
        # Use default Vortex assistant
        agent = {
            "name": "vortex_assistant",
            "model": "gemini-2.0-flash",
            "instruction": """أنت مساعد ذكي لمنصة Vortex، منصة سورية متخصصة في حلول الذكاء الاصطناعي كخدمة (SaaS).
            المؤسس: محمد تيسير الغانم
            واتساب: +963 980 653 019"""
        }
    
    response_text = execute_agent_chat(agent, message.message, API_KEY)
    
    return {
        "success": True,
        "message": response_text,
        "agent": agent.get('name', 'vortex_assistant'),
        "session_id": message.session_id
    }

# ============================================
# API Endpoints - Settings
# ============================================
@app.post("/api/settings/apikey")
async def update_api_key(data: APIKeyUpdate):
    """Update API key"""
    global API_KEY
    API_KEY = data.api_key
    os.environ['GOOGLE_API_KEY'] = data.api_key
    return {"success": True, "message": "تم تحديث المفتاح"}

@app.get("/api/settings/status")
async def get_status():
    """Get system status"""
    return {
        "api_key_set": bool(API_KEY),
        "agents_count": len(load_agents()),
        "projects_count": len(load_projects())
    }

# ============================================
# Serve Original Frontend
# ============================================
# Mount static files from dist/assets
if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

# Serve index.html for all other routes (SPA support)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serve the original React frontend"""
    # Check if it's a static file
    file_path = DIST_DIR / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    
    # Otherwise serve index.html for SPA routing
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="Frontend not found")

@app.get("/")
async def serve_root():
    """Serve root index.html"""
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Frontend not found")

# ============================================
# Main Entry Point
# ============================================
if __name__ == "__main__":
    print("🌀 Vortex Platform Starting...")
    print(f"📁 Frontend: {DIST_DIR}")
    print(f"🔑 API Key: {'✅ Set' if API_KEY else '❌ Not set'}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
