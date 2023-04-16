import React from "react";
import passport from "../../assets/passport.svg";

function Title() {
    return (
        <div className="row home-title">
            <div className="col-lg-6">
                <h1>IMMUNIFY</h1>
                <h2>Digital Vaccine Passport</h2>
                <p>Digital Vaccine Passports in the form of NFT. Access all your passports at one place.</p>
            </div>
            <div className="col-lg-6 home-img">
                <img className="home-img" src={passport} />
            </div>
        </div>
    );
};

export default Title;