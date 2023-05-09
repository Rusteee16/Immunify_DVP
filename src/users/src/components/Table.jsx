import React, { useEffect, useState } from "react";
import TableEntries from "./TableEntries";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";

function Table() {
    const [tableEntries, setEntries] = useState();
    const [userTransfers, setUserTransfers] = useState([]);
    var len = 0;

    //Fetch transfer records and also update frontend on transfering
    async function fetchTransfers() {
        const userTransfers = await immunify_dvp_backend.getTransferLedger(Principal.fromText("2ibo7-dia"), "user");
        setUserTransfers(userTransfers);
        if (userTransfers != undefined) {
            if (userTransfers.length < 1) {
                setEntries(<h4>No transactions done.</h4>)
            } else {
                setEntries(
                    userTransfers.map((transfer, index) => (
                        // console.log(transfer.receiverId)
                        <TableEntries receiverId={(transfer.receiverid).toText()} date={transfer.date} status={transfer.status} key={index} />
                    ))
                )
            }
        }
    };

    useEffect(() => {
        if (userTransfers != undefined || userTransfers.length > len || userTransfers.length < len) {
            len = userTransfers.length;
            fetchTransfers();
        }

    }, [userTransfers]);
    return (
        <div className="table-block rounded">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Receiver</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {tableEntries}
                </tbody>
            </table>
        </div>
    );
};

export default Table;