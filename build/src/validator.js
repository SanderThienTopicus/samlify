"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyTime(utcNotBefore, utcNotOnOrAfter) {
    var now = new Date();
    if (!utcNotBefore && !utcNotOnOrAfter) {
        return true; // throw exception todo
    }
    var notBeforeLocal = null;
    var notOnOrAfterLocal = null;
    if (utcNotBefore && !utcNotOnOrAfter) {
        notBeforeLocal = new Date(utcNotBefore);
        return +notBeforeLocal <= +now;
    }
    if (!utcNotBefore && utcNotOnOrAfter) {
        notOnOrAfterLocal = new Date(utcNotOnOrAfter);
        return now < notOnOrAfterLocal;
    }
    notBeforeLocal = new Date(utcNotBefore);
    notOnOrAfterLocal = new Date(utcNotOnOrAfter);
    return +notBeforeLocal <= +now && now < notOnOrAfterLocal;
}
exports.verifyTime = verifyTime;
//# sourceMappingURL=validator.js.map