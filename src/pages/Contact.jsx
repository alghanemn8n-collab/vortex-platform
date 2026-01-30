import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: '📧',
            title: 'البريد الإلكتروني',
            value: 'vortexsas1@gmail.com',
            link: 'mailto:vortexsas1@gmail.com'
        },
        {
            icon: '📱',
            title: 'الهاتف',
            value: '+963 980 653 019',
            link: 'tel:+963980653019'
        },
        {
            icon: '💬',
            title: 'واتساب',
            value: '+963 980 653 019',
            link: 'https://wa.me/963980653019?text=مرحباً، أود الاستفسار عن خدمات فورتكس'
        },
        {
            icon: '📍',
            title: 'الموقع',
            value: 'الجمهورية العربية السورية',
            link: null
        },
        {
            icon: '👤',
            title: 'المؤسس',
            value: 'محمد تيسير الغانم',
            link: null
        },
        {
            icon: '⏰',
            title: 'ساعات العمل',
            value: 'متاح على مدار الساعة',
            link: null
        }
    ];

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="text-gradient animate-float">تواصل معنا</h1>
                        <p className="hero-subtitle">نحن هنا للإجابة على استفساراتك</p>
                        <p className="hero-description">
                            سواء كان لديك سؤال عن خدماتنا، تريد مناقشة مشروع جديد، أو تحتاج إلى دعم فني،
                            فريقنا جاهز لمساعدتك. تواصل معنا عبر النموذج أدناه أو استخدم معلومات الاتصال المباشرة.
                        </p>
                    </div>
                </div>
            </section>

            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-form-section">
                            <h2 className="text-gradient">أرسل لنا رسالة</h2>
                            <form onSubmit={handleSubmit} className="contact-form glass-panel">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">الاسم الكامل *</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">البريد الإلكتروني *</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">رقم الهاتف</label>
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">الموضوع *</label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">الرسالة *</label>
                                    <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn-primary btn-large">إرسال الرسالة</button>
                            </form>
                        </div>

                        <div className="contact-info-section">
                            <h2 className="text-gradient">معلومات الاتصال</h2>
                            <div className="contact-info-cards">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="info-card glass-panel">
                                        <div className="info-icon">{info.icon}</div>
                                        <h3>{info.title}</h3>
                                        {info.link ? (
                                            <a href={info.link} className="info-value">{info.value}</a>
                                        ) : (
                                            <p className="info-value">{info.value}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="social-links glass-panel">
                                <h3>تابعنا</h3>
                                <div className="social-icons">
                                    <a href="#" className="social-icon">🔗 LinkedIn</a>
                                    <a href="#" className="social-icon">🐦 Twitter</a>
                                    <a href="#" className="social-icon">📘 Facebook</a>
                                    <a href="#" className="social-icon">📸 Instagram</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
