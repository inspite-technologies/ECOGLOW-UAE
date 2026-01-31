import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";

const PublicLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>
            {!isHomePage && <PageHeader />}
            <Outlet />
            {!isHomePage && <Footer />}
        </>
    );
};

export default PublicLayout;
