import "./App.css";
import './index.css';
import Layout from "./layouts/Layout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SitePrivacyNotice  from "./components/SitePrivacyNotice.jsx";
import FacebookPixel from "./components/Analytics/FacebookPixel.jsx";

function App() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }, [pathname]);
    return (
        <> 
            <FacebookPixel />
            <SitePrivacyNotice />
            <Layout />
        </>
    );
}

export default App;
