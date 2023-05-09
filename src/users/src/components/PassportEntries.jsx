import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/passport";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfinitySpin } from 'react-loader-spinner';

function PassportEntries(props) {
    const [dvp, setDvp] = useState({
        name: "",
        no: "",
        country: "",
        sex: ""
    });
    const [date, setDate] = useState();
    const [image, setImage] = useState();
    const [owner, setOwner] = useState();
    const [button, setButton] = useState();
    const [receiverAddress, setReceiverAddress] = useState();
    const [loaderHidden, setLoaderHidden] = useState(true);

    const id = props.id;

    const localhost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localhost });
    agent.fetchRootKey();
    let receiverId;
    let PassportActor;

    //Fetching individual passport information
    async function loadPassport() {
        PassportActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: id,
        });

        const dvpass = await PassportActor.getPassport();
        setDvp({
            name: dvpass.passportName,
            no: dvpass.passportId,
            country: dvpass.nation,
            sex: dvpass.gender,
            vacName: dvpass.vacName,
            vacDate: dvpass.vacDate
        });
        const date = await PassportActor.getDate();
        setDate(date);
        const owner = await PassportActor.getOwner();
        setOwner(owner.toText());
        const imageData = await PassportActor.getImage();
        const imageContent = new Uint8Array(imageData);
        const image = URL.createObjectURL(
            new Blob([imageContent.buffer], { type: "image/png" })
        );
        setImage(image);

        setButton(<Button handleClick={handleTransfer} text={"Send"} />);
    }

    function handleTransfer() {
        setReceiverAddress(
            <input
                className="form-control"
                name="receiverId"
                value="uuc56-gyb"
                readOnly
            />
        );
        setButton(<Button handleClick={transferPassport} text={"Confirm"} />);
    };

    //Transfering passport to enterprise
    async function transferPassport() {
        setLoaderHidden(false);
        const publishResult = await immunify_dvp_backend.completeTransfer(props.id, Principal.fromText("2ibo7-dia"), Principal.fromText("uuc56-gyb"));
        console.log(publishResult);
        setLoaderHidden(true);
        if (publishResult === "Success") {
            toast.success('Passport Sent.');
        } else {
            toast.error("Failed to Send Passport.");
        }
    }

    useEffect(() => {
        loadPassport();
    }, []);

    return (
        <div className="col-lg-6 passport-col">
            <div className="passport rounded">
                <div className="passport_heading">
                    <h1>IMMUNIFY</h1>
                    <h3>Digital Vaccine Passport</h3>
                </div>
                <div className="passport_contents">
                    <div className="image">
                        <img src={image}></img>
                    </div>
                    <div className="passportDataLeft">
                        <p>Country Code</p>
                        <h5>{dvp.country}</h5>
                        <p>Name</p>
                        <h5>{dvp.name}</h5>
                        <p>Passport No</p>
                        <h5>{dvp.no}</h5>
                        <p>Sex</p>
                        <h5>{dvp.sex}</h5>
                    </div>
                    <div className="passportDataRight">
                        <p>Vaccine Taken</p>
                        <h5>{dvp.vacName}</h5>
                        <p>Vaccine Date</p>
                        <h5>{dvp.vacDate}</h5>
                        <p>DVP Issue Date</p>
                        <h5>{date}</h5>
                    </div>
                </div>
                <div className="passport-footer">
                    <p>Owner ID:{owner}</p>
                    <div>{loaderHidden ? <div> {receiverAddress} {button} <ToastContainer /></div> : <div className="loader">
                        <InfinitySpin
                            width='200'
                            color="#F9F7F7"
                        />
                    </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassportEntries;