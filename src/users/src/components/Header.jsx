import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import PassportGrid from "./PassportGrid";
import Title from "./Title";

function Header() {

    return (
        <div className="app-root-1">
            <header className="header-root">
                <div className="header-div">
                    <Link to="/users"><h5 className="header-brand">Immunify</h5></Link>
                    <div className="header-empty"></div>
                    <Link to="/users/passports"><button className="header-button">Passports</button></Link>
                    <button className="header-button">LogOut</button>
                </div>
            </header>
        </div>
    );
};

export default Header;

