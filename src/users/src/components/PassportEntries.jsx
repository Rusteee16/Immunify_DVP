import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/passport";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { Principal } from "@dfinity/principal";

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

    const id = props.id;

    const localhost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localhost });
    agent.fetchRootKey();
    let receiverId;
    let PassportActor;

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

        setButton(<Button handleClick={handlePublish} text={"Publish"} />);
    }

    function handlePublish() {
        setReceiverAddress(
            <input
                name="receiverId"
                value="uuc56-gyb"
                readOnly
            />
        );
        setButton(<Button handleClick={publishPassport} text={"Confirm"} />);
    };

    async function publishPassport() {
        const publishResult = await immunify_backend.publishPassports(props.id, Principal.fromText(receiverId));
        console.log(publishResult);
        if (publishResult === "Success") {
            const immunifyId = await immunify_backend.getImmunifyCanisterId();
            const transferResult = await PassportActor.transferOwnership(immunifyId);
            console.log(transferResult);
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
                    {receiverAddress}
                    {button}
                </div>
            </div>
        </div>
    );
};

export default PassportEntries;