//
const exp = (obj, m_name) => { return obj[m_name].bind(obj); };
const codec = new Map([
    ["utf8", { 
        "dec": exp(new TextDecoder(), "decode"), 
        "enc": exp(new TextEncoder(), "encode")
    }],
    ["utf16", { 
        "dec": (cde)=>(codes_str(cde)), 
        "enc": (str)=>(utf16_uint16(str))
    }],
]);

//
const use_dec = (name, code) => { return codec.get(name).dec(code); }
const use_enc = (name, str) => { return codec.get(name).enc(str); }
const r = (from,to,src) => { return AsMap[from].get(to)(src); }

//
const binary_base64 = btoa;
const base64_binary = atob;

//
const codes_str  = (from)=>{ return String.fromCodePoint(...from); };
const utf16_uint16 = (from)=>{ return Uint16Array.from(from.split("").map((e)=>(e.codePointAt(0)))) };

//
const utf8_binary  = (from) => { return unescape(encodeURIComponent(from)) };
const binary_utf8  = (from) => { return decodeURIComponent(escape(from)) };
const binary_uint8   = (from) => { return Uint8Array.from(from, (m) => m.codePointAt(0)); };

//
const as_uint16 = (src) => { return new Uint16Array(src.buffer, src.byteOffset); }
const as_uint8  = (src) => { return new Uint8Array(src.buffer, src.byteOffset); }

//
export const AsMap = {
    ["uint16"]: new Map([
        ["utf16"    , (src) => { return codes_str(src);                             }],
        ["base64"   , (src) => { return binary_base64(r("uint16", "binary", src));  }],
        ["uint8"    , (src) => { return as_uint8(src);                              }],
        ["binary"   , (src) => { return codes_str(as_uint8(src));                   }],
    ]),
    ["uint8"]: new Map([
        ["utf8"     , (src) => { return use_dec("utf8", src);                       }],
        ["utf16"    , (src) => { return codes_str(as_uint16(src));                  }],
        ["base64"   , (src) => { return binary_base64(codes_str(src));              }],
        ["binary"   , (src) => { return codes_str(src);                             }],
        ["uint16"   , (src) => { return as_uint16(src);                             }],
    ]),
    ["binary"]: new Map([
        ["utf8"     , (src) => { return binary_utf8(src);                           }],
        ["utf16"    , (src) => { return codes_str(r("binary", "uint16", src));      }],
        ["base64"   , (src) => { return binary_base64(src);                         }],
        ["uint8"    , (src) => { return binary_uint8(src);                          }],
        ["uint16"   , (src) => { return as_uint16(binary_uint8(src));               }],
    ]),
    ["utf8"]: new Map([
        ["base64"   , (src) => { return binary_base64(utf8_binary(src));            }],
        ["binary"   , (src) => { return utf8_binary(src);                           }],
        ["uint8"    , (src) => { return use_enc("utf8", src);                       }],
    ]),
    ["utf16"]: new Map([
        ["base64"   , (src) => { return r("uint16", "base64", utf16_uint16(src));   }],
        ["uint8"    , (src) => { return r("uint16", "uint8" , utf16_uint16(src));   }],
        ["binary"   , (src) => { return r("uint16", "binary", utf16_uint16(src));   }],
        ["uint16"   , (src) => { return utf16_uint16(src);                          }],
    ]),
    ["base64"]: new Map([
        ["binary"   , (src) => { return base64_binary(src);                         }],
        ["utf8"     , (src) => { return binary_utf8(base64_binary(src));            }],
        ["utf16"    , (src) => { return codes_str(r("base64", "uint16", src));      }],
        ["uint8"    , (src) => { return binary_uint8(r("base64", "binary", src));   }],
        ["uint16"   , (src) => { return as_uint16(r("base64", "uint8", src))        }],
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
