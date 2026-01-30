import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                {children}
            </main>
            <Footer />
            <ChatBot />
        </>
    );
};

export default Layout;

