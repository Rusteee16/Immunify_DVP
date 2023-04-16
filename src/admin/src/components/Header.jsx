import React from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function Header() {

    return (
        <div className="app-root-1">
            <header className="header-root">
                <div className="header-div">
                    <h5 className="header-brand">Immunify</h5>
                    <div className="header-empty"></div>
                    <button className="header-button">Minter</button>
                    <button className="header-button">LogOut</button>
                </div>
            </header>
        </div>
    );
};

export default Header;

