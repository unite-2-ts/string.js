import BString from "../src/js/index.mjs"

// BE ACCURE - UNICODE SAMPLE STRING!
const EXAMPLE0 = "a Ā 𐀀 文 🦄";

//
const _utf8ui8_ = BString.as(EXAMPLE0, "utf8_ui8");
const _utf8_ = EXAMPLE0;
const _base64_valid_ = "YSDEgCDwkICAIOaWhyDwn6aE";

//
console.log(_utf8_);
console.log(_utf8ui8_);
console.log(BString.as(_utf8ui8_, "ui8_utf8"));

//
console.log(BString.as(_utf8_, "utf8_base64"));
console.log(BString.as(_utf8ui8_, "ui8_base64"));
console.log(BString.as(_utf8_, "utf8_bin"));
console.log(BString.as(_utf8ui8_, "ui8_bin"));

//
const _utf16ui8_ = BString.as(EXAMPLE0, "utf16_ui8");
const _utf16_ = EXAMPLE0;

//
console.log(_utf16_);
console.log(_utf16ui8_);
console.log(BString.as(_utf16ui8_, "ui8_utf16"));

//
console.log(BString.as(_utf16_, "utf16_base64"));
console.log(BString.as(_utf16ui8_, "ui8_base64"));
console.log(BString.as(_utf16_, "utf16_bin"));
console.log(BString.as(_utf16ui8_, "ui8_bin"));
