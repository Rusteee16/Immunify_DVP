import React, { Component, useEffect, useState } from "react";
var _ = require('lodash');
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { ReactCountryDropdown } from 'react-country-dropdown';
import 'react-country-dropdown/dist/index.css';
import { Principal } from "@dfinity/principal";
import { InfinitySpin } from 'react-loader-spinner';
import Button from "./Button";


function Minter() {

    const { register, handleSubmit, reset } = useForm();
    const [newPassportID, setNewPassportId] = useState("");
    const [loaderHidden, setLoaderHidden] = useState(true);
    const [nation, setNation] = useState("");

    //Get the date of passport minting
    function getDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return (yyyy + '-' + mm + '-' + dd);
    };

    //handling country select dropdown
    function handleSelect(country) {
        setNation(country.name);
    };

    //passport minting process
    async function onSubmit(data) {
        setLoaderHidden(false);
        const image = data.photo[0];
        const imageByteData = [...new Uint8Array(await (image).arrayBuffer())];
        const passportName = _.startCase(data.fname + " " + data.lname);
        const passportId = data.passNo;
        const country = nation;
        const sex = data.sex;
        const vacName = data.vacName;
        const vacDate = data.vacDate;
        const issueD = getDate();
        //User owner id
        const owner = Principal.fromText("2ibo7-dia");
        // console.log(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, imageByteData);

        //Minting process started, returns principal of the passport generated
        const newPassportID = await immunify_dvp_backend.mint(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, imageByteData);
        setNewPassportId(newPassportID);
        // console.log(newPassportID.toText());
        setLoaderHidden(true);
        if (newPassportID) {
            reset();
            toast.success('Minted Successfully.');
        } else {
            toast.error("Error. Passport not minted.");
        }
    }

    return (
        <div className="minter-screen">
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="minter-form rounded">
                        <h1>Passport Minter</h1>
                        <form>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("fname", { required: true })} type="text" className="form-control" placeholder="First Name" />
                                </div>
                                <div className="col-md">
                                    <input {...register("lname", { required: true })} type="text" className="form-control" placeholder="Last name" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("passNo", { required: true })} type="text" className="form-control" placeholder="Passport No" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md-3">
                                    <ReactCountryDropdown onSelect={handleSelect} countryCode='IN' />
                                </div>
                                <div className="col-md-9">
                                    <select {...register("sex", { required: true })} className="form-select" id="Gender">
                                        <option selected>Choose...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("vacName", { required: true })} type="text" className="form-control" placeholder="Vaccine Name" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("vacDate", { required: true })} type="date" className="form-control" placeholder="Vaccine Date" pattern="\d{2}/\d{2}/\d{4}" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("photo", { required: true })} type="file" className="form-control" placeholder="Upload Image" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input type="text" className="form-control" name="country" value="2ibo7-dia" readOnly />
                                </div>
                            </div>
                            <div>
                                {loaderHidden ? <div className="minter-button">
                                    <span onClick={handleSubmit(onSubmit)}>
                                        Mint!
                                    </span>
                                    <ToastContainer />
                                </div> : <div className="loader">
                                    <InfinitySpin
                                        width='200'
                                        color="#112D4E"
                                    />
                                </div>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Minter;