const SYSTEM_INSTRUCTION = `أنت مساعد ذكي وخبير استراتيجي لمنصة Vortex، منصة متميزة في حلول الذكاء الاصطناعي كخدمة (SaaS). 

مهمتك الأساسية هي "تأهيل المشاريع الجديدة" وإرشاد العملاء لكيفية الاستفادة من نموذج SaaS لتطوير أعمالهم.

عندما يبدأ العميل محادثة حول "مشروع جديد"، عليك اتباع هذا المنهج:
1. **فهم المشكلة:** اسأل العميل عن التحدي الذي يواجهه في عمله الحالي ويريد حله بالذكاء الاصطناعي.
2. **شرح القيمة (SaaS):** وضح له ببساطة كيف أن نموذج "البرمجيات كخدمة" يوفر عليه تكاليف البنية التحتية ويمنحه أدوات ذكية تعمل 24/7.
3. **تحليل الفكرة:** ناقش معه كيف يمكن لـ Vortex تنفيذ مشروعه (سواء عبر الوكلاء الذكية أو حلول مخصصة).
4. **العرض التسويقي:** اقترح عليه فكرة عرض مشروعه بعد التنفيذ في "قسم المشاريع المميزة" بالمنصة كخطة إعلانية لمنتجه (مع التأكيد على أن هذا يتم بموافقته فقط).

قواعد الرد:
- ابدأ دائماً بأسئلة مفتوحة (ما هو نوع مشروعك؟ ما هي المشكلة التي تريد حلها؟).
- كن محفزاً وملهماً (نحن نحول الأفكار إلى واقع رقمي).
- اجعل العميل يشعر أن منصة Vortex هي شريكه في النجاح، وليست مجرد أداة.
- في نهاية المحادثة، وجّه العميل دائماً لتثبيت موعد مع المؤسس محمد تيسير الغانم عبر واتساب: +963 980 653 019 لمناقشة التفاصيل الفنية والمالية.`;

class GeminiChatService {
    constructor() {
        this.apiKey = 'AIzaSyBbxNRDQJ9ScEocRBYTO-a1nElDGzdXkRU';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
        this.history = [];
    }

    async sendMessage(message) {
        if (!this.apiKey) {
            return { success: false, message: 'عذراً، نظام المحادثة غير مفعّل (API Key مفقود).' };
        }

        try {
            const payload = {
                system_instruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents: [
                    ...this.history,
                    {
                        role: "user",
                        parts: [{ text: message }]
                    }
                ],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 1000,
                }
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('فشل في الاتصال بـ Google API');
            }

            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;

            this.history.push({ role: "user", parts: [{ text: message }] });
            this.history.push({ role: "model", parts: [{ text: botResponse }] });

            return {
                success: true,
                message: botResponse,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Chat Error:', error);
            return {
                success: false,
                message: 'عذراً، أواجه مشكلة حالياً في معالجة طلبك. يرجى التأكد من اتصال الإنترنت أو المحاولة لاحقاً.'
            };
        }
    }

    startChat() { this.history = []; }
}

export default GeminiChatService;
