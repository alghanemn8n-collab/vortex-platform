import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="text-gradient animate-float">عن فورتكس</h1>
                    <p className="hero-subtitle">نبني المستقبل، اليوم.</p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision-section">
                <div className="container">
                    <div className="grid-2">
                        <div className="glass-panel card">
                            <div className="card-icon">🚀</div>
                            <h2>رؤيتنا</h2>
                            <p>
                                أن نكون المحفز الأول للتحول الرقمي في المنطقة، من خلال تمكين الشركات
                                والأفراد من تسخير قوة الذكاء الاصطناعي لبناء مستقبل أكثر ذكاءً وكفاءة.
                            </p>
                        </div>
                        <div className="glass-panel card">
                            <div className="card-icon">🎯</div>
                            <h2>رسالتنا</h2>
                            <p>
                                تقديم حلول برمجية مبتكرة وموثوقة تجمع بين أحدث التقنيات وسهولة الاستخدام،
                                لمساعدة عملائنا على تحقيق أهدافهم وتجاوز توقعاتهم.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <h2 className="section-title text-gradient">قيمنا</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-icon">💡</div>
                            <h3>الابتكار</h3>
                            <p>نسعى دائماً لتقديم أفكار وحلول جديدة خارج الصندوق.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon">🤝</div>
                            <h3>الشراكة</h3>
                            <p>نؤمن بأن نجاح عملائنا هو نجاحنا، ونعمل معهم كشركاء حقيقيين.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon">⭐</div>
                            <h3>التميز</h3>
                            <p>لا نرضى بأقل من الجودة العالية في كل ما نقدمه.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section (Placeholder) */}
            <section className="team-section">
                <div className="container">
                    <h2 className="section-title text-gradient">فريقنا</h2>
                    <p className="team-intro">
                        نخبة من المطورين والمصممين وخبراء الذكاء الاصطناعي، يجمعهم شغف واحد: الابتكار.
                    </p>
                    {/* Add team members here later */}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2 className="text-gradient">هل أنت مستعد لنقل عملك إلى المستوى التالي؟</h2>
                    <div className="cta-buttons">
                        <button className="btn-primary" onClick={() => navigate('/contact')}>ابدأ مشروعك الآن</button>
                        <button className="btn-secondary" onClick={() => navigate('/solutions')}>استكشف خدماتنا</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
