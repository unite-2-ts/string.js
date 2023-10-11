// WDYM? We means "interpretation" and "representation"...
// "bin" - just ui8, but in string
// "utf8" - UTF8 standard encoding
// "ui8" - Uint8Array binary data
// "base64" - base64 representation

//
const exp = (obj, m_name) => { return obj[m_name].bind(obj); };
const codec = new Map([
    ["utf8", { 
        "dec": exp(new TextDecoder(), "decode"), 
        "enc": exp(new TextEncoder(), "encode")
    }]
]);

//
const use_dec = (name, code) => {
    return codec.get(name).dec(code);
}

//
const use_enc = (name, str) => {
    return codec.get(name).enc(str);
}

//
const bin_base64 = btoa;
const base64_bin = atob;

//
const codes_str    = (from)=>{ return String.fromCodePoint(...from); };
const utf16_ui16 = (from)=>{ return Uint16Array.from(from.split("").map((e)=>(e.codePointAt(0)))) };

//
const utf8_bin = (from) => { return unescape(encodeURIComponent(from)) };
const bin_utf8 = (from) => { return decodeURIComponent(escape(from)) };
const bin_ui8 = (from) => { return Uint8Array.from(from, (m) => m.codePointAt(0)); };

//
const as_ui16 = (src) => { return new Uint16Array(src.buffer, src.byteOffset); }
const as_ui8  = (src) => { return new Uint8Array(src.buffer, src.byteOffset); }

//
export const AsMap = {
    ["ui16"]: new Map([
        ["utf16" , (src) => { return codes_str(src); }],
        ["base64", (src) => { return bin_base64(codes_str(as_ui8(src))); }],
        ["ui8" , (src) => { return as_ui8(src); }],
        ["bin"   , (src) => { return codes_str(as_ui8(src)); }],
    ]),
    ["ui8"]: new Map([
        ["utf8"     , (src) => { return use_dec("utf8", src); }],
        ["utf16"    , (src) => { return codes_str(as_ui16(src)); }],
        ["base64"   , (src) => { return bin_base64(codes_str(src)); }],
        ["bin"      , (src) => { return codes_str(src); }],
        ["ui16"   , (src) => { return as_ui16(src); }],
    ]),
    ["bin"]: new Map([
        ["utf8"  , (src) => { return bin_utf8(src); }],
        ["utf16" , (src) => { return codes_str(as_ui16(bin_ui8(src))); }],
        ["base64", (src) => { return bin_base64(src); }],
        ["ui8" , (src) => { return bin_ui8(src); }],
        ["ui16", (src) => { return as_ui16(bin_ui8(src)) }],
    ]),
    ["utf8"]: new Map([
        ["base64"   , (src) => { return bin_base64(utf8_bin(src)); }],
        ["bin"      , (src) => { return utf8_bin(src); }],
        ["ui8"    , (src) => { return use_enc("utf8", src); }],
    ]),
    ["utf16"]: new Map([
        ["base64"   , (src) => { return bin_base64(codes_str(as_ui8(utf16_ui16(src)))); }],
        ["ui8"    , (src) => { return as_ui8(utf16_ui16(src)); }],
        ["bin"      , (src) => { return codes_str(as_ui8(utf16_ui16(src))); }],
        ["ui16"   , (src) => { return utf16_ui16(src); }],
    ]),
    ["base64"]: new Map([
        ["bin"   , (src) => { return base64_bin(src); }],
        ["utf8"  , (src) => { return bin_utf8(base64_bin(src)); }],
        ["utf16" , (src) => { return codes_str(as_ui16(bin_ui8(base64_bin(src)))); }],
        ["ui8" , (src) => { return bin_ui8(base64_bin(src)); }],
        ["ui16", (src) => { return as_ui16(bin_ui8(base64_bin(src))) }],
    ]),
};

//
export default class BString {

    // reinterpret string from
    static as(what = "", coding = "native") {
        const pair = coding.split("_");
        const from = AsMap[pair[0]];
        return from.has(pair[1]) ? from.get(pair[1])(what) : what;
    }
}
