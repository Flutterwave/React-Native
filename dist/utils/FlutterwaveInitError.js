var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Flutterwave Init Error
 */
var FlutterwaveInitError = /** @class */ (function (_super) {
    __extends(FlutterwaveInitError, _super);
    /**
     * Constructor Method
     * @param props {message?: string; code?: string}
     */
    function FlutterwaveInitError(props) {
        var _this = _super.call(this, props.message) || this;
        _this.code = props.code;
        _this.errorId = props.errorId;
        _this.errors = props.errors;
        return _this;
    }
    return FlutterwaveInitError;
}(Error));
export default FlutterwaveInitError;
