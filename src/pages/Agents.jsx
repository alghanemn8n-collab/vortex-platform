import { useState, useEffect } from 'react';
import './Agents.css';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newAgent, setNewAgent] = useState({
        name: '',
        instruction: '',
        model: 'gemini-2.0-flash',
        tools: []
    });

    // Fetch agents from backend
    const fetchAgents = async () => {
        try {
            const response = await fetch('/api/agents');
            const data = await response.json();
            setAgents(data.agents || []);
        } catch (error) {
            console.error('Error fetching agents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleCreateAgent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAgent)
            });
            if (response.ok) {
                setNewAgent({ name: '', instruction: '', model: 'gemini-2.0-flash', tools: [] });
                fetchAgents();
                alert('تم إنشاء الوكيل بنجاح! 🎉');
            }
        } catch (error) {
            console.error('Error creating agent:', error);
            alert('فشل في إنشاء الوكيل');
        }
    };

    const handleDeleteAgent = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الوكيل؟')) return;
        try {
            const response = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
            if (response.ok) fetchAgents();
        } catch (error) {
            console.error('Error deleting agent:', error);
        }
    };

    const benefits = [
        {
            title: 'توفير التكاليف',
            description: 'تقليل التكاليف التشغيلية بنسبة تصل إلى 70%',
            icon: '💰'
        },
        {
            title: 'زيادة الكفاءة',
            description: 'تحسين الإنتاجية وسرعة إنجاز المهام',
            icon: '⚡'
        },
        {
            title: 'دقة عالية',
            description: 'تقليل الأخطاء البشرية إلى الحد الأدنى',
            icon: '🎯'
        },
        {
            title: 'قابلية التوسع',
            description: 'سهولة التوسع حسب نمو أعمالك',
            icon: '📈'
        }
    ];

    return (
        <div className="agents-page">
            {/* Hero Section */}
            <section className="agents-hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="text-gradient animate-float">وكلاء فورتكس الذكية</h1>
                        <p className="hero-subtitle">
                            قوة الذكاء الاصطناعي في خدمة أعمالك
                        </p>
                        <p className="hero-description">
                            وكلاء فورتكس هم مساعدون أذكياء يعملون من أجلك على مدار الساعة.
                            مدعومون بأحدث تقنيات الذكاء الاصطناعي من Google، يمكنهم فهم السياق،
                            التعلم من التجارب، واتخاذ قرارات ذكية لتحسين أعمالك وزيادة إنتاجيتك.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dynamic Agents List */}
            <section className="agent-types-section">
                <div className="container">
                    <h2 className="section-title text-gradient">مصنع الوكلاء (Agent Factory)</h2>

                    {isLoading ? (
                        <div className="text-center">جاري تحميل الوكلاء...</div>
                    ) : (
                        <div className="agents-grid">
                            {agents.map((agent) => (
                                <div key={agent.id} className="agent-card glass-panel">
                                    <div className="agent-icon">🤖</div>
                                    <h3>{agent.name}</h3>
                                    <p className="agent-description" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                        {agent.instruction.substring(0, 100)}...
                                    </p>
                                    <div className="agent-meta" style={{ marginTop: '15px' }}>
                                        <span className="feature-badge" style={{ background: 'var(--secondary)' }}>{agent.model}</span>
                                        {agent.tools.map((tool, idx) => (
                                            <span key={idx} className="feature-badge">{tool}</span>
                                        ))}
                                    </div>
                                    <div className="agent-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => {
                                                const event = new CustomEvent('open-vortex-chat', {
                                                    detail: { agentId: agent.id, agentName: agent.name }
                                                });
                                                window.dispatchEvent(event);
                                            }}
                                            style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', flex: 1 }}
                                        >
                                            تحدث الآن
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAgent(agent.id)}
                                            style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Special Card for adding new */}
                            <div className="agent-card glass-panel" style={{ borderStyle: 'dashed', borderColor: 'var(--primary)', opacity: 0.7 }}>
                                <div className="agent-icon">➕</div>
                                <h3>أضف وكيلاً جديداً</h3>
                                <p>قم بتخصيص وكيل ذكي لمهمة محددة</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Agent Creation Form */}
            <section className="agent-form-section" style={{ padding: '60px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                        <h2 className="section-title text-gradient" style={{ marginBottom: '30px' }}>إنشاء وكيل ذكي</h2>
                        <form onSubmit={handleCreateAgent} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>اسم الوكيل</label>
                                <input
                                    type="text"
                                    placeholder="مثلاً: مساعد المبيعات"
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>التعليمات البرمجية (System Instruction)</label>
                                <textarea
                                    placeholder="اشرح للوكيل مهامه بوضوح..."
                                    value={newAgent.instruction}
                                    onChange={(e) => setNewAgent({ ...newAgent, instruction: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', minHeight: '120px' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>النموذج (Model)</label>
                                    <select
                                        value={newAgent.model}
                                        onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                                    >
                                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>الأدوات (Tools)</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {['google_search', 'code_executor'].map(tool => (
                                            <label key={tool} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={newAgent.tools.includes(tool)}
                                                    onChange={(e) => {
                                                        const tools = e.target.checked
                                                            ? [...newAgent.tools, tool]
                                                            : newAgent.tools.filter(t => t !== tool);
                                                        setNewAgent({ ...newAgent, tools });
                                                    }}
                                                />
                                                {tool === 'google_search' ? 'بحث جوجل' : 'منفذ الأكواد'}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '15px' }}>
                                إطلاق الوكيل الآن 🚀
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title text-gradient">لماذا وكلاء فورتكس؟</h2>
                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card glass-panel">
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2 className="text-gradient">جاهز لتمكين أعمالك بالوكلاء الذكية؟</h2>
                    <p>ابدأ رحلتك نحو التحول الرقمي اليوم</p>
                    <button className="btn-primary btn-large">احجز استشارة مجانية</button>
                </div>
            </section>
        </div>
    );
};

export default Agents;

