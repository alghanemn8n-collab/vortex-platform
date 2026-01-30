import { MessageCircle, X, Send, Loader } from 'lucide-react';
// import GeminiChatService from '../services/geminiService'; // Removed for backend integration
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatService, setChatService] = useState(null);
    const [sessionId] = useState(`session_${Date.now()}`);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [selectedAgentName, setSelectedAgentName] = useState('Vortex');
    const messagesEndRef = useRef(null);

    // رسالة ترحيبية افتراضية
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                text: 'مرحباً! 👋 أنا مساعد Vortex الذكي.\n\nكيف يمكنني مساعدتك اليوم؟',
                sender: 'bot',
                timestamp: new Date().toISOString()
            }]);
        }
    }, []);

    // الاستماع لطلبات الفتح الخارجية (مثل زر ابدأ مشروعك)
    useEffect(() => {
        const handleOpenChat = (event) => {
            setIsOpen(true);
            if (event.detail?.agentId) {
                setSelectedAgentId(event.detail.agentId);
                setSelectedAgentName(event.detail.agentName || 'Agent');
                setMessages([{
                    id: Date.now(),
                    text: `تم الاتصال بالوكيل: ${event.detail.agentName || 'Agent'}. كيف يمكنني مساعدتك؟`,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                }]);
            } else if (event.detail?.message) {
                const newMessage = {
                    id: Date.now(),
                    text: event.detail.message,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMessage]);
            }
        };

        window.addEventListener('open-vortex-chat', handleOpenChat);
        return () => window.removeEventListener('open-vortex-chat', handleOpenChat);
    }, []);

    // التمرير التلقائي للأسفل
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // إرسال رسالة
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage,
                    session_id: sessionId,
                    agent_id: selectedAgentId
                })
            });

            const data = await response.json();

            if (data.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.message,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.message || 'Error from API');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.',
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    // الضغط على Enter للإرسال
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // أسئلة سريعة
    const quickQuestions = [
        "ما هي خدماتكم؟",
        "كيف أبدأ مع SaaS؟",
        "ما هي الأسعار؟",
        "كيف أتواصل معكم؟"
    ];

    const handleQuickQuestion = (question) => {
        setInputMessage(question);
    };

    return (
        <>
            {/* زر فتح المحادثة */}
            <button
                className={`chat-button ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                title="تحدث معنا"
            >
                <MessageCircle size={28} />
                <span className="chat-badge">1</span>
            </button>

            {/* نافذة المحادثة */}
            {isOpen && (
                <div className="chat-window">
                    {/* رأس المحادثة */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-avatar">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3>مساعد {selectedAgentName}</h3>
                                <p className="chat-status">
                                    <span className="status-dot"></span>
                                    متصل الآن
                                </p>
                            </div>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            title="إغلاق"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* الرسائل */}
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-content">
                                    {msg.text}
                                </div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString('ar', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* مؤشر الكتابة */}
                        {isLoading && (
                            <div className="chat-message bot-message">
                                <div className="message-content typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* أسئلة سريعة */}
                    {messages.length === 1 && (
                        <div className="quick-questions">
                            <p className="quick-questions-title">أسئلة شائعة:</p>
                            <div className="quick-questions-grid">
                                {quickQuestions.map((q, index) => (
                                    <button
                                        key={index}
                                        className="quick-question-btn"
                                        onClick={() => handleQuickQuestion(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* حقل الإدخال */}
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="اكتب رسالتك..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            {isLoading ? <Loader size={20} className="spinning" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
