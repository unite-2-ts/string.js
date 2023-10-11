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
export class Base64 {
    static $name = "base64";

    //
    static $asMap = new Map([
        ["utf8"  , (raw) => { return $raw_utf8($base64_raw(raw)); }],
        ["utf16" , (raw) => { return $codes_str($as_shorts($raw_bytes($base64_raw(raw)))); }],
        ["bytes" , (raw) => { return $raw_bytes($base64_raw(raw)); }],
        ["shorts", (raw) => { return $as_shorts($raw_bytes($base64_raw(raw))) }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class Raw {
    static $name = "raw";

    //
    static $asMap = new Map([
        ["utf8"  , (raw) => { return $raw_utf8(raw); }],
        ["utf16" , (raw) => { return $codes_str($as_shorts($raw_bytes(raw))); }],
        ["base64", (raw) => { return $raw_base64(raw); }],
        ["bytes" , (raw) => { return $raw_bytes(raw); }],
        ["shorts", (raw) => { return $as_shorts($raw_bytes(raw)) }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class Shorts {
    static $name = "shorts";

    //
    static $asMap = new Map([
        ["utf16" , (shorts) => { return $utf16_shorts(shorts); }],
        ["base64", (shorts) => { return $raw_base64($bytes_raw($as_bytes($utf16_shorts(shorts)))); }],
        ["bytes" , (shorts) => { return $as_bytes($utf16_shorts(shorts)); }],
        ["raw"   , (shorts) => { return $bytes_raw($as_bytes($utf16_shorts(shorts))); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class Bytes {
    static $name = "bytes";

    //
    static $asMap = new Map([
        ["utf8"     , (bytes) => { return $utf8_str(bytes); }],
        ["utf16"    , (bytes) => { return $codes_str($as_shorts(bytes)); }],
        ["base64"   , (bytes) => { return $raw_base64($bytes_raw(bytes)); }],
        ["raw"      , (bytes) => { return $bytes_raw(bytes); }],
        ["shorts"   , (bytes) => { return $as_shorts(bytes); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class UTF16 {
    static $name = "utf16";

    //
    static $asMap = new Map([
        ["base64"   , (native)=> { return $raw_base64($bytes_raw($as_bytes($utf16_shorts(native)))); }],
        ["bytes"    , (native)=> { return $as_bytes($utf16_shorts(native)); }],
        ["raw"      , (native)=> { return $bytes_raw($as_bytes($utf16_shorts(native))); }],
        ["shorts"   , (native)=> { return $utf16_shorts(native); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class UTF8 {
    static $name = "utf8";

    //
    static $asMap = new Map([
        ["base64", (native)=> { return $raw_base64($utf8_raw(native)); }],
        ["raw", (native)=> {  return $utf8_raw(native); }],//Bytes.encode(this.#enc.encode(native), "raw");
        ["bytes", (native)=> { return $str_utf8(native); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }
}

//
export class Text {
    //
    static $asMap   = new Map([  ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    //
    static from(from = "", fromCoding = "native") {
        const $t = DataMap.get(fromCoding);
        return $t.$asMap.has(this.$name) ? $t.$asMap.get(this.$name)(from) : from;
    }

    //
    static {
        for (const $ of Bytes.$asMap)       { this.$asMap   .set("bytes_"   + $[0], $[1]); }
        for (const $ of Shorts.$asMap)      { this.$asMap   .set("shorts_"  + $[0], $[1]); }
        for (const $ of Raw.$asMap)         { this.$asMap   .set("raw_"     + $[0], $[1]); }
        for (const $ of UTF8.$asMap)        { this.$asMap   .set("utf8_"    + $[0], $[1]); }
        for (const $ of UTF16.$asMap)       { this.$asMap   .set("utf16_"   + $[0], $[1]); }
        for (const $ of Base64.$asMap)      { this.$asMap   .set("base64_"  + $[0], $[1]); }
    }
}

//
export const DataMap = {
    ["shorts"]: Shorts,
    ["bytes"]: Bytes,
    ["raw"]: Raw,
    ["text"]: Text,
    ["utf8"]: UTF8,
    ["utf16"]: UTF16,
    ["base64"]: Base64,

    // native...
    ["native"]: Text
};
