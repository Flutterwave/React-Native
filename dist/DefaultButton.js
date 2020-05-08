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
import React from 'react';
import { View, StyleSheet, TouchableHighlight, } from "react-native";
import { colors } from './configs';
function getBaseStyle(alt) {
    if (alt) {
        return __assign(__assign({}, styles.button), styles.buttonAlt);
    }
    return styles.button;
}
function getBusyStyle(isBusy, alt) {
    if (!isBusy) {
        return {};
    }
    if (alt) {
        return __assign(__assign({}, styles.buttonBusy), styles.buttonAltBusy);
    }
    return styles.buttonBusy;
}
function getAlginStyle(alignLeft) {
    if (alignLeft) {
        return styles.buttonAlignLeft;
    }
    return {};
}
function getBusyOverlayStyle(alt) {
    if (alt) {
        return __assign(__assign({}, styles.buttonBusyOvelay), styles.buttonAltBusyOvelay);
    }
    return styles.buttonBusyOvelay;
}
/**
 * Button base design.
 * @param param0
 */
var DefaultButton = function Button(_a) {
    var style = _a.style, onPress = _a.onPress, disabled = _a.disabled, children = _a.children, isBusy = _a.isBusy, overlayStyle = _a.overlayStyle, onSizeChange = _a.onSizeChange, alt = _a.alt, alignLeft = _a.alignLeft;
    var handleOnLayout = function (ev) {
        var _a = ev.nativeEvent.layout, width = _a.width, height = _a.height;
        if (onSizeChange) {
            onSizeChange({ width: width, height: height });
        }
    };
    return (<TouchableHighlight underlayColor={alt ? '#fff' : colors.primary} disabled={disabled} onPress={onPress} style={__assign(__assign(__assign(__assign({}, getBaseStyle(alt)), getBusyStyle(isBusy, alt)), getAlginStyle(alignLeft)), (style || {}))} activeOpacity={1} onLayout={handleOnLayout} testID='flw-default-button'>
      <>
        {children}
        {isBusy
        ? (<View style={__assign(__assign({}, getBusyOverlayStyle(alt)), (overlayStyle || {}))}/>)
        : null}
      </>
    </TouchableHighlight>);
};
DefaultButton.defaultProps = {
    underlayColor: colors.primary
};
var styles = StyleSheet.create({
    buttonBusyOvelay: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    buttonAltBusyOvelay: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    buttonBusy: {
        borderColor: '#FBDBA7'
    },
    buttonAltBusy: {
        borderColor: '#D0D0D5'
    },
    buttonAlignLeft: {
        justifyContent: 'flex-start'
    },
    buttonAlt: {
        backgroundColor: '#fff',
        borderColor: colors.secondary
    },
    button: {
        paddingHorizontal: 16,
        minWidth: 100,
        height: 52,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden'
    }
});
export default DefaultButton;
