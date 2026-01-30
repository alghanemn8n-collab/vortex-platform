import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

load_dotenv()

# تعريف الوكيل الذكي باستخدام ADK
SYSTEM_INSTRUCTION = """أنت مساعد ذكي لمنصة Vortex، منصة سورية متخصصة في حلول الذكاء الاصطناعي كخدمة (SaaS).

معلومات المنصة:
- الاسم: Vortex
- المؤسس: محمد تيسير الغانم
- الموقع: سوريا
- التخصص: حلول الذكاء الاصطناعي والأتمتة

الخدمات الرئيسية:
1. مختبر الابتكار: حلول AI مخصصة، استشارات، تدريب، دعم.
2. وكلاء فورتكس الذكية: وكلاء AI تعمل 24/7 (خدمة عملاء، تحليل، أتمتة).
3. مولد الصور AI: توليد صور احترافية مجاناً وسريع.

كيفية الاستفادة من SaaS:
حدد احتياجك -> اختر الخدمة -> استشارة مجانية -> تخصيص الحل -> تدريب -> إطلاق.

معلومات التواصل:
- واتساب: +963 980 653 019
- بريد: vortexsas1@gmail.com

قواعد:
✅ استخدم العربية الفصحى البسيطة.
✅ كن مختصراً ومباشراً.
✅ استخدم الإيموجي بذكاء.
"""

vortex_agent = Agent(
    name="vortex_assistant",
    model="gemini-2.0-flash-exp",
    instruction=SYSTEM_INSTRUCTION,
)

app = App(
    name="vortex_chatbot_app",
    root_agent=vortex_agent
)

# إعداد FastAPI
server = FastAPI()

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@server.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message")
    session_id = data.get("session_id", "default")
    
    # تشغيل الوكيل
    from google.adk.runtimes import Runner
    runner = Runner(app=app)
    
    result = await runner.run_async(
        input=message,
        session_id=session_id
    )
    
    return {
        "text": result.text,
        "session_id": session_id
    }

if __name__ == "__main__":
    uvicorn.run(server, host="0.0.0.0", port=8000)
