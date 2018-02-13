// DO NOT CHANGE function() to () => {
// or it will break because there's not arguments
module.exports.sprintf = function () {
    let msg = arguments[0],count = (msg.match(/%s/g) || []).length,
        argsSliced = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < count; i++) {
        msg = msg.replace('%s', (argsSliced[i])
            ? argsSliced[i]
            : '')
    }
    return msg;
}

module.exports = function(options = {}) {
    const vsprintf = require("sprintf").vsprintf;
    const dict = options.language || {};
    const re = /___\([^\)]+\)/g;
    const isObject = function(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function replacer(match, p1) {
        p1 = /___\(\s*['"`](.+)['"`]\s*\)/g.exec(match)[1];

        // var args = re.exec(match),
        // split;
        // if (args[1]) {
        //     split = args[1].replace(/['"]+/g, '').replace(' ', '').split(/\s*,\s*/);
        // }
        // if(split)
        //     p1 = split[0];

        let val;

        function scan(obj) {
            let k;

            if (obj.hasOwnProperty(p1)) {
                val = obj[p1];
            } else if (isObject(obj) && !obj.hasOwnProperty(p1)) {
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        scan(obj[k]);
                    }
                }
            } else {
                val = p1;
            }

            // val = vsprintf(val, Array.prototype.slice.call(split, 1));

            return '"' + val + '"';
        }

        return scan(dict);
    }

    return {
        name: 'i18n',
        transform: function(source, id) {
            return source.replace(re, replacer.bind(this));
        }
    };
}
