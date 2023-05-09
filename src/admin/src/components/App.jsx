import React from "react";
import "../../assets/admin.css";
import Header from "./Header";
import Footer from "./Footer";
import Minter from "./Minter";
import Title from "./Title";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/admin" element={<Title />} />
                <Route path="/admin/minter" element={<Minter />} />
            </Routes>
            <Footer />
        </>
    );
};

export default App;
