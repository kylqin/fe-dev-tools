import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DevpanelMessageCenter, DevpanelMessageType, DevpanelMessage } from "./devpanel-message-center";
import { BarcodeTab } from "../devtools-tabs/barcode-tab";

;(window as any).devpanelMessageCenter = DevpanelMessageCenter.instance;

const Popup = () => {
  return (
    <>
      <BarcodeTab></BarcodeTab>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
