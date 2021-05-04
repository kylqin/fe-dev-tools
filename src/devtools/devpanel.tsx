import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DevpanelMessageCenter, DevpanelMessageType, DevpanelMessage } from "./devpanel-message-center";

;(window as any).devpanelMessageCenter = DevpanelMessageCenter.instance;

const Popup = () => {
  const [msg, setMsg] = useState("[msg]");

  useEffect(() => {
    DevpanelMessageCenter.instance.listen<string>(DevpanelMessageType.showBarcode, (msg: DevpanelMessage<string>) => {
      setMsg(msg.payload);
    });
  }, []);

  return (
    <>
      msg: -=-{msg}-=-
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
