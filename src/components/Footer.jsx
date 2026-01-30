import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Facebook } from 'lucide-react';
import VortexLogo from './VortexLogo';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                {/* القسم الأول: عن فورتكس */}
                <div className="footer-section about-section">
                    <div className="footer-logo">
                        <VortexLogo size={32} />
                        <h3>VORTEX</h3>
                    </div>
                    <p className="footer-description">
                        منصة متكاملة لحلول الذكاء الاصطناعي والأتمتة الذكية.
                        نحول أفكارك إلى واقع رقمي بأحدث التقنيات.
                    </p>
                    <div className="footer-founder">
                        <p className="founder-label">المؤسس</p>
                        <p className="founder-name">محمد تيسير الغانم</p>
                    </div>
                </div>

                {/* القسم الثاني: روابط سريعة */}
                <div className="footer-section links-section">
                    <h3>روابط سريعة</h3>
                    <ul className="footer-links">
                        <li><Link to="/">الرئيسية</Link></li>
                        <li><Link to="/solutions">مختبر الابتكار</Link></li>
                        <li><Link to="/agents">وكلاء فورتكس</Link></li>
                        <li><Link to="/image-generator">مولد الصور AI</Link></li>
                        <li><Link to="/about">فلسفة العمل</Link></li>
                        <li><Link to="/contact">تواصل معنا</Link></li>
                    </ul>
                </div>

                {/* القسم الثالث: معلومات الاتصال */}
                <div className="footer-section contact-section">
                    <h3>معلومات الاتصال</h3>
                    <ul className="footer-contact">
                        <li>
                            <MapPin className="contact-icon" size={20} />
                            <span>الجمهورية العربية السورية</span>
                        </li>
                        <li>
                            <Mail className="contact-icon" size={20} />
                            <a href="mailto:vortexsas1@gmail.com">vortexsas1@gmail.com</a>
                        </li>
                        <li>
                            <Phone className="contact-icon" size={20} />
                            <a href="tel:+963980653019">+963 980 653 019</a>
                        </li>
                        <li>
                            <MessageCircle className="contact-icon whatsapp-icon" size={20} />
                            <a href="https://wa.me/963980653019" target="_blank" rel="noopener noreferrer">
                                واتساب
                            </a>
                        </li>
                    </ul>
                </div>

                {/* القسم الرابع: تابعنا */}
                <div className="footer-section social-section">
                    <h3>تابعنا</h3>
                    <div className="footer-social">
                        <a
                            href="https://www.facebook.com/share/1AQPkuxRkX/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn facebook-btn"
                            title="تابعنا على فيسبوك"
                        >
                            <Facebook size={24} />
                            <span>Facebook</span>
                        </a>
                        <a
                            href="https://wa.me/963980653019"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn whatsapp-btn"
                            title="راسلنا على واتساب"
                        >
                            <MessageCircle size={24} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                    <div className="footer-cta">
                        <Link to="/contact" className="footer-cta-btn">
                            ابدأ مشروعك الآن
                        </Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VORTEX - جميع الحقوق محفوظة</p>
                <p className="footer-credit">صُنع بـ ❤️ في سوريا</p>
            </div>
        </footer>
    );
};

export default Footer;
