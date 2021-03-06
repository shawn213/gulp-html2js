'use strict';
function NGAdapter(opt) {
    this.opt = opt || {};
    this.opt.name = opt.name || '_html_';
    this.opt.templateNameType = opt.templateNameType || 'file';
    this.opt.quoteChar = opt.quoteChar || '"';
    this.opt.indentString = opt.indentString || "  ";
    this.contentParts = [];
    this.separator = new Buffer(opt.separator);
};

NGAdapter.prototype.getHeader = function () {
    var quoteChar = this.opt.quoteChar;
    return [
        '(function(app) {',
        'try { app = angular.module(' + this.wrap(this.opt.name, quoteChar) + '); }',
        'catch(err) { app = angular.module(' + this.wrap(this.opt.name, quoteChar) + ', []); }',
        'app.run([' + this.wrap('$templateCache', quoteChar) + ', function($templateCache) {',
        this.wrap('use strict', quoteChar) + ';'
    ].join('\n');
};

NGAdapter.prototype.getFile = function (file, content) {
    var quoteChar = this.opt.quoteChar;
    var templateName;
    switch (this.opt.templateNameType) {
        case 'basename':
            templateName = file.replace(/.*\/|\.[^.]*$/g, '');
            break;
        case 'filename':
            templateName = file.replace(/^.*[\\\/]/, '');
            break;
        default:
            templateName = file;
            break;
    }
    return [
        '$templateCache.put(' + this.wrap(templateName, quoteChar) + ', ',
        this.wrap(this.escapeContent(content), quoteChar),
        ');\n'
    ].join('');
};

NGAdapter.prototype.getFooter = function () {
    return '}]);' + "\n" + '})();';
};

NGAdapter.prototype.wrap = function (str, char) {
    return char + str + char;
};

NGAdapter.prototype.escapeContent = function (content) {
    var quoteChar = this.opt.quoteChar;
    var indentString = this.opt.indentString;
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
    return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
}
module.exports = NGAdapter;
