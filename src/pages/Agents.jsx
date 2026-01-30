import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Plus, Settings, BarChart3, MessageSquare, Sparkles, Trash2, Play, Zap, Wand2 } from 'lucide-react';
import './Agents.css';

const Agents = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ agents: 0, chats: 0, apiStatus: false });

    // Master Agent State
    const [masterAgentMode, setMasterAgentMode] = useState(false);
    const [userDescription, setUserDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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
            setStats(prev => ({ ...prev, agents: (data.agents || []).length }));
        } catch (error) {
            console.error('Error fetching agents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Check API status
    const checkApiStatus = async () => {
        try {
            const response = await fetch('/api/settings/status');
            const data = await response.json();
            setStats(prev => ({
                ...prev,
                apiStatus: data.api_key_set,
                agents: data.agents_count || 0
            }));
        } catch (error) {
            console.error('Error checking API status:', error);
        }
    };

    useEffect(() => {
        fetchAgents();
        checkApiStatus();
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
                setActiveTab('agents');
                alert('تم إنشاء الوكيل بنجاح! 🎉');
            }
        } catch (error) {
            console.error('Error creating agent:', error);
            alert('فشل في إنشاء الوكيل');
        }
    };

    const handleMasterAgentCreate = async () => {
        if (!userDescription.trim()) return;
        setIsGenerating(true);
        try {
            const response = await fetch('/api/master-agent/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: userDescription })
            });
            const data = await response.json();
            if (data.success && data.agentConfig) {
                setNewAgent(data.agentConfig);
                setMasterAgentMode(false);
                // Scroll to form
                document.querySelector('.agent-form')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('عذراً، لم أتمكن من توليد وكيل بهذا الوصف. حاول مرة أخرى بتفاصيل أكثر.');
            }
        } catch (error) {
            console.error('Master Agent Error:', error);
            alert('حدث خطأ أثناء الاتصال بالوكيل العام.');
        } finally {
            setIsGenerating(false);
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

    const handleChatWithAgent = (agent) => {
        const event = new CustomEvent('open-vortex-chat', {
            detail: { agentId: agent.id, agentName: agent.name }
        });
        window.dispatchEvent(event);
    };

    const availableTools = [
        { id: 'google_search', name: 'بحث جوجل', icon: '🔍' },
        { id: 'code_executor', name: 'منفذ الأكواد', icon: '💻' }
    ];

    const tabs = [
        { id: 'dashboard', name: 'لوحة التحكم', icon: <BarChart3 size={18} /> },
        { id: 'agents', name: 'الوكلاء', icon: <Bot size={18} /> },
        { id: 'create', name: 'إنشاء وكيل', icon: <Plus size={18} /> },
        { id: 'settings', name: 'الإعدادات', icon: <Settings size={18} /> }
    ];

    return (
        <div className="agents-page">
            {/* Hero Section */}
            <section className="agents-hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="text-gradient animate-float">
                            <Bot size={48} className="hero-icon" />
                            مصنع الوكلاء الذكية
                        </h1>
                        <p className="hero-subtitle">
                            أنشئ وأدر وكلاء AI متطورين يعملون لأجلك على مدار الساعة
                        </p>
                    </div>
                </div>
            </section>

            {/* Dashboard Main Content */}
            <section className="dashboard-section">
                <div className="container">
                    {/* Tab Navigation */}
                    <div className="dashboard-tabs glass-panel">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-content">
                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card glass-panel">
                                    <div className="stat-icon agents-icon">
                                        <Bot size={28} />
                                    </div>
                                    <div className="stat-info">
                                        <h3>{stats.agents}</h3>
                                        <p>وكلاء نشطين</p>
                                    </div>
                                </div>
                                <div className="stat-card glass-panel">
                                    <div className="stat-icon chats-icon">
                                        <MessageSquare size={28} />
                                    </div>
                                    <div className="stat-info">
                                        <h3>{stats.chats || 0}</h3>
                                        <p>محادثات اليوم</p>
                                    </div>
                                </div>
                                <div className="stat-card glass-panel">
                                    <div className={`stat-icon api-icon ${stats.apiStatus ? 'connected' : 'disconnected'}`}>
                                        <Zap size={28} />
                                    </div>
                                    <div className="stat-info">
                                        <h3>{stats.apiStatus ? 'متصل' : 'غير متصل'}</h3>
                                        <p>حالة Gemini API</p>
                                    </div>
                                </div>
                                <div className="stat-card glass-panel highlight">
                                    <div className="stat-icon create-icon">
                                        <Sparkles size={28} />
                                    </div>
                                    <div className="stat-info">
                                        <button className="quick-create-btn" onClick={() => setActiveTab('create')}>
                                            إنشاء وكيل جديد
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions glass-panel">
                                <h3>إجراءات سريعة</h3>
                                <div className="actions-grid">
                                    <button className="action-btn" onClick={() => setActiveTab('create')}>
                                        <Plus size={20} />
                                        <span>وكيل جديد</span>
                                    </button>
                                    <button className="action-btn" onClick={() => navigate('/image-generator')}>
                                        <Sparkles size={20} />
                                        <span>مولد الصور</span>
                                    </button>
                                    <button className="action-btn" onClick={() => navigate('/solutions')}>
                                        <BarChart3 size={20} />
                                        <span>مختبر الابتكار</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Agents Preview */}
                            {agents.length > 0 && (
                                <div className="recent-agents glass-panel">
                                    <h3>آخر الوكلاء</h3>
                                    <div className="agents-preview">
                                        {agents.slice(0, 3).map(agent => (
                                            <div key={agent.id} className="agent-preview-card">
                                                <div className="agent-avatar">🤖</div>
                                                <div className="agent-preview-info">
                                                    <h4>{agent.name}</h4>
                                                    <span className="agent-model">{agent.model}</span>
                                                </div>
                                                <button className="chat-btn" onClick={() => handleChatWithAgent(agent)}>
                                                    <MessageSquare size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Agents List Tab */}
                    {activeTab === 'agents' && (
                        <div className="agents-list-content">
                            {isLoading ? (
                                <div className="loading-state glass-panel">
                                    <div className="loader"></div>
                                    <p>جاري تحميل الوكلاء...</p>
                                </div>
                            ) : agents.length === 0 ? (
                                <div className="empty-state glass-panel">
                                    <Bot size={64} className="empty-icon" />
                                    <h3>لا يوجد وكلاء بعد</h3>
                                    <p>قم بإنشاء وكيلك الأول لبدء رحلة الأتمتة الذكية</p>
                                    <button className="btn-primary" onClick={() => setActiveTab('create')}>
                                        <Plus size={18} />
                                        إنشاء وكيل جديد
                                    </button>
                                </div>
                            ) : (
                                <div className="agents-grid">
                                    {agents.map((agent) => (
                                        <div key={agent.id} className="agent-card glass-panel">
                                            <div className="agent-header">
                                                <div className="agent-icon">🤖</div>
                                                <div className="agent-badge">{agent.model}</div>
                                            </div>
                                            <h3>{agent.name}</h3>
                                            <p className="agent-instruction">
                                                {agent.instruction.length > 100
                                                    ? agent.instruction.substring(0, 100) + '...'
                                                    : agent.instruction}
                                            </p>
                                            <div className="agent-tools">
                                                {agent.tools.map((tool, idx) => (
                                                    <span key={idx} className="tool-badge">
                                                        {tool === 'google_search' ? '🔍' : '💻'} {tool}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="agent-actions">
                                                <button className="action-btn primary" onClick={() => handleChatWithAgent(agent)}>
                                                    <Play size={16} />
                                                    تشغيل
                                                </button>
                                                <button className="action-btn danger" onClick={() => handleDeleteAgent(agent.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Create Agent Tab */}
                    {activeTab === 'create' && (
                        <div className="create-agent-content">
                            {/* Master Agent Toggle */}
                            <div className="creation-mode-toggle glass-panel">
                                <button
                                    className={`mode-btn ${masterAgentMode ? 'active' : ''}`}
                                    onClick={() => setMasterAgentMode(true)}
                                >
                                    <Wand2 size={20} />
                                    <span>الإنشاء السحري (AI)</span>
                                </button>
                                <button
                                    className={`mode-btn ${!masterAgentMode ? 'active' : ''}`}
                                    onClick={() => setMasterAgentMode(false)}
                                >
                                    <Settings size={20} />
                                    <span>الإنشاء اليدوي</span>
                                </button>
                            </div>

                            {/* Master Agent Interface */}
                            {masterAgentMode && (
                                <div className="master-agent-interface glass-panel highlight-border">
                                    <div className="master-header">
                                        <div className="master-icon-container">
                                            <Sparkles size={32} className="master-icon animate-pulse" />
                                        </div>
                                        <div>
                                            <h2>الوكيل العام (Master Agent)</h2>
                                            <p>صِف عملك أو حاجتك، وسأقوم ببناء الوكيل المناسب لك تلقائياً 🪄</p>
                                        </div>
                                    </div>
                                    <textarea
                                        className="master-input"
                                        placeholder="مثال: أنا صاحب مقهى وأحتاج وكيل يأخذ الطلبات من الزبائن ويقترح عليهم مشروبات جديدة بناءً على الجو..."
                                        rows={4}
                                        value={userDescription}
                                        onChange={(e) => setUserDescription(e.target.value)}
                                    />
                                    <button
                                        className="btn-primary btn-block magic-btn"
                                        onClick={handleMasterAgentCreate}
                                        disabled={isGenerating || !userDescription.trim()}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <span className="loader-spinner-small"></span>
                                                جاري التفكير والتصميم...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 size={20} />
                                                اصنع لي وكيلاً الآن!
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            <div className="create-form-wrapper glass-panel">
                                <div className="form-header">
                                    <Bot size={32} className="form-icon" />
                                    <h2>{masterAgentMode ? 'مراجعة الوكيل المولد' : 'إنشاء وكيل جديد'}</h2>
                                    <p>تخصيص إعدادات الوكيل</p>
                                </div>
                                <form onSubmit={handleCreateAgent} className="agent-form">
                                    <div className="form-group">
                                        <label>
                                            <Bot size={16} />
                                            اسم الوكيل
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثلاً: مساعد المبيعات الذكي"
                                            value={newAgent.name}
                                            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <MessageSquare size={16} />
                                            التعليمات البرمجية (System Prompt)
                                        </label>
                                        <textarea
                                            placeholder="اشرح للوكيل مهامه وشخصيته بوضوح..."
                                            value={newAgent.instruction}
                                            onChange={(e) => setNewAgent({ ...newAgent, instruction: e.target.value })}
                                            rows={8}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>
                                                <Zap size={16} />
                                                النموذج (Model)
                                            </label>
                                            <select
                                                value={newAgent.model}
                                                onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                                            >
                                                <option value="gemini-2.0-flash">Gemini 2.0 Flash (سريع)</option>
                                                <option value="gemini-1.5-pro">Gemini 1.5 Pro (متقدم)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                <Settings size={16} />
                                                الأدوات المتاحة
                                            </label>
                                            <div className="tools-selector">
                                                {availableTools.map(tool => (
                                                    <label key={tool.id} className="tool-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={newAgent.tools.includes(tool.id)}
                                                            onChange={(e) => {
                                                                const tools = e.target.checked
                                                                    ? [...newAgent.tools, tool.id]
                                                                    : newAgent.tools.filter(t => t !== tool.id);
                                                                setNewAgent({ ...newAgent, tools });
                                                            }}
                                                        />
                                                        <span className="checkbox-label">
                                                            {tool.icon} {tool.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary btn-large submit-btn">
                                        <Sparkles size={20} />
                                        إطلاق الوكيل 🚀
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="settings-content glass-panel">
                            <h2>
                                <Settings size={24} />
                                إعدادات النظام
                            </h2>
                            <div className="settings-grid">
                                <div className="setting-card">
                                    <h3>حالة الاتصال</h3>
                                    <div className={`status-indicator ${stats.apiStatus ? 'connected' : 'disconnected'}`}>
                                        <Zap size={20} />
                                        <span>{stats.apiStatus ? 'Gemini API متصل' : 'API غير متصل'}</span>
                                    </div>
                                </div>
                                <div className="setting-card">
                                    <h3>إحصائيات</h3>
                                    <ul className="stats-list">
                                        <li><span>عدد الوكلاء:</span> <strong>{stats.agents}</strong></li>
                                        <li><span>المحادثات:</span> <strong>{stats.chats || 0}</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Agents;
