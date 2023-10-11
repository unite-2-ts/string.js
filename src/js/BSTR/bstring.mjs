// WDYM? We means "interpretation" and "representation"...
// "raw" - just bytes, but in string
// "utf8" - UTF8 standard encoding
// "bytes" - Uint8Array binary data
// "base64" - base64 representation

//
export class TString {
    //
    constructor(from = "", fromCoding = "utf8", toCoding = "utf8") {
        this.$data = DataMap[this.$coding = toCoding].decode(from, fromCoding);
    }

    //
    get length() { return this.$data.length; };
    get base64() { return DataMap[this.$coding].as(this.$data, "base64"); };
    as(coding) { return DataMap[this.$coding].as(this.$data, coding); };
    at(I = 0) { return this.$data.at(I); }

    // official string value of...
    toString() { return this.$data; };
    get ["*"]() { return this.$data; };
}

//
const $dec = new TextDecoder();
const $enc = new TextEncoder();

//
const $raw_base64 = btoa;
const $base64_raw = atob;

//
const $codes_str = (from)=>{ return String.fromCodePoint(...from); };
const $utf16_shorts = (from)=>{ return Uint16Array.from(from.split("").map((e)=>(e.codePointAt(0)))) };

//
const $str_utf8 = (from)=>{ return $enc.encode(from) };
const $utf8_str = (from)=>{ return $dec.decode(from) };

//
const $utf8_raw = (from)=>{ return unescape(encodeURIComponent(from)) };
const $raw_utf8 = (from)=>{ return decodeURIComponent(escape(from)) };

//
const $raw_bytes = (from)=>{ return Uint8Array.from(from, (m) => m.codePointAt(0)); };
const $bytes_raw = $codes_str;

//
const $as_shorts = (bytes) => { return new Uint16Array(bytes.buffer, bytes.byteOffset); }
const $as_bytes  = (shorts) => { return new Uint8Array(shorts.buffer, shorts.byteOffset); }

//
class _Base_ {
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
export const Base64 = new _Base_("base64", new Map([
    ["utf8"  , (raw) => { return $raw_utf8($base64_raw(raw)); }],
    ["utf16" , (raw) => { return $codes_str($as_shorts($raw_bytes($base64_raw(raw)))); }],
    ["bytes" , (raw) => { return $raw_bytes($base64_raw(raw)); }],
    ["shorts", (raw) => { return $as_shorts($raw_bytes($base64_raw(raw))) }],
]));

//
export const Raw = new _Base_("raw", new Map([
    ["utf8"  , (raw) => { return $raw_utf8(raw); }],
    ["utf16" , (raw) => { return $codes_str($as_shorts($raw_bytes(raw))); }],
    ["base64", (raw) => { return $raw_base64(raw); }],
    ["bytes" , (raw) => { return $raw_bytes(raw); }],
    ["shorts", (raw) => { return $as_shorts($raw_bytes(raw)) }],
]));

//
export const Shorts = new _Base_("shorts", new Map([
    ["utf16" , (shorts) => { return $utf16_shorts(shorts); }],
    ["base64", (shorts) => { return $raw_base64($bytes_raw($as_bytes($utf16_shorts(shorts)))); }],
    ["bytes" , (shorts) => { return $as_bytes($utf16_shorts(shorts)); }],
    ["raw"   , (shorts) => { return $bytes_raw($as_bytes($utf16_shorts(shorts))); }],
]));

//
export const Bytes = new _Base_("bytes", new Map([
    ["utf8"     , (bytes) => { return $utf8_str(bytes); }],
    ["utf16"    , (bytes) => { return $codes_str($as_shorts(bytes)); }],
    ["base64"   , (bytes) => { return $raw_base64($bytes_raw(bytes)); }],
    ["raw"      , (bytes) => { return $bytes_raw(bytes); }],
    ["shorts"   , (bytes) => { return $as_shorts(bytes); }],
]));

//
export const UTF16 = new _Base_("utf16", new Map([
    ["base64"   , (native)=> { return $raw_base64($bytes_raw($as_bytes($utf16_shorts(native)))); }],
    ["bytes"    , (native)=> { return $as_bytes($utf16_shorts(native)); }],
    ["raw"      , (native)=> { return $bytes_raw($as_bytes($utf16_shorts(native))); }],
    ["shorts"   , (native)=> { return $utf16_shorts(native); }],
]));

//
export const UTF8 = new _Base_("utf16", new Map([
    ["base64", (native)=> { return $raw_base64($utf8_raw(native)); }],
    ["raw", (native)=> {  return $utf8_raw(native); }],//Bytes.encode(this.#enc.encode(native), "raw");
    ["bytes", (native)=> { return $str_utf8(native); }],
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
export const Text = new _Base_("text", new Map([]));

// assign an library
Object.entries(DataMap).map(([$pfx, $lib])=>{
    for (const $ of $lib.$asMap) { Text.$asMap.set($pfx + "_"   + $[0], $[1]); }
});

//
DataMap["native"] = Text;
DataMap["text"] = Text;
