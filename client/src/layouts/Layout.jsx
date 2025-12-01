import Header from "./../components/header/Header";
import Footer from "./../components/footer/Footer";
import Routers from "../routes/Routers";
import WhatsAppButton from "../components/WhatsAppButton.jsx";

const Layout = () => {
    return (
        <>
            <Header />
            <main className="min-h-[60vh] w-[100%]0">
                <Routers />
                <WhatsAppButton />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
