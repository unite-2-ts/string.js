//
export class BIN {
    //
    static encode(bin = [], coding = "bin") {
        switch (coding) {
            case "utf8": return UTF8.decode(bin, "bin");
            case "base64": return btoa(String.fromCodePoint(...bin));
            case "bytes": return bin;
            case "uint8": return bin;
            case "bin": return bin;
            case "binary": return bin;
        };
        return bin;
    }

    //
    static decode(raw = "", coding = "utf8") {
        switch (coding) {
            case "utf8": return UTF8.encode(raw, "bin");
            case "base64": return Uint8Array.from(atob(raw), (m) => m.codePointAt(0));
            case "bytes": return raw;
            case "uint8": return raw;
            case "bin": return raw;
            case "binary": return raw;
        };
        return raw;
    }

    //
    constructor(raw = "", coding = "utf8") {
        this.$bin = BIN.decode(raw, coding), this.$coding = "bin";
    }

    //
    get length() { return this.$bin.length; };
    get btoa() { return BIN.encode(this.$bin, "base64"); };
    to(coding) { return BIN.encode(this.$bin, coding); };
    at(I = 0) { return this.$bin.at(I); }

    //
    get ["*"]() { return this.$bin; }
}

//
export class UTF8 {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    //
    static encode(utf8 = "", coding = "utf8") {
        switch (coding) {
            case "utf8": return utf8;
            case "base64": return btoa(unescape(encodeURIComponent(utf8)));
            case "bytes": return this.#enc.encode(utf8);
            case "uint8": return this.#enc.encode(utf8);
            case "bin": return this.#enc.encode(utf8);
            case "binary": return this.#enc.encode(utf8);
        };
        return utf8;
    }

    //
    static decode(raw = "", coding = "utf8") {
        switch (coding) {
            case "utf8": return raw;
            case "base64": return decodeURIComponent(escape(atob(raw)));
            case "bytes": return this.#dec.decode(raw);
            case "uint8": return this.#dec.decode(raw);
            case "bin": return this.#dec.decode(raw);
            case "binary": return this.#dec.decode(raw);
        };
        return raw;
    }

    //
    constructor(raw = "", coding = "utf8") {
        this.$string = UTF8.decode(raw, coding), this.$coding = "utf8";
    }

    //
    get length() { return this.$string.length; };
    get btoa() { return UTF8.encode(this.$string, "base64"); };
    to(coding) { return UTF8.encode(this.$string, coding); };
    at(I = 0) { return this.$string.at(I); }

    // official string value of...
    toString() { return this.$string; };

    //
    get ["*"]() { return this.$string; }
}
