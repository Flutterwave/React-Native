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
import { StyleSheet, Modal, View, Animated, TouchableWithoutFeedback, Text, Alert, Image, Platform, Dimensions, Easing, } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import FlutterwaveInit from './FlutterwaveInit';
import { colors } from './configs';
import { PaymentOptionsPropRule } from './utils/CustomPropTypesRules';
import DefaultButton from './DefaultButton';
var loader = require('./loader.gif');
var pryContent = require('./pry-button-content.png');
var contentWidthPercentage = 0.6549707602;
var contentSizeDimension = 8.2962962963;
var contentMaxWidth = 187.3;
var contentMaxHeight = contentMaxWidth / contentSizeDimension;
var contentMinWidth = 187.3;
var contentMinHeight = contentMinWidth / contentSizeDimension;
var borderRadiusDimension = 24 / 896;
var windowHeight = Dimensions.get('window').height;
var FlutterwaveButton = /** @class */ (function (_super) {
    __extends(FlutterwaveButton, _super);
    function FlutterwaveButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPending: false,
            link: null,
            resetLink: false,
            showDialog: false,
            animation: new Animated.Value(0),
            txref: null,
            buttonSize: {
                width: 0,
                height: 0
            }
        };
        _this.webviewRef = null;
        _this.reset = function () {
            if (_this.canceller) {
                _this.canceller.abort();
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
                    txref: null
                });
            }
            _this.setState({ resetLink: true });
        };
        _this.handleNavigationStateChange = function (ev) {
            // cregex to check if redirect has occured on completion/cancel
            var rx = /\/hosted\/pay\/undefined|\/api\/hosted_pay\/undefined/;
            // Don't end payment if not redirected back
            if (!rx.test(ev.url)) {
                return;
            }
            // fire handle complete
            _this.handleComplete(_this.getRedirectParams(ev.url));
        };
        _this.handleReload = function () {
            // fire if webview is set
            if (_this.webviewRef) {
                _this.webviewRef.reload();
            }
        };
        _this.handleAbortConfirm = function () {
            var onAbort = _this.props.onAbort;
            // abort action
            if (onAbort) {
                onAbort();
            }
            // remove txref and dismiss
            _this.dismiss();
        };
        _this.handleAbort = function () {
            Alert.alert('', 'Are you sure you want to cancel this payment?', [
                { text: 'No' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: _this.handleAbortConfirm
                },
            ]);
        };
        _this.handleButtonResize = function (size) {
            var buttonSize = _this.state.buttonSize;
            if (JSON.stringify(buttonSize) !== JSON.stringify(size)) {
                _this.setState({ buttonSize: size });
            }
        };
        _this.getRedirectParams = function (url) {
            // initialize result container
            var res = {};
            // if url has params
            if (url.split('?').length > 1) {
                // get query params in an array
                var params = url.split('?')[1].split('&');
                // add url params to result
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('=');
                    var val = decodeURIComponent(param[1]).trim();
                    res[param[0]] = String(val);
                }
            }
            // return result
            return res;
        };
        _this.show = function () {
            var animation = _this.state.animation;
            _this.setState({ showDialog: true }, function () {
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing["in"](Easing.elastic(0.72)),
                    useNativeDriver: false
                }).start();
            });
        };
        _this.dismiss = function () {
            var animation = _this.state.animation;
            Animated.timing(animation, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }).start(_this.reset);
        };
        _this.handleInit = function () {
            var _a = _this.props, options = _a.options, onWillInitialize = _a.onWillInitialize, onInitializeError = _a.onInitializeError, onDidInitialize = _a.onDidInitialize;
            var _b = _this.state, isPending = _b.isPending, txref = _b.txref, link = _b.link;
            // just show the dialod if the link is already set
            if (link) {
                return _this.show();
            }
            // throw error if transaction reference has not changed
            if (txref === options.txref) {
                return onInitializeError ? onInitializeError({
                    message: 'Please generate a new transaction reference.',
                    code: 'SAME_TXREF'
                }) : null;
            }
            // stop if currently in pending mode
            if (isPending) {
                return;
            }
            // initialize abort controller if not set
            _this.canceller = new AbortController;
            // fire will initialize handler if available
            if (onWillInitialize) {
                onWillInitialize();
            }
            // @ts-ignore
            // delete redirect url if set
            delete options.redirect_url;
            // set pending state to true
            _this.setState({
                isPending: true,
                link: null,
                txref: options.txref
            }, function () { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, FlutterwaveInit(options, { canceller: this.canceller })];
                        case 1:
                            result = _a.sent();
                            // stop if request was canceled
                            if (result.error && /aborterror/i.test(result.error.code)) {
                                return [2 /*return*/];
                            }
                            // call onInitializeError handler if an error occured
                            if (!result.link) {
                                if (onInitializeError && result.error) {
                                    onInitializeError(result.error);
                                }
                                return [2 /*return*/, this.dismiss()];
                            }
                            this.setState({ link: result.link, isPending: false }, this.show);
                            // fire did initialize handler if available
                            if (onDidInitialize) {
                                onDidInitialize();
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        _this.renderError = function () {
            var link = _this.state.link;
            return (<View style={styles.prompt}>
        {link ? (<>
            <Text style={styles.promptQuestion}>
              The page failed to load, please try again.
            </Text>
            <View>
              <TouchableWithoutFeedback onPress={_this.handleReload}>
                <Text style={styles.promptActionText}>Try Again</Text>
              </TouchableWithoutFeedback>
            </View>
          </>) : null}
      </View>);
        };
        return _this;
    }
    FlutterwaveButton.prototype.componentDidUpdate = function (prevProps) {
        if (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)) {
            this.handleOptionsChanged();
        }
    };
    FlutterwaveButton.prototype.componentWillUnmount = function () {
        if (this.canceller) {
            this.canceller.abort();
        }
    };
    FlutterwaveButton.prototype.handleComplete = function (data) {
        var _this = this;
        var onComplete = this.props.onComplete;
        // reset payment link
        this.setState(function (_a) {
            var resetLink = _a.resetLink, txref = _a.txref;
            return ({
                txref: data.flref && !data.canceled ? null : txref,
                resetLink: data.flwref && !data.canceled ? true : resetLink
            });
        }, function () {
            // reset
            _this.dismiss();
            // fire onComplete handler
            onComplete({
                flwref: data.flwref,
                txref: data.txref,
                canceled: /true/i.test(data.canceled || '') ? true : false
            });
        });
    };
    FlutterwaveButton.prototype.render = function () {
        var _this = this;
        var _a = this.state, link = _a.link, animation = _a.animation, showDialog = _a.showDialog;
        var marginTop = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [windowHeight, Platform.OS === 'ios' ? 46 : 14]
        });
        var opacity = animation.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 1, 1]
        });
        // render UI
        return (<>
        {this.renderButton()}
        <Modal transparent={true} animated={false} hardwareAccelerated={false} visible={showDialog}>
          {this.renderBackdrop()}
          <Animated.View style={[styles.webviewContainer, { marginTop: marginTop, opacity: opacity }]}>
            <WebView ref={function (ref) { return (_this.webviewRef = ref); }} source={{ uri: link || '' }} style={styles.webview} startInLoadingState={true} scalesPageToFit={true} javaScriptEnabled={true} onNavigationStateChange={this.handleNavigationStateChange} renderError={this.renderError} renderLoading={this.renderLoading}/>
          </Animated.View>
        </Modal>
      </>);
    };
    FlutterwaveButton.prototype.renderButton = function () {
        var _a = this.props, customButton = _a.customButton, style = _a.style, alignLeft = _a.alignLeft;
        var _b = this.state, isPending = _b.isPending, link = _b.link, showDialog = _b.showDialog, buttonSize = _b.buttonSize;
        var contentWidth = buttonSize.width * contentWidthPercentage;
        var contentHeight = contentWidth / contentSizeDimension;
        var contentSizeStyle = {
            width: contentWidth > contentMaxWidth
                ? contentMaxWidth
                : contentWidth < contentMinWidth
                    ? contentMinWidth
                    : contentWidth,
            height: contentHeight > contentMaxHeight
                ? contentMaxHeight
                : contentHeight < contentMinHeight
                    ? contentMinHeight
                    : contentHeight
        };
        // render custom button
        if (customButton) {
            return customButton({
                isInitializing: isPending && !link ? true : false,
                disabled: isPending || showDialog ? true : false,
                onPress: this.handleInit
            });
        }
        // render primary button
        return (<DefaultButton alignLeft={alignLeft} style={style} isBusy={isPending && !link} disabled={isPending || showDialog ? true : false} onPress={this.handleInit} onSizeChange={this.handleButtonResize}>
        <Image source={pryContent} resizeMode="contain" resizeMethod="resize" style={[styles.buttonContent, contentSizeStyle]} fadeDuration={0}/>
      </DefaultButton>);
    };
    FlutterwaveButton.prototype.renderBackdrop = function () {
        var animation = this.state.animation;
        // Interpolation backdrop animation
        var backgroundColor = animation.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [colors.transparent, colors.transparent, 'rgba(0,0,0,0.5)']
        });
        return (<TouchableWithoutFeedback testID='flw-backdrop' onPress={this.handleAbort}>
        <Animated.View style={Object.assign({}, styles.backdrop, { backgroundColor: backgroundColor })}/>
      </TouchableWithoutFeedback>);
    };
    FlutterwaveButton.prototype.renderLoading = function () {
        return (<View style={styles.loading}>
        <Image source={loader} resizeMode="contain" style={styles.loadingImage}/>
      </View>);
    };
    FlutterwaveButton.propTypes = {
        alignLeft: PropTypes.bool,
        onAbort: PropTypes.func,
        onComplete: PropTypes.func.isRequired,
        onWillInitialize: PropTypes.func,
        onDidInitialize: PropTypes.func,
        onInitializeError: PropTypes.func,
        options: PropTypes.shape({
            txref: PropTypes.string.isRequired,
            PBFPubKey: PropTypes.string.isRequired,
            customer_email: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            currency: PropTypes.oneOf(['NGN', 'USD', 'GHS', 'KES', 'ZAR', 'TZS']),
            payment_options: PaymentOptionsPropRule,
            payment_plan: PropTypes.number,
            subaccounts: PropTypes.arrayOf(PropTypes.number),
            country: PropTypes.string,
            pay_button_text: PropTypes.string,
            custom_title: PropTypes.string,
            custom_description: PropTypes.string,
            custom_logo: PropTypes.string,
            meta: PropTypes.arrayOf(PropTypes.shape({
                metaname: PropTypes.string,
                metavalue: PropTypes.string
            }))
        }).isRequired,
        customButton: PropTypes.func
    };
    return FlutterwaveButton;
}(React.Component));
var styles = StyleSheet.create({
    promtActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    promptActionText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    promptQuestion: {
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 18
    },
    prompt: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 56
    },
    backdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    },
    loadingImage: {
        width: 64,
        height: 64,
        resizeMode: 'contain'
    },
    loading: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    webviewContainer: {
        top: 50,
        flex: 1,
        backgroundColor: '#efefef',
        paddingBottom: 50,
        overflow: 'hidden',
        borderTopLeftRadius: windowHeight * borderRadiusDimension,
        borderTopRightRadius: windowHeight * borderRadiusDimension
    },
    webview: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    buttonContent: {
        resizeMode: 'contain'
    }
});
export default FlutterwaveButton;
