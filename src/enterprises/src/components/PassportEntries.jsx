import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfinitySpin } from 'react-loader-spinner';
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
    // const [receiverAddress, setReceiverAddress] = useState();
    const [loaderHidden, setLoaderHidden] = useState(true);

    const id = props.id;

    const localhost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localhost });
    agent.fetchRootKey();
    let receiverId;
    let PassportActor;

    //To fetch the passport information
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

        // setButton(<Button handleClick={handlePublish} text={"Publish"} />);
    }

    //Passport approving functionality
    async function transferPassportPass() {
        setLoaderHidden(false);
        const publishResult = await immunify_dvp_backend.transferDecision(props.id, Principal.fromText("uuc56-gyb"), Principal.fromText("2ibo7-dia"), "Approved", date);
        console.log(publishResult);
        setLoaderHidden(true);
        if (publishResult == "Success") {
            toast.success('Passport Approved.');
        } else {
            toast.error("Failed to Approve Passport.");
        }
    };

    //Passport rejecting functionality 
    async function transferPassportFail() {
        setLoaderHidden(false);
        const publishResult = await immunify_dvp_backend.transferDecision(props.id, Principal.fromText("uuc56-gyb"), Principal.fromText("2ibo7-dia"), "Rejected", date);
        console.log(publishResult);
        setLoaderHidden(true);
        if (publishResult === "Success") {
            toast.success('Passport Rejected.');
        } else {
            toast.error("Failed to Reject Passport.");
        }
        useEffect(() => {
            loadPassport();
        }, []);
    };

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
                    <div> {loaderHidden ? <><button className="btn btn-sm btn-outline-success passport-button" onClick={transferPassportPass}>Approve</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={transferPassportFail}>Reject</button>
                        <ToastContainer /></> : <div className="loader">
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