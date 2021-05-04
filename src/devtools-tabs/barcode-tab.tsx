import React, { useEffect, useState, createRef, useMemo } from "react";
import { DevpanelMessageCenter, DevpanelMessageType, DevpanelMessage } from "../devtools/devpanel-message-center";
import { BarcodeHistoryController, BarcodeHistory } from "./barcode-history";
import { BarcodeSettingItemController, BarcodeSettingItem } from "./barcode-setting-item";

import "./barcode-tab.less"
import { merge } from "../utils/listenable";
import { BarcodeRenderController, BarcodeRender } from "./barcode-render";

export const BarcodeTab = () => {
  const formRef = createRef<HTMLFormElement>();
  const inputRef = createRef<HTMLInputElement>();
  const barcodeRenderCtrl = useMemo(() => new BarcodeRenderController("barcode-render-id"), []);
  const barcodeHistoryCtrl = useMemo(() => new BarcodeHistoryController(), []);
  const barWidthCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 4, initialValue: barcodeRenderCtrl.options.width! }), []);
  const barHeightCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 50, max: 200, initialValue: barcodeRenderCtrl.options.height! }), []);

  useEffect(() => {
    let barcode = "Lorem Ipsum";
    const addBarcode = (newBarcode: string, fromHistory = false) => {
      if (newBarcode !== barcode && newBarcode !== "") {
        barcodeRenderCtrl.render(newBarcode);
        if (!fromHistory) {
          barcodeHistoryCtrl.add(newBarcode);
        }
        barcode = newBarcode;
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

      barWidthCtrl.onUpdate((width: number) => {
        barcodeRenderCtrl.update("width", width).render(barcode);
      }),
      barHeightCtrl.onUpdate((height: number) => {
        barcodeRenderCtrl.update("height", height).render(barcode);
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
      <div className="bottom">
        <div className="settings">
          <h1>设置</h1>
          <BarcodeSettingItem name="条码宽度" controller={barWidthCtrl}></BarcodeSettingItem>
          <BarcodeSettingItem name="条码高度" controller={barHeightCtrl}></BarcodeSettingItem>
        </div>
      </div>
      <div className="right">
        <div className="history">
          <h1>历史</h1>
          <BarcodeHistory controller={barcodeHistoryCtrl}></BarcodeHistory>
        </div>
      </div>
    </div>
  );
};
