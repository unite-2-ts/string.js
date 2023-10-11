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
export class Text {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    // reinterpret string
    static as(native = "", toCoding = "native") {
        switch (toCoding) {
            case "utf16_base64" : return btoa(Text.as(native, "utf16_raw"));
            case "utf16_bytes"  : return new Uint8Array(Text.as(native, "utf16_shorts").buffer);
            case "utf16_raw"    : return String.fromCodePoint(...Text.as(native, "utf16_bytes"));
            case "utf16_shorts" : return Uint16Array.from(native.split("").map((e)=>(e.codePointAt(0))));
            case "utf8_base64"  : return btoa(Text.as(native, "utf8_raw"));
            case "utf8_raw"     : return unescape(encodeURIComponent(native));//Bytes.encode(this.#enc.encode(native), "raw");
            case "utf8_bytes"   : return this.#enc.encode(native);
        };
        return native;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        switch (fromCoding) {
            case "utf16_base64" : return Text.from(atob(from), "utf16_raw");
            case "utf16_bytes"  : return Text.from(new Uint16Array(from.buffer, from.byteOffset), "utf16_shorts");
            case "utf16_raw"    : return Text.from(Uint8Array.from(from, (m) => m.codePointAt(0)), "utf16_bytes");
            case "utf16_shorts" : return String.fromCodePoint(...from);
            case "utf8_base64"  : return Text.from(atob(from), "utf8_raw");
            case "utf8_raw"     : return decodeURIComponent(escape(from));//this.#dec.decode(Bytes.decode(from, "raw"));
            case "utf8_bytes"   : return this.#dec.decode(from);
        };
        return from;
    }
}

//
export class Raw {
    // reinterpret string
    static as(raw = "", toCoding = "utf16_raw") {
        switch (toCoding) {
            case "utf16"        : return Text.from(raw, "utf16_raw");
            case "utf16_base64" : case "utf8_base64"  : case "base64"  : return btoa(raw);
            case "utf16_bytes"  : case "utf8_bytes"   : case "bytes"   : return Uint8Array.from(raw, (m) => m.codePointAt(0));
            case "utf16_shorts" : return new Uint16Array(Text.as(raw, "utf16_bytes").buffer);
            case "utf8"         : return Text.from(raw, "utf8_raw");
        };
        return raw;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        switch (fromCoding) {
            case "utf16"        : return Text.as(from, "utf16_raw");
            case "utf16_base64" : case "utf8_base64"  : case "base64"  : return atob(from);
            case "utf16_bytes"  : case "utf8_bytes"   : case "bytes"   : return String.fromCodePoint(...from);
            case "utf16_shorts" : return Text.from(new Uint8Array(from.buffer, from.byteOffset), "utf16_bytes");
            case "utf8"         : return Text.as(from, "utf8_raw");
        };
        return from;
    }
}

//
export class Shorts {
    // reinterpret string
    static as(shorts = [], toCoding = "utf16_bytes") {
        switch (toCoding) {
            case "utf16"       : return Text.from(shorts, "utf16_shorts");
            case "utf16_base64": case "base64": return btoa(Shorts.as(shorts, "utf16_raw"));
            case "utf16_bytes" : case "bytes" : return Bytes.from(shorts, "utf16_shorts");
            case "utf16_raw"   : case "raw"   : return Raw.from(shorts, "utf16_shorts");
        };
        return shorts;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        switch (fromCoding) {
            case "utf16"       : return Text.as(from, "utf16_shorts");
            case "utf16_base64": case "base64": return Shorts.from(atob(from), "utf16_raw");
            case "utf16_bytes" : case "bytes" : return Bytes.as(from, "utf16_shorts");
            case "utf16_raw"   : case "raw"   : return Raw.as(from, "utf16_shorts");
        };
        return from;
    }
}

//
export class Bytes {
    // reinterpret string
    static as(bytes = [], toCoding = "utf16_bytes") {
        switch (toCoding) {
            case "utf16"        : return Text.from(bytes, "utf16_bytes");
            case "utf16_base64" : case "utf8_base64"  : case "base64"  : return btoa(String.fromCodePoint(...bytes));
            case "utf16_raw"    : case "utf8_raw"     : case "raw"     : return String.fromCodePoint(...bytes);
            case "utf16_shorts" : return new Uint16Array(bytes.buffer, bytes.byteOffset);
            case "utf8"         : return Text.from(bytes, "utf8_bytes");
        };
        return bytes;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "native") {
        switch (fromCoding) {
            case "utf16"        : return Text.as(from, "utf16_bytes");
            case "utf16_base64" : case "utf8_base64"  : case "base64"  : return Uint8Array.from(atob(from), (m) => m.codePointAt(0));
            case "utf16_raw"    : case "utf8_raw"     : case "raw"     : return Uint8Array.from(from, (m) => m.codePointAt(0));
            case "utf16_shorts" : return new Uint8Array(from.buffer, from.byteOffset);
            case "utf8"         : return Text.as(from, "utf8_bytes");
        };
        return from;
    }
}

//
export const DataMap = {
    ["shorts"]: Shorts,
    ["bytes"]: Bytes,
    ["raw"]: Raw,
    ["text"]: Text,

    // native...
    ["native"]: Text
};
