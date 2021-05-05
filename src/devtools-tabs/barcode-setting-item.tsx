import React, { useState } from "react";
import { SimpleListenable, Subscription } from "../utils/listenable";

export class BarcodeSettingItemController {
  private _value: number;
  public get value () {
    return this._value;
  }

  constructor(public props: { type: string, min: number, max: number, initialValue: number }) {
    this._value = props.initialValue;
  }

  private listenable = new SimpleListenable();
  private static updateType = 0;
  onUpdate(callback: Function): Subscription {
    return this.listenable.listen(BarcodeSettingItemController.updateType, callback);
  }

  get internal () {
    return {
      update: (value: any) => {
        this._value = value;
        this.listenable.trigger(BarcodeSettingItemController.updateType, value);
      }
    };
  }
}

type BarcodeSettingItemProps = { name: string, controller: BarcodeSettingItemController };

export const BarcodeSettingItem = (props: BarcodeSettingItemProps) => {
  const [val, setVal] = useState(props.controller.value);

  return <div className="setting-item">
    <span className="setting-item-name">{props.name}</span>
    <input
     className="setting-item-input"
     type="range"
     step="0.1"
     min={props.controller.props.min}
     max={props.controller.props.max}
     defaultValue={props.controller.value}
     onChange={e => {
      //  console.log("barcode-setting-item: onChange", e);
       const val = parseInt(e.target.value);
       setVal(val);
       props.controller.internal.update(val);
     }}></input>
     <span className="setting-item-value">{val}</span>
  </div>
}
