import React, { useEffect, useState } from "react";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import PassportEntries from "./PassportEntries";
import { Principal } from "@dfinity/principal";
import image from "../../assets/download.jpeg";
import Table from "./Table";

function PassportGrid(props) {

    const [passportEntries, setEntries] = useState();

    async function fetchPassports() {
        await immunify_dvp_backend.getDupPrincipal();
        const userPassporIds = await immunify_dvp_backend.getOwnedPassports(Principal.fromText("uuc56-gyb"));
        if (userPassporIds != undefined) {
            setEntries(
                userPassporIds.map((PassportId) => (
                    <PassportEntries id={PassportId} key={PassportId.toText()} />
                ))
            )
        }
    }

    useEffect(() => {
        fetchPassports();
    }, []);


    return (
        <div className="passport-screen">
            <h3 className="passport-heading">Welcome.</h3>
            <div className="row passport-row">
                <div className="col-lg-7 passport-block rounded">
                    <div className="row">
                        {passportEntries}
                    </div>
                </div>
                <div className="col-lg-1"></div>
                <div className="col-lg-4 table-col">
                    <Table />
                </div>
            </div>
        </div>
    );
};

export default PassportGrid;

