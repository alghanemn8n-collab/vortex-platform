import './About.css';
import { Target, Rocket, Shield, Zap, Globe, Users, Heart, Lightbulb } from 'lucide-react';

const About = () => {
    const goals = [
        {
            icon: <Zap size={30} />,
            title: 'تمكين الأعمال بالذكاء الاصطناعي',
            description: 'نسعى لدمج أقوى تقنيات الذكاء الاصطناعي في صلب عملياتك اليومية لزيادة الكفاءة والإنتاجية.'
        },
        {
            icon: <Target size={30} />,
            title: 'تحويل الأفكار إلى SaaS',
            description: 'نحن لا نبني برامج فقط، بل نصنع منصات عمل متكاملة قادرة على النمو والتوسع عالمياً.'
        },
        {
            icon: <Globe size={30} />,
            title: 'الابتكار بمعايير عالمية',
            description: 'نتبنى أحدث التطورات التقنية لنضع بين يديك حلولاً تسبق المستقبل بخطوات.'
        },
        {
            icon: <Shield size={30} />,
            title: 'الخصوصية والأمان',
            description: 'بناء الثقة يبدأ بحماية البيانات؛ نطبق أعلى معايير التشفير والأمن السيبراني.'
        }
    ];

    return (
        <div className="about-page">
            {/* Immersive Hero Section */}
            <section className="about-hero">
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <span className="badge">من نحن؟</span>
                        <h1 className="hero-title">فورتكس: <span className="text-gradient">صناعة المستقبل الرقمي</span></h1>
                        <p className="hero-description">
                            من قلب الجمهورية العربية السورية، انطلقت فورتكس برؤية طموحة لمؤسسها **محمد تيسير الغانم**،
                            لتكون الجسر الذي يعبر بالشركات من التقليدية إلى عصر الذكاء الاصطناعي الفائق.
                            نحن لا نقدم خدمات تقنية، نحن نقدم "شراكة استراتيجية" لتحويل طموحك إلى واقع ملموس.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Goals Section */}
            <section className="goals-section container">
                <div className="section-header">
                    <h2 className="section-title text-gradient">أهدافنا الاستراتيجية</h2>
                    <p>المبادئ التي تقود كل سطر برمجي نكتبه في فورتكس</p>
                </div>
                <div className="goals-grid">
                    {goals.map((goal, index) => (
                        <div key={index} className="goal-card glass-panel animate-up">
                            <div className="goal-icon-wrapper">
                                {goal.icon}
                            </div>
                            <h3>{goal.title}</h3>
                            <p>{goal.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="philosophy-section">
                <div className="container">
                    <div className="philosophy-content glass-panel">
                        <div className="ph-text">
                            <h2 className="text-gradient pink-purple">فلسفة التميز فورتكس</h2>
                            <p>
                                "الاحترافية ليست مجرد مهارة، بل هي التزام بالتفاصيل." في فورتكس، نؤمن بأن كل عميل هو قصة نجاح فريدة.
                                نبدأ بالاستماع العميق، ثم التخطيط الذكي، وصولاً إلى التنفيذ الذي يبهر المستخدم النهائي.
                                هدفنا هو خلق منصات **تنبض بالحياة** وتتفاعل بذكاء مع احتياجات السوق المتغيرة.
                            </p>
                            <div className="ph-stats">
                                <div className="stat">
                                    <h4>AI-First</h4>
                                    <p>نهج تقني</p>
                                </div>
                                <div className="stat">
                                    <h4>Modern SaaS</h4>
                                    <p>بنية تحتية</p>
                                </div>
                                <div className="stat">
                                    <h4>24/7 Smart</h4>
                                    <p>دعم وكلاء</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Message / Vision */}
            <section className="vision-message container">
                <div className="vision-card glass-panel gradient-border">
                    <div className="vision-content">
                        <div className="quote-icon">"</div>
                        <blockquote>
                            نحن في فورتكس نؤمن بأن العقل البشري المبدع، حينما يمتزج بالذكاء الاصطناعي المتطور،
                            لا حدود لما يمكنه إنجازه. مهمتي هي بناء بيئة تقنية تُمكّن كل صاحب مشروع من الوصول للقمة.
                        </blockquote>
                        <cite>— محمد تيسير الغانم، المؤسس</cite>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-wrapper glass-panel">
                        <h2 className="text-gradient">هل أنت جاهز لتغيير قواعد اللعبة؟</h2>
                        <p>انضم إلينا الآن ودعنا نبني منصة SaaS الذكية الخاصة بك.</p>
                        <div className="cta-btns">
                            <button className="btn-primary" onClick={() => window.location.href = '/contact'}>ابدأ مشروعك الآن</button>
                            <button className="btn-secondary" onClick={() => window.location.href = '/services'}>استكشف خدماتنا</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
