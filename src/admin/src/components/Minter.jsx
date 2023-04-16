import React, { Component, useEffect, useState } from "react";
var _ = require('lodash');
import { useForm } from "react-hook-form";
import { immunify_dvp_backend } from "../../../declarations/immunify_dvp_backend";
import { ReactCountryDropdown } from 'react-country-dropdown';
import 'react-country-dropdown/dist/index.css';
import { Principal } from "@dfinity/principal";
import { InfinitySpin } from 'react-loader-spinner';
import Button from "./Button";


function Minter() {

    const { register, handleSubmit } = useForm();
    const [newPassportID, setNewPassportId] = useState("");
    const [loaderHidden, setLoaderHidden] = useState(true);
    const [nation, setNation] = useState("");

    function getDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return (dd + '/' + mm + '/' + yyyy);
    };

    function handleSelect(country) {
        setNation(country.name);
    };

    async function onSubmit(data) {
        setLoaderHidden(false);
        const image = data.photo[0];
        const imageByteData = [...new Uint8Array(await (image).arrayBuffer())];
        const passportName = _.startCase(data.fname + " " + data.mname + " " + data.lname);
        const passportId = data.passNo;
        const country = nation;
        const sex = data.sex;
        const vacName = data.vacName;
        const vacDate = data.vacDate;
        const issueD = getDate();
        const owner = Principal.fromText("2ibo7-dia");
        console.log(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, imageByteData);

        const newPassportID = await immunify_dvp_backend.mint(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, imageByteData);
        setNewPassportId(newPassportID);
        console.log(newPassportID.toText());
        setLoaderHidden(true);
    }

    return (
        <div className="minter-screen">
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="minter-form rounded">
                        <h1>New Passport Minter</h1>
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
                                    <input {...register("vacDate", { required: true })} type="date" className="form-control" placeholder="Vaccine Date" />
                                </div>
                            </div>
                            <div className="row minter-input">
                                <div className="col-md">
                                    <input {...register("photo", { required: true })} type="file" className="form-control" placeholder="Choose Image" />
                                </div>
                            </div>
                            <div className="col-md">
                                <input type="text" className="form-control" name="country" value="2ibo7-dia" readOnly />
                            </div>
                            <div className="loader" hidden={loaderHidden}>
                                <InfinitySpin
                                    width='200'
                                    color="#112D4E"
                                />
                            </div>
                            <div className="minter-button" hidden={!loaderHidden}>
                                <span onClick={handleSubmit(onSubmit)}>
                                    Mint!
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    );
};

export default Minter;