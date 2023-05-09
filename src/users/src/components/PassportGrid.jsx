import React, { useEffect, useState } from "react";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import PassportEntries from "./PassportEntries";
import { Principal } from "@dfinity/principal";
import Table from "./Table";

function PassportGrid(props) {

    const [passportEntries, setEntries] = useState();
    const [userPassportIds, setUserPassportIds] = useState([]);
    var len = 0;

    //Fetch all the passports to be displayed and updates upon transfer
    async function fetchPassports() {
        const userPassportIds = await immunify_dvp_backend.getOwnedPassports(Principal.fromText("2ibo7-dia"));
        setUserPassportIds(userPassportIds);
        if (userPassportIds != undefined) {
            if (userPassportIds.length < 1) {
                setEntries(<h4>There are no passports registered.</h4>)
            } else {
                setEntries(
                    userPassportIds.map((PassportId) => (
                        <PassportEntries id={PassportId} key={PassportId.toText()} />
                    ))
                )
            }
        }

    }

    useEffect(() => {
        if (userPassportIds != undefined || userPassportIds.length > len || userPassportIds.length < len) {
            len = userPassportIds.length;
            fetchPassports();
        }
    }, [userPassportIds]);

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

