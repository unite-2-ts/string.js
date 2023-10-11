import BString from "../src/js/index.mjs"

// BE ACCURE - UNICODE SAMPLE STRING!
const EXAMPLE0 = "a Ā 𐀀 文 🦄";

//
const _utf8bytes_ = BString.as(EXAMPLE0, "utf8_bytes");
const _utf8_ = EXAMPLE0;
const _base64_valid_ = "YSDEgCDwkICAIOaWhyDwn6aE";

//
console.log(_utf8_);
console.log(_utf8bytes_);
console.log(BString.as(_utf8bytes_, "bytes_utf8"));

//
console.log(BString.as(_utf8_, "utf8_base64"));
console.log(BString.as(_utf8bytes_, "bytes_base64"));
console.log(BString.as(_utf8_, "utf8_raw"));
console.log(BString.as(_utf8bytes_, "bytes_raw"));

//
const _utf16bytes_ = BString.as(EXAMPLE0, "utf16_bytes");
const _utf16_ = EXAMPLE0;

//
console.log(_utf16_);
console.log(_utf16bytes_);
console.log(BString.as(_utf16bytes_, "bytes_utf16"));

//
console.log(BString.as(_utf16_, "utf16_base64"));
console.log(BString.as(_utf16bytes_, "bytes_base64"));
console.log(BString.as(_utf16_, "utf16_raw"));
console.log(BString.as(_utf16bytes_, "bytes_raw"));
