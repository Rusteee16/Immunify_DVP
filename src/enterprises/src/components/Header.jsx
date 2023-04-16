import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";
import PassportGrid from "./PassportGrid";
import Title from "./Title";

function Header() {
    const [userOwnedPassports, setOwnedPassports] = useState();

    async function getPassports() {
        const userPassporIds = await immunify_dvp_backend.getOwnedPassports(Principal.fromText("uuc56-gyb"));
        console.log(userPassporIds);
        setOwnedPassports(<PassportGrid ids={userPassporIds} />);
    };

    useEffect(() => {
        getPassports();
    }, []);

    return (
        <BrowserRouter forceRefresh={true}>
            <div className="app-root-1">
                <header className="header-root">
                    <div className="header-div">
                        <Link to="/">
                            <h5 className="header-brand">Immunify</h5>
                        </Link>
                        <div className="header-empty"></div>
                        <button className="header-button"><Link to="/passports">Passports</Link></button>
                        <button className="header-button">LogOut</button>
                    </div>
                </header>
            </div>
            <Routes>
                <Route exact path="/"
                    element={<Title />}>
                </Route>
                <Route exact path="/passports"
                    element={userOwnedPassports}>
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default Header;

