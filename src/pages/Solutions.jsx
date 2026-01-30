import './Solutions.css';

const Solutions = () => {
    const innovations = [
        {
            icon: '🔬',
            title: 'البحث والتطوير',
            description: 'نستكشف أحدث تقنيات الذكاء الاصطناعي ونطورها لتناسب احتياجات السوق المحلي والعالمي'
        },
        {
            icon: '🚀',
            title: 'الأتمتة الذكية',
            description: 'حلول متقدمة لأتمتة العمليات التجارية وتحسين الكفاءة التشغيلية بنسبة تصل إلى 80%'
        },
        {
            icon: '🎯',
            title: 'التحليل التنبؤي',
            description: 'استخدام الذكاء الاصطناعي للتنبؤ بالاتجاهات واتخاذ قرارات استراتيجية مدروسة'
        },
        {
            icon: '💡',
            title: 'الابتكار المستمر',
            description: 'نعمل على تطوير حلول جديدة باستمرار لمواكبة التطور السريع في عالم التكنولوجيا'
        }
    ];

    const services = [
        {
            title: 'استشارات تقنية',
            description: 'نساعدك في تحديد أفضل الحلول التقنية لمشروعك',
            features: ['تحليل الاحتياجات', 'تصميم الحلول', 'خطة التنفيذ']
        },
        {
            title: 'تطوير مخصص',
            description: 'بناء حلول مخصصة تناسب احتياجاتك الفريدة',
            features: ['تطوير كامل', 'تكامل الأنظمة', 'الدعم المستمر']
        },
        {
            title: 'تدريب وتمكين',
            description: 'تدريب فريقك على استخدام التقنيات الحديثة',
            features: ['ورش عمل', 'دورات تدريبية', 'دعم فني']
        }
    ];

    return (
        <div className="solutions-page">
            {/* Hero Section */}
            <section className="solutions-hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="text-gradient animate-float">مختبر الابتكار</h1>
                        <p className="hero-subtitle">
                            حيث تتحول الأفكار إلى واقع رقمي
                        </p>
                        <p className="hero-description">
                            نحن نؤمن بأن الابتكار هو المفتاح للمستقبل. في مختبر فورتكس للابتكار،
                            نجمع بين أحدث تقنيات الذكاء الاصطناعي والخبرة البشرية لإنشاء حلول
                            تحويلية تساعد الشركات على النمو والازدهار في العصر الرقمي.
                        </p>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="what-we-do">
                <div className="container">
                    <h2 className="section-title text-gradient">ماذا نقدم؟</h2>
                    <div className="innovations-grid">
                        {innovations.map((item, index) => (
                            <div key={index} className="innovation-card glass-panel">
                                <div className="innovation-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="services-section">
                <div className="container">
                    <h2 className="section-title text-gradient">خدماتنا</h2>
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card glass-panel">
                                <h3>{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <span className="feature-icon">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-primary">اعرف المزيد</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section">
                <div className="container">
                    <h2 className="section-title text-gradient">لماذا فورتكس؟</h2>
                    <div className="why-us-content">
                        <div className="why-us-item">
                            <div className="why-number">01</div>
                            <h3>خبرة متقدمة</h3>
                            <p>فريق من الخبراء في مجال الذكاء الاصطناعي والتطوير التقني</p>
                        </div>
                        <div className="why-us-item">
                            <div className="why-number">02</div>
                            <h3>حلول مبتكرة</h3>
                            <p>نستخدم أحدث التقنيات لتقديم حلول فريدة ومتطورة</p>
                        </div>
                        <div className="why-us-item">
                            <div className="why-number">03</div>
                            <h3>دعم مستمر</h3>
                            <p>نرافقك في كل خطوة من رحلتك الرقمية</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2 className="text-gradient">هل أنت مستعد للابتكار؟</h2>
                    <p>دعنا نساعدك في تحويل أفكارك إلى واقع</p>
                    <button className="btn-primary btn-large">ابدأ مشروعك الآن</button>
                </div>
            </section>
        </div>
    );
};

export default Solutions;
