# safe-utf7

[![CircleCI](https://img.shields.io/circleci/build/github/alisonaquinas/utf7)](https://app.circleci.com/pipelines/github/alisonaquinas/utf7)
[![npm](https://img.shields.io/npm/dw/safe-utf7)](https://www.npmjs.com/package/safe-utf7)

``` bash
npm i safe-utf7
```

This is a fork of [utf7](https://www.npmjs.com/package/utf7) I (Alison) made to resolve some vulnrablities that were found in the origonal package. I've kept the changes minimal and update the CircleCI confiuration to point to my own instance. What follows are the origonal notes from Konstantin Käfer

## utf7

Encodes and decodes JavaScript (Unicode/UCS-2) strings to UTF-7 ASCII strings. It supports two modes: UTF-7 as defined in [RFC 2152](http://tools.ietf.org/html/rfc2152) and Modified UTF-7 as defined by the IMAP standard in [RFC 3501, section 5.1.3](http://tools.ietf.org/html/rfc3501#section-5.1.3)

### Usage

#### RFC 2152

```javascript
var utf7 = require('utf7');

var encoded = utf7.encode('Jyväskylä');
assert.equal('Jyv+AOQ-skyl+AOQ-', encoded);

var decoded = utf7.decode(encoded);
assert.equal('Jyväskylä', decoded);
```

By default, `.encode()` only encodes the default characeters defined in RFC 2152. To also encode optional characters, use `.encodeAll()` or specify the characters you want to encode as the second argument to `.encode()`.

#### IMAP (RFC 3501)

```javascript
var utf7 = require('utf7').imap;

var encoded = utf7.encode('"你好" heißt "Hallo"');
assert.equal('"&T2BZfQ-" hei&AN8-t "Hallo"', encoded);

var decoded = utf7.decode(encoded);
assert.equal('"你好" heißt "Hallo"', decoded);
```

## Maintaince Note

I (Alison) am planning to maintain this repositoy, please see the [contibuting](CONTRIBUTING.md) guide if you have any issues or ideas.


## License

[Original code](https://github.com/kkaefer/utf7) licensed under MIT by Konstantin Käfer

```
Copyright (c) 2010-2011 Konstantin Käfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```