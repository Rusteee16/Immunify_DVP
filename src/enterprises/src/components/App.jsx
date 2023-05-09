import React, { useEffect, useState } from "react";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";
import "../../assets/enterprises.css";
import PassportGrid from "./PassportGrid";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
    const [userOwnedPassports, setOwnedPassports] = useState();

    //Mapping all the passports of the user to display
    async function getPassports() {
        const userPassporIds = await immunify_dvp_backend.getOwnedPassports(Principal.fromText("uuc56-gyb"));
        console.log(userPassporIds);
        setOwnedPassports(<PassportGrid ids={userPassporIds} />);
    };

    useEffect(() => {
        getPassports();
    }, []);
    return (
        <>
            <Header />
            <Routes>
                <Route path="/enterprises" element={<Title />} />
                <Route exact path="/enterprises/passports" element={userOwnedPassports} />
            </Routes>
            <Footer />
        </>
    );
};

export default App;
