import { immunify_dvp_backend } from "../../declarations/immunify_dvp_backend";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";


const root = ReactDOM.createRoot(document.getElementById("root"));
const init = async () => {
    root.render(
        <App />
    );
};

init();