export default function i18n(options = {}) {
    const dict = options.language || {};
    const re = /__\(\s*['"`](.+)['"`]\s*\)/g;

    function replacer(match, p1) {
        let val;
        if (!dict.hasOwnProperty(p1)) {
            val = p1;
            // this.warn('missing translation for:', p1);
            console.log('missing translation for:', p1);
        } else {
            val = dict[p1];
        }
        return `"${val}"`;
    }

    return {
        name: 'i18n',
        transform: function (source, id) {
            return source.replace(re, replacer.bind(this));
        },
    };
}