import React from 'react';
import { View, StyleSheet, TouchableHighlight, } from "react-native";
import { colors } from './configs';
function getBusyStyle(isBusy) {
    if (!isBusy) {
        return {};
    }
    return styles.buttonBusy;
}
function getAlginStyle(alignLeft) {
    if (alignLeft) {
        return styles.buttonAlignLeft;
    }
    return {};
}
/**
 * Button base design.
 * @param param0
 */
var DefaultButton = function Button(_a) {
    var style = _a.style, onPress = _a.onPress, disabled = _a.disabled, children = _a.children, isBusy = _a.isBusy, onSizeChange = _a.onSizeChange, alignLeft = _a.alignLeft;
    var handleOnLayout = function (ev) {
        var _a = ev.nativeEvent.layout, width = _a.width, height = _a.height;
        if (onSizeChange) {
            onSizeChange({ width: width, height: height });
        }
    };
    return (<TouchableHighlight underlayColor={colors.primary} disabled={disabled} onPress={onPress} style={[
        styles.button,
        getBusyStyle(isBusy),
        getAlginStyle(alignLeft),
        style
    ]} activeOpacity={1} onLayout={handleOnLayout} testID='flw-default-button'>
      <>
        {children}
        {isBusy
        ? (<View style={styles.buttonBusyOvelay}/>)
        : null}
      </>
    </TouchableHighlight>);
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
