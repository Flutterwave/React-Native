import React from 'react';
import { StyleSheet, Modal, View, Animated, TouchableWithoutFeedback, Text, Alert, Image, Dimensions, Easing, TouchableOpacity, Platform, } from 'react-native';
import WebView from 'react-native-webview';
import { colors } from './configs';
var loader = require('./assets/loader.gif');
var borderRadiusDimension = 24 / 896;
var windowHeight = Dimensions.get('window').height;
var getRedirectParams = function (url) {
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
var FlutterwaveCheckout = function FlutterwaveCheckout(props) {
    var link = props.link, visible = props.visible, onRedirect = props.onRedirect, onAbort = props.onAbort;
    var _a = React.useState(false), show = _a[0], setShow = _a[1];
    var webviewRef = React.useRef(null);
    var animation = React.useRef(new Animated.Value(0));
    var animateIn = React.useCallback(function () {
        setShow(true);
        Animated.timing(animation.current, {
            toValue: 1,
            duration: 700,
            easing: Easing["in"](Easing.elastic(0.72)),
            useNativeDriver: false
        }).start();
    }, []);
    var animateOut = React.useCallback(function () {
        return new Promise(function (resolve) {
            Animated.timing(animation.current, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }).start(function () {
                setShow(false);
                resolve();
            });
        });
    }, []);
    var handleReload = React.useCallback(function () {
        if (webviewRef.current) {
            webviewRef.current.reload();
        }
    }, []);
    var handleAbort = React.useCallback(function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        if (!confirmed) {
            Alert.alert('', 'Are you sure you want to cancel this payment?', [
                { text: 'No' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: function () { return handleAbort(true); }
                },
            ]);
            return;
        }
        // remove tx_ref and dismiss
        animateOut().then(onAbort);
    }, [onAbort, animateOut]);
    var handleNavigationStateChange = React.useCallback(function (ev) {
        // cregex to check if redirect has occured on completion/cancel
        var rx = /\/flutterwave\.com\/rn-redirect/;
        // Don't end payment if not redirected back
        if (!rx.test(ev.url)) {
            return true;
        }
        // dismiss modal
        animateOut().then(function () {
            if (onRedirect) {
                onRedirect(getRedirectParams(ev.url));
            }
        });
        return false;
    }, [onRedirect]);
    var doAnimate = React.useCallback(function () {
        if (visible === show) {
            return;
        }
        if (visible) {
            return animateIn();
        }
        animateOut().then(function () { });
    }, [visible, show, animateOut, animateIn]);
    React.useEffect(function () {
        doAnimate();
        return function () { };
    }, [doAnimate]);
    var marginTop = animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight, 0]
    });
    var opacity = animation.current.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 1, 1]
    });
    return (<Modal transparent={true} animated={false} hardwareAccelerated={false} visible={show}>
      <FlutterwaveCheckoutBackdrop onPress={function () { return handleAbort(); }} animation={animation.current}/>
      <Animated.View style={[
        styles.webviewContainer,
        {
            marginTop: marginTop,
            opacity: opacity
        }
    ]} testID='flw-checkout-dialog'>
        <WebView ref={webviewRef} source={{ uri: link || '' }} style={styles.webview} startInLoadingState={true} scalesPageToFit={true} javaScriptEnabled={true} onShouldStartLoadWithRequest={handleNavigationStateChange} renderError={function () { return <FlutterwaveCheckoutError hasLink={!!link} onTryAgain={handleReload}/>; }} renderLoading={function () { return <FlutterwaveCheckoutLoader />; }}/>
      </Animated.View>
    </Modal>);
};
var FlutterwaveCheckoutBackdrop = function FlutterwaveCheckoutBackdrop(_a) {
    var animation = _a.animation, onPress = _a.onPress;
    // Interpolation backdrop animation
    var backgroundColor = animation.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [colors.transparent, colors.transparent, 'rgba(0,0,0,0.5)']
    });
    return (<TouchableWithoutFeedback testID='flw-checkout-backdrop' onPress={onPress}>
      <Animated.View style={Object.assign({}, styles.backdrop, { backgroundColor: backgroundColor })}/>
    </TouchableWithoutFeedback>);
};
export var FlutterwaveCheckoutError = function (_a) {
    var hasLink = _a.hasLink, onTryAgain = _a.onTryAgain;
    return (<View style={styles.error} testID="flw-checkout-error">
      {hasLink ? (<>
          <Text style={styles.errorText}>
            An error occurred, please tab below to try again.
          </Text>
          <TouchableOpacity style={styles.errorActionButton} onPress={onTryAgain}>
            <Text style={styles.errorActionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </>) : (<Text style={styles.errorText}>
          An error occurred, please close the checkout dialog and try again.
        </Text>)}
    </View>);
};
var FlutterwaveCheckoutLoader = function () {
    return (<View style={styles.loading} testID="flw-checkout-loader">
      <Image source={loader} resizeMode="contain" style={styles.loadingImage}/>
    </View>);
};
var styles = StyleSheet.create({
    errorActionButtonText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 16
    },
    errorActionButton: {
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    errorText: {
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 18
    },
    error: {
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
        top: Platform.select({ ios: 96, android: 64 }),
        flex: 1,
        backgroundColor: '#efefef',
        paddingBottom: Platform.select({ ios: 96, android: 64 }),
        overflow: 'hidden',
        borderTopLeftRadius: windowHeight * borderRadiusDimension,
        borderTopRightRadius: windowHeight * borderRadiusDimension
    },
    webview: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)'
    }
});
export default FlutterwaveCheckout;
