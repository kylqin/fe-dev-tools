import React from "react";
import bwipjs from 'bwip-js';
import { defaultOptions } from './barcode-settings';

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
    bwipjs.toCanvas(this.idSelector, { ...this.options });
  }
}

export const BarcodeRender = (props: { controller: BarcodeRenderController }) => {
  return <canvas id={props.controller.id}></canvas>
}