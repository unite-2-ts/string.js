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
export class UTF8 {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    // true casting or conversion of string (as is)
    /*static to(utf8 = "", toCoding = "utf8") {
        throw new Error("Conversion not implemented...");
    }*/

    // reinterpret string
    static as(native = "", toCoding = "utf8") {
        switch (toCoding) {
            case "utf8":
            case "native": return native;
            case "utf8_base64": return btoa(unescape(encodeURIComponent(native)));
            case "utf8_raw": return unescape(encodeURIComponent(native));//Bytes.encode(this.#enc.encode(utf8), "raw");
            case "utf8_bytes": return this.#enc.encode(native);
        };
        return native;
    }

    // reinterpret string from
    static from(from = "", fromCoding = "utf8") {
        switch (fromCoding) {
            case "utf8":
            case "native": return from;
            case "utf8_base64": return decodeURIComponent(escape(atob(from)));
            case "utf8_raw": return decodeURIComponent(escape(from));//this.#dec.decode(Bytes.decode(from, "raw"));
            case "utf8_bytes": return this.#dec.decode(from);
        };
        return from;
    }

    //
    static Raw = class Raw {
        // true casting or conversion of string (as is)
        /*static to(raw = "", toCoding = "utf8_raw") {
            throw new Error("Raw string have no exact encoding, use 'as' op...");
        }*/

        // reinterpret string
        static as(raw = "", toCoding = "utf8_raw") {
            switch (toCoding) {
                case "utf8":
                case "native": return UTF8.from(raw, "utf8_raw");
                case "utf8_base64": return btoa(raw);
                case "utf8_bytes": return Uint8Array.from(raw, (m) => m.codePointAt(0));
                case "utf8_raw": return raw;
            };
            return raw;
        }

        // reinterpret string from
        static from(from = "", fromCoding = "utf8") {
            switch (fromCoding) {
                case "utf8":
                case "native": return UTF8.as(from, "utf8_raw");
                case "utf8_base64": return atob(from);
                case "utf8_bytes": return String.fromCodePoint(...from);
                case "utf8_raw": from;
            };
            return from;
        }
    }

    //
    static Bytes = class Bytes {
        // true casting or conversion of string (as is)
        /*static to(bytes = [], toCoding = "utf8_bytes") {
            throw new Error("Bytes have no exact encoding...");
        }*/

        // reinterpret string
        static as(bytes = [], toCoding = "utf8_bytes") {
            switch (toCoding) {
                case "utf8":
                case "native": return UTF8.from(bytes, "utf8_bytes");
                case "utf8_base64": return btoa(String.fromCodePoint(...bytes));
                case "utf8_bytes": return bytes;
                case "utf8_raw": return String.fromCodePoint(...bytes);
            };
            return bytes;
        }

        // reinterpret string from
        static from(from = "", fromCoding = "utf8") {
            switch (fromCoding) {
                case "utf8":
                case "native": return UTF8.as(from, "utf8_bytes");
                case "utf8_base64": return Uint8Array.from(atob(from), (m) => m.codePointAt(0));
                case "utf8_bytes": return from;
                case "utf8_raw": return Uint8Array.from(from, (m) => m.codePointAt(0));
            };
            return from;
        }
    }

}

//
export const DataMap = {
    ["utf8_bytes"]: UTF8.Bytes,
    ["utf8_raw"]: UTF8.Raw,
    ["utf8"]: UTF8,

    // ???
    ["native"]: UTF8
};
