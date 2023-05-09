import React, { useEffect, useState } from "react";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";
import "../../assets/users.css";
import PassportGrid from "./PassportGrid";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
    const [userOwnedPassports, setOwnedPassports] = useState();

    //Fetching the count and genrating the grid for passports to display
    async function getPassports() {
        const userPassporIds = await immunify_dvp_backend.getOwnedPassports(Principal.fromText("2ibo7-dia"));
        setOwnedPassports(<PassportGrid ids={userPassporIds} />);
    };

    useEffect(() => {
        getPassports();
    }, []);
    return (
        <>
            <Header />
            <Routes>
                <Route path="/users" element={<Title />} />
                <Route path="/users/passports" element={userOwnedPassports} />
            </Routes>
            <Footer />
        </>
    );
};

export default App;
