import {UTF8, UTF16, Text, Bytes} from "../src/js/index.mjs"

// BE ACCURE - UNICODE SAMPLE STRING!
const EXAMPLE0 = "a Ā 𐀀 文 🦄";

//
const _utf8bytes_ = UTF8.as(EXAMPLE0, "bytes");
const _utf8_ = EXAMPLE0;
const _base64_valid_ = "YSDEgCDwkICAIOaWhyDwn6aE";

//
console.log(_utf8_);
console.log(_utf8bytes_);
console.log(Bytes.as(_utf8bytes_, "utf8"));

//
console.log(Text.as(_utf8_, "utf8_base64"));
console.log(Bytes.as(_utf8bytes_, "base64"));
console.log(Text.as(_utf8_, "utf8_raw"));
console.log(Bytes.as(_utf8bytes_, "raw"));

//
const _utf16bytes_ = UTF16.as(EXAMPLE0, "bytes");
const _utf16_ = EXAMPLE0;

//
console.log(_utf16_);
console.log(_utf16bytes_);
console.log(Bytes.as(_utf16bytes_, "utf16"));

//
console.log(Text.as(_utf16_, "utf16_base64"));
console.log(Bytes.as(_utf16bytes_, "base64"));
console.log(Text.as(_utf16_, "utf16_raw"));
console.log(Bytes.as(_utf16bytes_, "raw"));
