import {UTF8} from "../src/js/index.mjs"

// BE ACCURE - UTF8 SAMPLE STRING!
const EXAMPLE0 = "a Ā 𐀀 文 🦄";

//
const _uint8_ = UTF8.Bytes.from(EXAMPLE0, "utf8");
const _utf8_ = EXAMPLE0;
const _base64_valid_ = "YSDEgCDwkICAIOaWhyDwn6aE";

//
console.log(_utf8_);
console.log(_uint8_);

//
console.log(UTF8.as(_utf8_, "utf8_base64"));
console.log(UTF8.Bytes.as(_uint8_, "utf8_base64"));
console.log(UTF8.as(_utf8_, "utf8_raw"));
console.log(UTF8.Bytes.as(_uint8_, "utf8_raw"));
