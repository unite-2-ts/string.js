import {UTF8, Bytes} from "../src/js/index.mjs"

// BE ACCURE - UTF8 SAMPLE STRING!
const EXAMPLE0 = "a Ā 𐀀 文 🦄";

//
const _uint8_ = Bytes.from(EXAMPLE0, "utf8");
const _utf8_ = EXAMPLE0;
const _base64_valid_ = "YSDEgCDwkICAIOaWhyDwn6aE";

//
console.log(_utf8_);
console.log(_uint8_);

//
console.log(UTF8.as(_utf8_, "base64"));
console.log(Bytes.as(_uint8_, "base64"));
console.log(UTF8.as(_utf8_, "raw"));
console.log(Bytes.as(_uint8_, "raw"));
