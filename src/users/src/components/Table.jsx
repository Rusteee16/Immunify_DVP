import React from "react";
import TableEntries from "./TableEntries";

function Table(){
    return(
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
                    <TableEntries/>
                </tbody>
            </table>
        </div>
    );
};

export default Table;