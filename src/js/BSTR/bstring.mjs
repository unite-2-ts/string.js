
/* // reserved for binary based systems... (aka. Binary-coded or Uint8Array)
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}
*/

//
export class UTF8 {
    static #dec = new TextDecoder();
    static #enc = new TextEncoder();

    //
    static encode(utf8 = "", coding = "utf8") {
        switch (coding) {
            case "utf8": return utf8;
            case "base64": return btoa(unescape(encodeURIComponent(utf8)));
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
}
