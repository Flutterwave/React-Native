var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React from 'react';
import PropTypes from 'prop-types';
import FlutterwaveInitError from './utils/FlutterwaveInitError';
import FlutterwaveCheckout from './FlutterwaveCheckout';
import FlutterwaveButton from './FlutterwaveButton';
import { REDIRECT_URL } from './configs';
export var PayWithFlutterwavePropTypesBase = {
    alignLeft: PropTypes.bool,
    onAbort: PropTypes.func,
    onRedirect: PropTypes.func.isRequired,
    onWillInitialize: PropTypes.func,
    onDidInitialize: PropTypes.func,
    onInitializeError: PropTypes.func,
    customButton: PropTypes.func
};
export var OptionsPropTypeBase = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.oneOf([
        'AUD',
        'BIF',
        'CDF',
        'CAD',
        'CVE',
        'EUR',
        'GBP',
        'GHS',
        'GMD',
        'GNF',
        'KES',
        'LRD',
        'MWK',
        'MZN',
        'NGN',
        'RWF',
        'SLL',
        'STD',
        'TZS',
        'UGX',
        'USD',
        'XAF',
        'XOF',
        'ZAR',
        'ZMK',
        'ZMW',
        'ZWD'
    ]),
    payment_plan: PropTypes.number,
    subaccounts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        transaction_split_ratio: PropTypes.number,
        transaction_charge_type: PropTypes.string,
        transaction_charge: PropTypes.number
    })),
    integrity_hash: PropTypes.string
};
var PayWithFlutterwaveBase = /** @class */ (function (_super) {
    __extends(PayWithFlutterwaveBase, _super);
    function PayWithFlutterwaveBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPending: false,
            link: null,
            resetLink: false,
            showDialog: false,
            reference: null
        };
        _this.reset = function () {
            if (_this.abortController) {
                _this.abortController.abort();
            }
            // reset the necessaries
            _this.setState(function (_a) {
                var resetLink = _a.resetLink, link = _a.link;
                return ({
                    isPending: false,
                    link: resetLink ? null : link,
                    resetLink: false,
                    showDialog: false
                });
            });
        };
        _this.handleOptionsChanged = function () {
            var _a = _this.state, showDialog = _a.showDialog, link = _a.link;
            if (!link) {
                return;
            }
            if (!showDialog) {
                return _this.setState({
                    link: null,
                    reference: null
                });
            }
            _this.setState({ resetLink: true });
        };
        _this.handleAbort = function () {
            var onAbort = _this.props.onAbort;
            if (onAbort) {
                onAbort();
            }
            _this.reset();
        };
        _this.handleRedirect = function (params) {
            var onRedirect = _this.props.onRedirect;
            // reset payment link
            _this.setState(function (_a) {
                var resetLink = _a.resetLink, reference = _a.reference;
                return ({
                    reference: params.flwref || params.status === 'successful' ? null : reference,
                    resetLink: params.flwref || params.status === 'successful' ? true : resetLink,
                    showDialog: false
                });
            }, function () {
                onRedirect(params);
                _this.reset();
            });
        };
        _this.handleInit = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, options, onWillInitialize, onInitializeError, onDidInitialize, init, _b, isPending, reference, link;
            var _this = this;
            return __generator(this, function (_c) {
                _a = this.props, options = _a.options, onWillInitialize = _a.onWillInitialize, onInitializeError = _a.onInitializeError, onDidInitialize = _a.onDidInitialize, init = _a.init;
                _b = this.state, isPending = _b.isPending, reference = _b.reference, link = _b.link;
                // just show the dialod if the link is already set
                if (link) {
                    return [2 /*return*/, this.setState({ showDialog: true })];
                }
                // throw error if transaction reference has not changed
                if (reference === this.props.reference) {
                    // fire oninitialize error handler if available
                    if (onInitializeError) {
                        onInitializeError(new FlutterwaveInitError({
                            message: 'Please generate a new transaction reference.',
                            code: 'SAME_TXREF'
                        }));
                    }
                    return [2 /*return*/];
                }
                // stop if currently in pending mode
                if (isPending) {
                    return [2 /*return*/];
                }
                // initialize abort controller if not set
                this.abortController = new AbortController;
                // fire will initialize handler if available
                if (onWillInitialize) {
                    onWillInitialize();
                }
                this.setState({
                    isPending: true,
                    link: null,
                    reference: this.props.reference,
                    showDialog: false
                }, function () { return __awaiter(_this, void 0, void 0, function () {
                    var paymentLink, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, init(__assign(__assign({}, options), { redirect_url: REDIRECT_URL }), this.abortController)];
                            case 1:
                                paymentLink = _a.sent();
                                // set payment link
                                this.setState({
                                    link: paymentLink,
                                    isPending: false,
                                    showDialog: true
                                }, function () {
                                    // fire did initialize handler if available
                                    if (onDidInitialize) {
                                        onDidInitialize();
                                    }
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                // stop if request was canceled
                                if (error_1 && /aborterror/i.test(error_1.code)) {
                                    return [2 /*return*/];
                                }
                                // call onInitializeError handler if an error occured
                                if (onInitializeError) {
                                    onInitializeError(error_1);
                                }
                                // set payment link to reset
                                this.setState({
                                    resetLink: true,
                                    reference: null
                                }, this.reset);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    PayWithFlutterwaveBase.prototype.componentDidUpdate = function (prevProps) {
        var prevOptions = JSON.stringify(prevProps.options);
        var options = JSON.stringify(this.props.options);
        if (prevOptions !== options) {
            this.handleOptionsChanged();
        }
    };
    PayWithFlutterwaveBase.prototype.componentWillUnmount = function () {
        if (this.abortController) {
            this.abortController.abort();
        }
    };
    PayWithFlutterwaveBase.prototype.render = function () {
        var _a = this.state, link = _a.link, showDialog = _a.showDialog;
        return (<>
        {this.renderButton()}
        <FlutterwaveCheckout onAbort={this.handleAbort} onRedirect={this.handleRedirect} link={link || undefined} visible={showDialog}/>
      </>);
    };
    PayWithFlutterwaveBase.prototype.renderButton = function () {
        var _a = this.props, alignLeft = _a.alignLeft, customButton = _a.customButton, children = _a.children, style = _a.style;
        var isPending = this.state.isPending;
        if (customButton) {
            return customButton({
                disabled: isPending,
                onPress: this.handleInit
            });
        }
        return <FlutterwaveButton style={style} alignLeft={!!alignLeft} children={children} onPress={this.handleInit} disabled={isPending}/>;
    };
    return PayWithFlutterwaveBase;
}(React.Component));
export default PayWithFlutterwaveBase;
