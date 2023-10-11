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
    // true casting or conversion of string (as is)
    static to(raw = "", toCoding = "raw") {
        throw new Error("Raw string have no exact encoding, use 'as' op...");
    }

    // reinterpret string
    static as(raw = "", toCoding = "raw") {
        switch (toCoding) {
            case "utf8": return UTF8.from(raw, "raw");
            case "base64": return btoa(raw);
            case "bytes": return Uint8Array.from(raw, (m) => m.codePointAt(0));
            case "raw": return raw;
        };
        return raw;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "utf8") {
        switch (fromCoding) {
            case "utf8": return UTF8.as(from, "raw");
            case "base64": return atob(from);
            case "bytes": return String.fromCodePoint(...from);
            case "raw": from;
        };
        return from;
    }
}

//
export class Bytes {
    // true casting or conversion of string (as is)
    static to(bytes = [], toCoding = "bytes") {
        throw new Error("Bytes have no exact encoding...");
    }

    // reinterpret string
    static as(bytes = [], toCoding = "bytes") {
        switch (toCoding) {
            case "utf8": return UTF8.from(bytes, "bytes");
            case "base64": return btoa(String.fromCodePoint(...bytes));
            case "bytes": return bytes;
            case "raw": return String.fromCodePoint(...bytes);
        };
        return bytes;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "utf8") {
        switch (fromCoding) {
            case "utf8": return UTF8.as(from, "bytes");
            case "base64": return Uint8Array.from(atob(from), (m) => m.codePointAt(0));
            case "bytes": return from;
            case "raw": return Uint8Array.from(from, (m) => m.codePointAt(0));
        };
        return from;
    }
}

//
export class UTF8 {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    // true casting or conversion of string (as is)
    static to(utf8 = "", toCoding = "utf8") {
        throw new Error("Conversion not implemented...");
    }

    // reinterpret string
    static as(utf8 = "", toCoding = "utf8") {
        switch (toCoding) {
            case "utf8": return utf8;
            case "base64": return btoa(unescape(encodeURIComponent(utf8)));
            case "raw": return unescape(encodeURIComponent(utf8));//Bytes.encode(this.#enc.encode(utf8), "raw");
            case "bytes": return this.#enc.encode(utf8);
        };
        return utf8;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "utf8") {
        switch (fromCoding) {
            case "utf8": return from;
            case "base64": return decodeURIComponent(escape(atob(from)));
            case "raw": return decodeURIComponent(escape(from));//this.#dec.decode(Bytes.decode(from, "raw"));
            case "bytes": return this.#dec.decode(from);
        };
        return from;
    }
}

//
export const DataMap = {
    ["bytes"]: Bytes,
    ["utf8"]: UTF8,
    ["raw"]: Raw
};
