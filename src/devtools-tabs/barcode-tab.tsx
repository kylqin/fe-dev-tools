import React, { useEffect, createRef, useMemo } from "react";
import { DevpanelMessageCenter, DevpanelMessageType, DevpanelMessage } from "../devtools/devpanel-message-center";
import { BarcodeHistoryController, BarcodeHistory } from "./barcode-history";
import { merge } from "../utils/listenable";
import { BarcodeRenderController, BarcodeRender } from "./barcode-render";
import { BarcodeSettings, BarcodeSettingsController } from "./barcode-settings";

import "./barcode-tab.less"

export const BarcodeTab = () => {
  const formRef = createRef<HTMLFormElement>();
  const inputRef = createRef<HTMLInputElement>();
  const barcodeRenderCtrl = useMemo(() => new BarcodeRenderController("barcode-render-id"), []);
  const barcodeSettingsCtrl = useMemo(() => new BarcodeSettingsController(), []);
  const barcodeHistoryCtrl = useMemo(() => new BarcodeHistoryController(), []);

  useEffect(() => {
    let barcode = "Lorem Ipsum";
    const addBarcode = (newBarcode: string, fromHistory = false) => {
      if (newBarcode !== barcode && newBarcode !== "") {
        barcodeRenderCtrl.render(newBarcode);
        barcode = newBarcode;
        if (!fromHistory) {
          barcodeHistoryCtrl.add(newBarcode);
        }
        console.log('render barcode:', newBarcode);
      }
    }
    const handleSubmit = (event: Event) => {
      event.preventDefault();
      addBarcode(inputRef.current?.value as string);
    }
    formRef.current?.addEventListener("submit", handleSubmit);
    const sub = merge([
      DevpanelMessageCenter.instance.listen<string>(DevpanelMessageType.showBarcode, (msg: DevpanelMessage<string>) => {
        addBarcode(msg.payload);
      }),

      barcodeHistoryCtrl.onSelect((barcode: string) => {
        addBarcode(barcode, true);
      }),
    ]);

    barcodeRenderCtrl.render(barcode);

    return () => {
      formRef.current?.removeEventListener("submit", handleSubmit);
      sub.cancel();
    };
  }, []);

  return (
    <div className="barcode-tab-container">
      <div className="barcode-result">
        <form ref={formRef}>
          <input className="barcode-input" ref={inputRef} type="text"></input>
        </form>
        <BarcodeRender controller={barcodeRenderCtrl}></BarcodeRender>
      </div>
      <div className="right">
        <div className="history">
          <h1>历史</h1>
          <BarcodeHistory controller={barcodeHistoryCtrl}></BarcodeHistory>
        </div>
      </div>

      <BarcodeSettings controller={barcodeSettingsCtrl} renderCtrl={barcodeRenderCtrl}></BarcodeSettings>
      <div className="barcode-settings-button" onClick={(e) => {
        barcodeSettingsCtrl.toggle();
      }}>设置</div>
    </div>
  );
};
