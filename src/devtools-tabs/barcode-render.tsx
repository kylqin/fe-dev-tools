import React from "react";
import JsBarcode from "jsbarcode";

const defaultOptions: JsBarcode.Options = {
  format: "CODE128",
  width: 2,
  height: 100,
  displayValue: true,
  text: undefined,
  fontOptions: "",
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  marginRight: undefined,
  valid: function (valid) {}
};

export class BarcodeRenderController {
  public options: JsBarcode.Options = Object.create(defaultOptions);

  constructor(public id: string) {}

  update(key: string, value: any) {
    (this.options as any)[key] = value;
    return this;
  }

  render(barcode: string) {
    JsBarcode(`#${this.id}`, barcode, this.options);
  }
}

export const BarcodeRender = (props: { controller: BarcodeRenderController }) => {
  return <svg id={props.controller.id}></svg>;
}