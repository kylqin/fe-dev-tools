import React from "react";
import ReactDOM from "react-dom";
import { DevpanelMessageCenter } from "./devpanel-message-center";
import { BarcodeTab } from "../devtools-tabs/barcode-tab";
import "../shared.css";

;(window as any).devpanelMessageCenter = DevpanelMessageCenter.instance;

const Popup = () => {
  return (
    <>
      <BarcodeTab></BarcodeTab>
      <div id="app-message" style={{ display: "flex", justifyContent: "center" }}></div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
