'use strict';
function JSAdapter(opt) {
    this.opt = opt || {};
    this.opt.name = opt.name || '_html_';
    this.opt.templateNameType = opt.templateNameType || 'file';
    this.opt.quoteChar = opt.quoteChar || '"';
    this.opt.indentString = opt.indentString || "  ";
    this.lineOffset = 0;
    this.contentParts = [];
    this.separator = new Buffer(opt.separator);
};

JSAdapter.prototype.getHeader = function () {
    return '//HEAD ' + "\n" +
        'window["' + this.opt.name + '"] = {};' + "\n";
};

JSAdapter.prototype.getFile = function (file, content) {
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
    return 'window["' + this.opt.name + '"]["' + templateName + '"] = ' + this.opt.quoteChar + (Buffer.isBuffer(content) ? content : new Buffer(this.escapeContent(content))) + this.opt.quoteChar + '; ' + "\n";
};

JSAdapter.prototype.getFooter = function () {
    return "// END ";
};
JSAdapter.prototype.escapeContent = function (content) {
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + this.opt.quoteChar, 'g');
    var nlReplace = '\\n' + this.opt.quoteChar + ' +\n' + this.opt.indentString + this.opt.indentString + this.opt.quoteChar;
    return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + this.opt.quoteChar).replace(/\r?\n/g, nlReplace);
}
module.exports = JSAdapter;