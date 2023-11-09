var Buffer = require('buffer').Buffer;

/**
 * Creates an Ascii Buffer
 * @param {Number} length Size of the requested buffer
 * @returns {Buffer} new buffer
 */
function allocateAsciiBuffer(length) {
    return Buffer.alloc(length, 'ascii');
}

/**
 * Creates a base64 buffer
 * @param {Number} length Size of the requested buffer
 * @returns {Buffer} new buffer
 */
function allocateBase64Buffer(str) {
    return Buffer.from(str, encoding='base64');
}

/**
 * Encode String to UTF7
 * @param str String object to encode
 */
function encode(str) {
    var b = allocateAsciiBuffer(str.length * 2);
    for (var i = 0, bi = 0; i < str.length; i++) {
        // Note that we can't simply convert a UTF-8 string to Base64 because
        // UTF-8 uses a different encoding. In modified UTF-7, all characters
        // are represented by their two byte Unicode ID.
        var c = str.charCodeAt(i);
        // Upper 8 bits shifted into lower 8 bits so that they fit into 1 byte.
        b[bi++] = c >> 8;
        // Lower 8 bits. Cut off the upper 8 bits so that they fit into 1 byte.
        b[bi++] = c & 0xFF;
    }
    // Modified Base64 uses , instead of / and omits trailing =.
    return b.toString('base64').replace(/=+$/, '');
}

/**
 * Encode String to UTF7
 * @param {string} str String object to encode
 */
function decode(str) {
    var b = allocateBase64Buffer(str);

    var r = [];
    for (var i = 0; i < b.length;) {
        // Calculate charcode from two adjacent bytes.
        r.push(String.fromCharCode(b[i++] << 8 | b[i++]));
    }
    return r.join('');
}

//
/**
 * Escape reserved RegEx strings
 * @description from http://simonwillison.net/2006/Jan/20/escape/
 * @param {string} chars 
 * @returns {string} new string with escaped characters
 */
function escape(chars) {
    return chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Character classes defined by RFC 2152.
 */
var setD = "A-Za-z0-9" + escape("'(),-./:?");
const setO = escape('!"#$%&*;<=>@[]^_\'{|}')
const setW = escape(' \r\n\t')

// Stores compiled regexes for various replacement pattern.
var regexes = {};

// This regex matches all characters
var regexAll = new RegExp("[\u0000-\uFFFF]+", 'g');

// pre-declare imap version
exports.imap = {};

/**
 * Encodes string to UTF-7, see RFC 2152
 * @param {String} str String to encode
 * @param {String} mask (optional) Characters to encode, defaults to RFC 2152 Set D
 * @returns {string} encoded string
 */
exports.encode = function(str, mask) {
    // Generate a RegExp object from the string of mask characters.
    if (!mask) {
        mask = '';
    }
    if (!regexes[mask]) {
        regexes[mask] = new RegExp("[^" + setD + escape(mask) + "]+", 'g');
    }

    // We replace subsequent disallowed chars with their escape sequence.
    return str.replace(regexes[mask], function(chunk) {
        // + is represented by an empty sequence +-, otherwise call encode().
        return '+' + (chunk === '+' ? '' : encode(chunk)) + '-';
    });
};

// RFC 2152 UTF-7 encoding with all optionals.
exports.encodeAll = function(str) {
    // We replace subsequent disallowed chars with their escape sequence.
    return str.replace(regexAll, function(chunk) {
        // + is represented by an empty sequence +-, otherwise call encode().
        return '+' + (chunk === '+' ? '' : encode(chunk)) + '-';
    });
};

// RFC 3501, section 5.1.3 UTF-7 encoding.
exports.imap.encode = function(str) {
    // All printable ASCII chars except for & must be represented by themselves.
    // We replace subsequent non-representable chars with their escape sequence.
    return str.replace(/&/g, '&-').replace(/[^\x20-\x7e]+/g, function(chunk) {
        // & is represented by an empty sequence &-, otherwise call encode().
        chunk = (chunk === '&' ? '' : encode(chunk)).replace(/\//g, ',');
        return '&' + chunk + '-';
    });
};

// RFC 2152 UTF-7 decoding.
exports.decode = function(str) {
    return str.replace(/\+([A-Za-z0-9\/]*)-?/gi, function(_, chunk) {
        // &- represents &.
        if (chunk === '') return '+';
        return decode(chunk);
    });
};

// RFC 3501, section 5.1.3 UTF-7 decoding.
exports.imap.decode = function(str) {
    return str.replace(/&([^-]*)-/g, function(_, chunk) {
        // &- represents &.
        if (chunk === '') return '&';
        return decode(chunk.replace(/,/g, '/'));
    });
};
