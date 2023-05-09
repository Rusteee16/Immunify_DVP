import React from "react";

function TableEntries(props) {

    return (
        <tr>
            <td>{props.receiverId}</td>
            <td>{props.date}</td>
            <td className="table-status-entry"><span className={props.status === "Approved" ? "badge text-bg-success" : "badge text-bg-danger"}>{props.status}</span></td>
        </tr>
    );
};

export default TableEntries;