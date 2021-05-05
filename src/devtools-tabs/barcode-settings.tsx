import React, { useEffect, useMemo, useState } from "react";
import { BarcodeSettingItem, BarcodeSettingItemController, BarcodeSettingItemSelect, BarcodeSettingItemRadio } from "./barcode-setting-item";
import bwipjs from 'bwip-js';
import { BarcodeRenderController } from "./barcode-render";
import { merge } from "../utils/listenable";

export const defaultOptions: bwipjs.ToBufferOptions = {
  bcid: "code128",
  text: "Lorem Ipsum",
  scale: 2,

  includetext: true,
  textxalign: "center",
  paddingheight: 10,
  paddingwidth: 10,
  backgroundcolor: "FFFFFF",
};

export class BarcodeSettingsController {
  public toggle() {
    this.setShow?.((show: boolean) => !show);
  }
  private setShow?: Function;
  public attch(setShow: Function) {
    this.setShow = setShow;
  }
}

export const BarcodeSettings = (props: { controller: BarcodeSettingsController, renderCtrl: BarcodeRenderController }) => {
  const typeCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", initialValue: "barcode", options: [{value: "barcode", label: "Barcode" }, { value: "qrcode", label: "QR Code"}]}), []);
  const bcidCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", initialValue: defaultOptions.bcid!, options: getBcidOptions()}), []);
  const scaleCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 6, initialValue: defaultOptions.scale! }), []);
  const paddingwidthCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 20, initialValue: defaultOptions.paddingwidth! }), []);
  const paddingheightCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 20, initialValue: defaultOptions.paddingheight! }), []);

  const [show, setShow] = useState(false);

  useEffect(() => {
    props.controller.attch(setShow);
    const options: bwipjs.ToBufferOptions = Object.assign({}, props.renderCtrl.options);
    const sub = merge([
      typeCtrl.onUpdate((type: string) => {
        if (type === "barcode") {
          bcidCtrl.update("code128");
        } else {
          bcidCtrl.update("qrcode");
        }
      }),
      bcidCtrl.onUpdate((bcid: string) => {
        options.bcid = bcid;
        props.renderCtrl.with(options).render();
      }),
      scaleCtrl.onUpdate((scale: number) => {
        options.scale = scale;
        props.renderCtrl.with(options).render();
      }),
      paddingwidthCtrl.onUpdate((paddingwidth: number) => {
        options.paddingwidth = paddingwidth;
        props.renderCtrl.with(options).render();
      }),
      paddingheightCtrl.onUpdate((paddingheight: number) => {
        options.paddingheight = paddingheight;
        props.renderCtrl.with(options).render();
      }),
    ]);

    return () => {
      sub.cancel();
    };
  }, []);

  return (<div className={"barcode-settings" + (!show ? " hide": "")}>
    <div className="settings">
      <h1>设置</h1>
      <BarcodeSettingItemRadio name="BCID" controller={typeCtrl}></BarcodeSettingItemRadio>
      <BarcodeSettingItemSelect name="BCID" controller={bcidCtrl}></BarcodeSettingItemSelect>
      <BarcodeSettingItem name="缩放" controller={scaleCtrl}></BarcodeSettingItem>
      <BarcodeSettingItem name="横向留白" controller={paddingwidthCtrl}></BarcodeSettingItem>
      <BarcodeSettingItem name="纵向留白" controller={paddingheightCtrl}></BarcodeSettingItem>
    </div>
  </div>)
}

const types = [
  { code: "auspost", name: "AusPost 4 State Customer Code" },
  { code: "azteccode", name: "Aztec Code" },
  { code: "azteccodecompact", name: "Compact Aztec Code" },
  { code: "aztecrune", name: "Aztec Runes" },
  { code: "bc412", name: "BC412" },
  { code: "channelcode", name: "Channel Code" },
  { code: "codablockf", name: "Codablock F" },
  { code: "code11", name: "Code 11" },
  { code: "code128", name: "Code 128" },
  { code: "code16k", name: "Code 16K" },
  { code: "code2of5", name: "Code 25" },
  { code: "code32", name: "Italian Pharmacode" },
  { code: "code39", name: "Code 39" },
  { code: "code39ext", name: "Code 39 Extended" },
  { code: "code49", name: "Code 49" },
  { code: "code93", name: "Code 93" },
  { code: "code93ext", name: "Code 93 Extended" },
  { code: "codeone", name: "Code One" },
  { code: "coop2of5", name: "COOP 2 of 5" },
  { code: "daft", name: "Custom 4 state symbology" },
  { code: "databarexpanded", name: "GS1 DataBar Expanded" },
  { code: "databarexpandedcomposite", name: "GS1 DataBar Expanded Composite" },
  { code: "databarexpandedstacked", name: "GS1 DataBar Expanded Stacked" },
  { code: "databarexpandedstackedcomposite", name: "GS1 DataBar Expanded Stacked Composite" },
  { code: "databarlimited", name: "GS1 DataBar Limited" },
  { code: "databarlimitedcomposite", name: "GS1 DataBar Limited Composite" },
  { code: "databaromni", name: "GS1 DataBar Omnidirectional" },
  { code: "databaromnicomposite", name: "GS1 DataBar Omnidirectional Composite" },
  { code: "databarstacked", name: "GS1 DataBar Stacked" },
  { code: "databarstackedcomposite", name: "GS1 DataBar Stacked Composite" },
  { code: "databarstackedomni", name: "GS1 DataBar Stacked Omnidirectional" },
  { code: "databarstackedomnicomposite", name: "GS1 DataBar Stacked Omnidirectional Composite" },
  { code: "databartruncated", name: "GS1 DataBar Truncated" },
  { code: "databartruncatedcomposite", name: "GS1 DataBar Truncated Composite" },
  { code: "datalogic2of5", name: "Datalogic 2 of 5" },
  { code: "datamatrix", name: "Data Matrix" },
  { code: "datamatrixrectangular", name: "Data Matrix Rectangular" },
  { code: "datamatrixrectangularextension", name: "Data Matrix Rectangular Extension" },
  { code: "dotcode", name: "DotCode" },
  { code: "ean13", name: "EAN-13" },
  { code: "ean13composite", name: "EAN-13 Composite" },
  { code: "ean14", name: "GS1-14" },
  { code: "ean2", name: "EAN-2 (2 digit addon)" },
  { code: "ean5", name: "EAN-5 (5 digit addon)" },
  { code: "ean8", name: "EAN-8" },
  { code: "ean8composite", name: "EAN-8 Composite" },
  { code: "flattermarken", name: "Flattermarken" },
  { code: "gs1-128", name: "GS1-128" },
  { code: "gs1-128composite", name: "GS1-128 Composite" },
  { code: "gs1-cc", name: "GS1 Composite 2D Component" },
  { code: "gs1datamatrix", name: "GS1 Data Matrix" },
  { code: "gs1datamatrixrectangular", name: "GS1 Data Matrix Rectangular" },
  { code: "gs1dotcode", name: "GS1 DotCode" },
  { code: "gs1northamericancoupon", name: "GS1 North American Coupon" },
  { code: "gs1qrcode", name: "GS1 QR Code" },
  { code: "hanxin", name: "Han Xin Code" },
  { code: "hibcazteccode", name: "HIBC Aztec Code" },
  { code: "hibccodablockf", name: "HIBC Codablock F" },
  { code: "hibccode128", name: "HIBC Code 128" },
  { code: "hibccode39", name: "HIBC Code 39" },
  { code: "hibcdatamatrix", name: "HIBC Data Matrix" },
  { code: "hibcdatamatrixrectangular", name: "HIBC Data Matrix Rectangular" },
  { code: "hibcmicropdf417", name: "HIBC MicroPDF417" },
  { code: "hibcpdf417", name: "HIBC PDF417" },
  { code: "hibcqrcode", name: "HIBC QR Code" },
  { code: "iata2of5", name: "IATA 2 of 5" },
  { code: "identcode", name: "Deutsche Post Identcode" },
  { code: "industrial2of5", name: "Industrial 2 of 5" },
  { code: "interleaved2of5", name: "Interleaved 2 of 5 (ITF)" },
  { code: "isbn", name: "ISBN" },
  { code: "ismn", name: "ISMN" },
  { code: "issn", name: "ISSN" },
  { code: "itf14", name: "ITF-14" },
  { code: "japanpost", name: "Japan Post 4 State Customer Code" },
  { code: "kix", name: "Royal Dutch TPG Post KIX" },
  { code: "leitcode", name: "Deutsche Post Leitcode" },
  { code: "mailmark", name: "Royal Mail Mailmark" },
  { code: "matrix2of5", name: "Matrix 2 of 5" },
  { code: "maxicode", name: "MaxiCode" },
  { code: "micropdf417", name: "MicroPDF417" },
  { code: "microqrcode", name: "Micro QR Code" },
  { code: "msi", name: "MSI Modified Plessey" },
  { code: "onecode", name: "USPS Intelligent Mail" },
  { code: "pdf417", name: "PDF417" },
  { code: "pdf417compact", name: "Compact PDF417" },
  { code: "pharmacode", name: "Pharmaceutical Binary Code" },
  { code: "pharmacode2", name: "Two-track Pharmacode" },
  { code: "planet", name: "USPS PLANET" },
  { code: "plessey", name: "Plessey UK" },
  { code: "posicode", name: "PosiCode" },
  { code: "postnet", name: "USPS POSTNET" },
  { code: "pzn", name: "Pharmazentralnummer (PZN)" },
  { code: "qrcode", name: "QR Code" },
  { code: "rationalizedCodabar", name: "Codabar" },
  { code: "raw", name: "Custom 1D symbology" },
  { code: "rectangularmicroqrcode", name: "Rectangular Micro QR Code" },
  { code: "royalmail", name: "Royal Mail 4 State Customer Code" },
  { code: "sscc18", name: "SSCC-18" },
  { code: "symbol", name: "Miscellaneous symbols" },
  { code: "telepen", name: "Telepen" },
  { code: "telepennumeric", name: "Telepen Numeric" },
  { code: "ultracode", name: "Ultracode" },
  { code: "upca", name: "UPC-A" },
  { code: "upcacomposite", name: "UPC-A Composite" },
  { code: "upce", name: "UPC-E" },
  { code: "upcecomposite", name: "UPC-E Composite" },
];

function getBcidOptions() {
  return types.map(t => ({ value: t.code, label: t.name }));
}
