import React from "react";
import bwipjs from 'bwip-js';
import { defaultOptions } from './barcode-settings';
import { showMessage } from "../utils/message";

export class BarcodeRenderController {
  public options: bwipjs.ToBufferOptions = Object.assign({}, defaultOptions);
  private barcode: string = "";
  private idSelector: string;

  constructor(public id: string) {
    this.idSelector = `#${id}`;
  }

  update(key: string, value: any) {
    (this.options as any)[key] = value;
    return this;
  }

  with(options: bwipjs.ToBufferOptions ) {
    this.options = { ...options, text: this.barcode };
    return this;
  }

  render(barcode?: string) {
    if (barcode) {
      this.barcode = barcode;
      this.options.text = barcode;
    }
    try {
      bwipjs.toCanvas(this.idSelector, { ...this.options });
    } catch(e) {
      // alert(e);
      showMessage(e.toString());
    }
  }
}

export const BarcodeRender = (props: { controller: BarcodeRenderController }) => {
  return <canvas id={props.controller.id}></canvas>
}