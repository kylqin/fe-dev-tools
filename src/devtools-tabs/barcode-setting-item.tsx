import React, { useState, useMemo, useEffect } from "react";
import { SimpleListenable, Subscription } from "../utils/listenable";
import { ID } from "../utils/id";

export type BarcodeSettingItemOption = {
  value: string,
  label: string
}
export class BarcodeSettingItemController {
  private _value: string|number;
  public get value () {
    return this._value;
  }

  constructor(public props: { type: string, initialValue: string|number, min?: number, max?: number, options?: BarcodeSettingItemOption[]}) {
    this._value = props.initialValue;
  }

  private listenable = new SimpleListenable();
  private static updateType = 0;
  private static updateTypeForInternal = 1;
  onUpdate(callback: Function): Subscription {
    return this.listenable.listen(BarcodeSettingItemController.updateType, callback);
  }

  update(value: any) {
    this._value = value;
    this.listenable.trigger(BarcodeSettingItemController.updateType, value);
    this.listenable.trigger(BarcodeSettingItemController.updateTypeForInternal, value);
  }

  get internal () {
    return {
      onUpdate: (callback: Function) => {
        return this.listenable.listen(BarcodeSettingItemController.updateTypeForInternal, callback);
      },
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

  useEffect(() => {
    const sub = props.controller.internal.onUpdate((value: number) => { setVal(value); });
    return () => { sub.cancel(); };
  }, []);

  return <div className="setting-item">
    <span className="setting-item-name">{props.name}</span>
    <input
      className="setting-item-input"
      type="range"
      min={props.controller.props.min}
      max={props.controller.props.max}
      defaultValue={props.controller.value}
      onChange={e => {
        const val = parseInt(e.target.value);
        setVal(val);
        props.controller.internal.update(val);
      }}></input>
    <span className="setting-item-value">{val}</span>
  </div>
}


export const BarcodeSettingItemSelect = (props: BarcodeSettingItemProps) => {
  const [val, setVal] = useState(props.controller.value);

  useEffect(() => {
    const sub = props.controller.internal.onUpdate((value: number) => { setVal(value); });
    return () => { sub.cancel(); };
  }, []);

  return <div className="setting-item">
    <span className="setting-item-name">{props.name}</span>
    <select
      className="setting-item-input"
      value={val}
      onChange={e => {
        const val = e.target.value;
        setVal(val);
        props.controller.internal.update(val);
      }}>
      {props.controller.props.options!.map(o => {
        return <option key={o.value} value={o.value}>{o.label}</option>
      })}
    </select>
    <span className="setting-item-value">{val}</span>
  </div>
}

export const BarcodeSettingItemRadio = (props: BarcodeSettingItemProps) => {
  const [val, setVal] = useState(props.controller.value);
  const name = useMemo(ID, [])

  useEffect(() => {
    const sub = props.controller.internal.onUpdate((value: number) => { setVal(value); });
    return () => { sub.cancel(); };
  }, []);

  return <div className="setting-item">
    <span className="setting-item-name">{props.name}</span>
    <div className="setting-item-input" style={{ display: "flex" }}>
      {props.controller.props.options!.map((o) => {
        return <div key={o.value} className="setting-item-radio" onClick={e => {
            setVal(o.value);
            props.controller.internal.update(o.value);
          }}>
          <input type="radio" name={name} value={o.value} checked={o.value === val} onChange={() => {}}></input>
          <label>{o.label}</label>
        </div>
      })}
    </div>
    <span className="setting-item-value">{val}</span>
  </div>
}