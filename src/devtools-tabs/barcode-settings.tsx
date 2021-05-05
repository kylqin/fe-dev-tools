import React, { useEffect, useMemo } from "react";
import { BarcodeSettingItem, BarcodeSettingItemController } from "./barcode-setting-item";
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

export const BarcodeSettings = (props: { renderCtrl: BarcodeRenderController }) => {
  const scaleCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 6, initialValue: defaultOptions.scale! }), []);
  const paddingwidthCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 20, initialValue: defaultOptions.paddingwidth! }), []);
  const paddingheightCtrl = useMemo(() => new BarcodeSettingItemController({ type: "slider", min: 1, max: 20, initialValue: defaultOptions.paddingheight! }), []);

  useEffect(() => {
    const options: bwipjs.ToBufferOptions = Object.assign({}, props.renderCtrl.options);
    const sub = merge([
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

  return (<div className="barcode-settings">
    <div className="settings">
      <h1>设置</h1>
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
  { code: "gs1-128 ",name: "GS1-128" },
  { code: "gs1-128composite", name: "GS1-128 Composite" },
  { code: "gs1-cc",name: "GS1 Composite 2D Component" },
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
  { code: "japanpost",  name: "apan Post 4 State Customer Code" },
  { code: "kix",  name: "oyal Dutch TPG Post KIX" },
  { code: "leitcode",  name: "eutsche Post Leitcode" },
  { code: "mailmark",  name: "oyal Mail Mailmark" },
  { code: "matrix2of5",  name: "atrix 2 of 5" },
  { code: "maxicode",  name: "axiCode" },
  { code: "micropdf417",  name: "icroPDF417" },
  { code: "microqrcode",  name: "icro QR Code" },
  { code: "msi",  name: "SI Modified Plessey" },
  { code: "onecode",  name: "SPS Intelligent Mail" },
  { code: "pdf417",  name: "DF417" },
  { code: "pdf417compact",  name: "ompact PDF417" },
  { code: "pharmacode",  name: "harmaceutical Binary Code" },
  { code: "pharmacode2",  name: "wo-track Pharmacode" },
  { code: "planet",  name: "SPS PLANET" },
  { code: "plessey",  name: "lessey UK" },
  { code: "posicode",  name: "osiCode" },
  { code: "postnet",  name: "SPS POSTNET" },
  { code: "pzn",  name: "harmazentralnummer (PZN)" },
  { code: "qrcode",  name: "R Code" },
  { code: "rationalizedCodabar",  name: "odabar" },
  { code: "raw",  name: "ustom 1D symbology" },
  { code: "rectangularmicroqrcode",  name: "ectangular Micro QR Code" },
  { code: "royalmail",  name: "oyal Mail 4 State Customer Code" },
  { code: "sscc18",  name: "SCC-18" },
  { code: "symbol",  name: "iscellaneous symbols" },
  { code: "telepen",  name: "elepen" },
  { code: "telepennumeric",  name: "elepen Numeric" },
  { code: "ultracode",  name: "ltracode" },
  { code: "upca",  name: "PC-A" },
  { code: "upcacomposite",  name: "PC-A Composite" },
  { code: "upce",  name: "PC-E" },
  { code: "upcecomposite",  name: "PC-E Composite" }
];