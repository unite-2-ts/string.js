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
export class Raw {
    
    //
    static $asMap = new Map([
        ["utf8"  , (raw) => { return Text.from(raw, "utf8_raw");}],
        ["utf16" , (raw) => { return Text.from(raw, "utf16_raw");}],
        ["base64", (raw) => { return btoa(raw);}],
        ["bytes" , (raw) => { return Uint8Array.from(raw, (m) => m.codePointAt(0));}],
        ["shorts", (raw) => { return new Uint16Array(Text.as(raw, "utf16_bytes").buffer);}],
    ]);

    //
    static $fromMap = new Map([
        ["utf8"  , (from) => { return Text.as(from, "utf8_raw"); }],
        ["utf16" , (from) => { return Text.as(from, "utf16_raw"); }],
        ["base64", (from) => { return atob(from); }],
        ["bytes" , (from) => { return String.fromCodePoint(...from); }],
        ["shorts", (from) => { return Text.from(new Uint8Array(from.buffer, from.byteOffset), "utf16_bytes"); }],
    ]);


    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }
}

//
export class Shorts {
    //
    static $asMap = new Map([
        ["utf16" , (shorts) => { return Text.from(shorts, "utf16_shorts"); }],
        ["base64", (shorts) => { return btoa(Shorts.as(shorts, "raw")); }],
        ["bytes" , (shorts) => { return Bytes.from(shorts, "shorts"); }],
        ["raw"   , (shorts) => { return Raw.from(shorts, "shorts"); }],
    ]);

    //
    static $fromMap = new Map([
        ["utf16" , (from) => { return Text.as(from, "utf16_shorts");    }],
        ["base64", (from) => { return Shorts.from(atob(from), "raw");   }],
        ["bytes" , (from) => { return Bytes.as(from, "shorts"); }], 
        ["raw"   , (from) => { return Raw.as(from, "shorts"); }],
    ]);


    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }
}

//
export class Bytes {
    //
    static $asMap = new Map([
        ["utf8"     , (bytes) => { return Text.from(bytes, "utf8_bytes"); }],
        ["utf16"    , (bytes) => { return Text.from(bytes, "utf16_bytes"); }],
        ["base64"   , (bytes) => { return btoa(String.fromCodePoint(...bytes)); }],
        ["raw"      , (bytes) => { return String.fromCodePoint(...bytes); }],
        ["shorts"   , (bytes) => { return new Uint16Array(bytes.buffer, bytes.byteOffset); }],
    ]);

    //
    static $fromMap = new Map([
        ["utf8"  , (from) => { return Text.as(from, "utf8_bytes"); }],
        ["utf16" , (from) => { return Text.as(from, "utf16_bytes"); }],
        ["base64", (from) => { return Uint8Array.from(atob(from), (m) => m.codePointAt(0)); }],
        ["raw"   , (from) => { return Uint8Array.from(from, (m) => m.codePointAt(0)); }],
        ["shorts", (from) => { return new Uint8Array(from.buffer, from.byteOffset); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }
}

//
export class UTF16 {

    //
    static $asMap = new Map([
        ["base64", (native)=> { return btoa(Text.as(native, "utf16_raw")) }],
        ["bytes" , (native)=> { return new Uint8Array(Text.as(native, "utf16_shorts").buffer) }],
        ["raw", (native)=> { return String.fromCodePoint(...Text.as(native, "utf16_bytes")) }],
        ["shorts", (native)=> { return Uint16Array.from(native.split("").map((e)=>(e.codePointAt(0)))) }],
    ]);

    //
    static $fromMap = new Map([
        ["base64"  , (from)=> { return Text.from(atob(from), "utf16_raw"); }],
        ["bytes"   , (from)=> { return Text.from(new Uint16Array(from.buffer, from.byteOffset), "utf16_shorts"); }],
        ["raw"     , (from)=> { return Text.from(Uint8Array.from(from, (m) => m.codePointAt(0)), "utf16_bytes"); }],
        ["shorts"  , (from)=> { return String.fromCodePoint(...from); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }
}

//
export class UTF8 {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    //
    static $asMap = new Map([
        ["base64", (native)=> { return btoa(Text.as(native, "utf8_raw")) }],
        ["raw", (native)=> {  return unescape(encodeURIComponent(native)) }],//Bytes.encode(this.#enc.encode(native), "raw");
        ["bytes", (native)=> { return this.#enc.encode(native) }],
    ]);

    //
    static $fromMap = new Map([
        ["base64"   , (from)=> { return Text.from(atob(from), "utf8_raw"); }],
        ["raw"      , (from)=> { return decodeURIComponent(escape(from)); }],//this.#dec.decode(Bytes.decode(from, "raw"));
        ["bytes"    , (from)=> { return this.#dec.decode(from); }],
    ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }
}

//
export class Text {
    //
    static $asMap   = new Map([  ]);
    static $fromMap = new Map([  ]);

    // reinterpret string from
    static as(what = "", whatCoding = "native") {
        return this.$asMap.has(whatCoding) ? this.$asMap.get(whatCoding)(what) : what;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        return this.$fromMap.has(fromCoding) ? this.$fromMap.get(fromCoding)(from) : from;
    }

    //
    static {
        for (const $ of Bytes.$fromMap)     { this.$fromMap .set("bytes_"   + $[0], $[1]); }
        for (const $ of Bytes.$asMap)       { this.$asMap   .set("bytes_"   + $[0], $[1]); }
        for (const $ of Shorts.$fromMap)    { this.$fromMap .set("shorts_"  + $[0], $[1]); }
        for (const $ of Shorts.$asMap)      { this.$asMap   .set("shorts_"  + $[0], $[1]); }
        for (const $ of Raw.$fromMap)       { this.$fromMap .set("raw_"     + $[0], $[1]); }
        for (const $ of Raw.$asMap)         { this.$asMap   .set("raw_"     + $[0], $[1]); }
        for (const $ of UTF8.$fromMap)      { this.$fromMap .set("utf8_"    + $[0], $[1]); }
        for (const $ of UTF8.$asMap)        { this.$asMap   .set("utf8_"    + $[0], $[1]); }
        for (const $ of UTF16.$fromMap)     { this.$fromMap .set("utf16_"   + $[0], $[1]); }
        for (const $ of UTF16.$asMap)       { this.$asMap   .set("utf16_"   + $[0], $[1]); }
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

    // native...
    ["native"]: Text
};
