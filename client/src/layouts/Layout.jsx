import Header from "./../components/header/Header";
import Footer from "./../components/footer/Footer";
import Routers from "../routes/Routers";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
// import SmoothScroll from "../components/SmoothScroll";
const Layout = () => {
    return (
        <>
          {/* <SmoothScroll/> */}
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
