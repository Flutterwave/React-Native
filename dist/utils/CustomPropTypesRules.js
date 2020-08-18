export var PaymentOptionsPropRule = function (options) { return function (props, propName) {
    // skip check if payment options is not defined
    if (props[propName] === undefined) {
        return null;
    }
    // if not an array of payment options
    if (typeof props[propName] !== 'string') {
        return new Error('"payment_methods" should be a string.');
    }
    var paymentOptionsList = props[propName].split(',');
    var _loop_1 = function (i) {
        if (options.findIndex(function (j) { return j.trim() === paymentOptionsList[i].trim(); }) === -1) {
            return { value: new Error("\"payment_options\"(" + props[propName] + ") must be any of the following values.\n" + options.map(function (i, n) { return n + 1 + ". " + i + "\n"; }).join('')) };
        }
    };
    for (var i = 0; i < paymentOptionsList.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return null;
}; };
