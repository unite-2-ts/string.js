// WDYM? We means "interpretation" and "representation"...
// "raw" - just bytes, but in string
// "utf8" - UTF8 standard encoding
// "bytes" - Uint8Array binary data
// "base64" - base64 representation

// TODO! needs to rewrite...
export class TString {
    //
    constructor(from = "", fromCoding = "utf8", toCoding = "utf8") {
        this.$data = DataMap[this.$coding = toCoding].decode(from, fromCoding);
    }

    //
    get length() { return this.$data.length; };
    get base64() { return DataMap[this.$coding].as(this.$data, "base64"); };

    //
    as(coding) { return DataMap[this.$coding].as(this.$data, coding); };
    at(I = 0) { return this.$data.at(I); }

    // official string value of...
    toString() { return this.$data; };
    get ["*"]() { return this.$data; };
}

//
const utf8_dec = new TextDecoder();
const utf8_enc = new TextEncoder();

//
const raw_base64 = btoa;
const base64_raw = atob;

//
const codes_str    = (from)=>{ return String.fromCodePoint(...from); };
const utf16_shorts = (from)=>{ return Uint16Array.from(from.split("").map((e)=>(e.codePointAt(0)))) };

//
const str_utf8 = (from)=>{ return utf8_enc.encode(from) };
const utf8_str = (from)=>{ return utf8_dec.decode(from) };

//
const utf8_raw = (from) => { return unescape(encodeURIComponent(from)) };
const raw_utf8 = (from) => { return decodeURIComponent(escape(from)) };

//
const raw_bytes = (from) => { return Uint8Array.from(from, (m) => m.codePointAt(0)); };
const bytes_raw = codes_str;

//
const as_shorts = (src) => { return new Uint16Array(src.buffer, src.byteOffset); }
const as_bytes  = (src) => { return new Uint8Array(src.buffer, src.byteOffset); }

//
class Rules$ {
    constructor($name, $asMap) {
        this.$name = $name;
        this.$asMap = $asMap;
    }

    // reinterpret string from
    as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export const Base64 = new Rules$("base64", new Map([
    ["raw"   , (src) => { return base64_raw(src); }],
    ["utf8"  , (src) => { return raw_utf8(base64_raw(src)); }],
    ["utf16" , (src) => { return codes_str(as_shorts(raw_bytes(base64_raw(src)))); }],
    ["bytes" , (src) => { return raw_bytes(base64_raw(src)); }],
    ["shorts", (src) => { return as_shorts(raw_bytes(base64_raw(src))) }],
]));

//
export const Raw = new Rules$("raw", new Map([
    ["utf8"  , (src) => { return raw_utf8(src); }],
    ["utf16" , (src) => { return codes_str(as_shorts(raw_bytes(src))); }],
    ["base64", (src) => { return raw_base64(src); }],
    ["bytes" , (src) => { return raw_bytes(src); }],
    ["shorts", (src) => { return as_shorts(raw_bytes(src)) }],
]));

//
export const Shorts = new Rules$("shorts", new Map([
    ["utf16" , (src) => { return codes_str(src); }],
    ["base64", (src) => { return raw_base64(bytes_raw(as_bytes(src))); }],
    ["bytes" , (src) => { return as_bytes(src); }],
    ["raw"   , (src) => { return bytes_raw(as_bytes(src)); }],
]));

//
export const Bytes = new Rules$("bytes", new Map([
    ["utf8"     , (src) => { return utf8_str(src); }],
    ["utf16"    , (src) => { return codes_str(as_shorts(src)); }],
    ["base64"   , (src) => { return raw_base64(bytes_raw(src)); }],
    ["raw"      , (src) => { return bytes_raw(src); }],
    ["shorts"   , (src) => { return as_shorts(src); }],
]));

//
export const UTF16 = new Rules$("utf16", new Map([
    ["base64"   , (src) => { return raw_base64(bytes_raw(as_bytes(utf16_shorts(src)))); }],
    ["bytes"    , (src) => { return as_bytes(utf16_shorts(src)); }],
    ["raw"      , (src) => { return bytes_raw(as_bytes(utf16_shorts(src))); }],
    ["shorts"   , (src) => { return utf16_shorts(src); }],
]));

//
export const UTF8 = new Rules$("utf8", new Map([
    ["base64"   , (src) => { return raw_base64(utf8_raw(src)); }],
    ["raw"      , (src) => { return utf8_raw(src); }],
    ["bytes"    , (src) => { return str_utf8(src); }],
]));

//
export const DataMap = {
    ["shorts"]: Shorts,
    ["bytes"]: Bytes,
    ["raw"]: Raw,
    ["utf8"]: UTF8,
    ["utf16"]: UTF16,
    ["base64"]: Base64,
};

//
export const Text = new Rules$("text", new Map([]));

// assign an library
Object.entries(DataMap).map(([$pfx, $lib])=>{
    for (const $ of $lib.$asMap) { Text.$asMap.set($pfx + "_" + $[0], $[1]); }
});

//
DataMap["native"] = Text;
DataMap["text"] = Text;
