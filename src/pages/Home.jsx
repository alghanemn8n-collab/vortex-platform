import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: 'مرحباً بك في عالم فورتكس',
            subtitle: 'حيث تلتقي التكنولوجيا بالابتكار',
            description: 'منصة متكاملة لحلول الذكاء الاصطناعي والأتمتة الذكية',
            gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(112, 0, 255, 0.2) 100%)',
        },
        {
            title: 'وكلاء ذكية متقدمة',
            subtitle: 'تعمل من أجلك على مدار الساعة',
            description: 'استفد من قوة الذكاء الاصطناعي لأتمتة مهامك وتحسين إنتاجيتك',
            gradient: 'linear-gradient(135deg, rgba(112, 0, 255, 0.2) 0%, rgba(255, 0, 150, 0.2) 100%)',
        },
        {
            title: 'ابتكار لا حدود له',
            subtitle: 'نحول أفكارك إلى واقع رقمي',
            description: 'حلول مخصصة تناسب احتياجات عملك وتطلعاتك المستقبلية',
            gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 255, 150, 0.2) 100%)',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleStartProject = () => {
        const event = new CustomEvent('open-vortex-chat', {
            detail: { message: 'أهلاً بك في مرحلة التخطيط! 🚀 بصفتي مساعد Vortex الاستراتيجي، يهمني سماع فكرتك.\n\nما هو التحدي أو "المشكلة" التي تبحث عن حل ذكي لها في عملك؟ وماذا تعرف عن نموذج الـ SaaS وكيف تراه يخدم طموحاتك؟' }
        });
        window.dispatchEvent(event);
    };

    return (
        <div className="home-container">
            {/* Hero Section with Animated Backgrounds */}
            <section className="hero-section">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ background: slide.gradient }}
                    >
                        <div className="hero-content">
                            <h1 className="hero-title animate-float">{slide.title}</h1>
                            <h2 className="hero-subtitle">{slide.subtitle}</h2>
                            <p className="hero-description">{slide.description}</p>
                            <div className="hero-actions">
                                <button className="btn-primary" onClick={handleStartProject}>ابدأ الآن</button>
                                <button className="btn-secondary" onClick={() => navigate('/about')}>استكشف الآن</button>
                            </div>
                        </div>


                        {/* Animated Background Elements */}
                        <div className="bg-animation">
                            <div className="particle particle-1"></div>
                            <div className="particle particle-2"></div>
                            <div className="particle particle-3"></div>
                            <div className="particle particle-4"></div>
                            <div className="particle particle-5"></div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="slide-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section container">
                <h2 className="section-title text-gradient">لماذا فورتكس؟</h2>
                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon">🤖</div>
                        <h3>وكلاء ذكية</h3>
                        <p>وكلاء AI متقدمة تعمل بذكاء لتنفيذ مهامك تلقائياً</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon">⚡</div>
                        <h3>أداء فائق</h3>
                        <p>سرعة استجابة عالية وكفاءة في معالجة البيانات</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon">🔒</div>
                        <h3>أمان متقدم</h3>
                        <p>حماية شاملة لبياناتك مع أعلى معايير الأمان</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon">🎯</div>
                        <h3>حلول مخصصة</h3>
                        <p>تصميم حلول تناسب احتياجاتك الفريدة</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="start">
                <div className="container">
                    <h2 className="text-gradient">جاهز للبدء؟</h2>
                    <p>انضم إلى مئات الشركات التي تثق في فورتكس</p>
                    <button className="btn-primary btn-large" onClick={handleStartProject}>ابدأ رحلتك الآن</button>
                </div>
            </section>
        </div>
    );
};

export default Home;
