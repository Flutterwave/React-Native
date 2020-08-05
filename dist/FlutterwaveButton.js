import React from 'react';
import { StyleSheet, Image, TouchableHighlight, View, } from 'react-native';
import { colors } from './configs';
var pryContent = require('./assets/pry-button-content.png');
var contentSizeDimension = 8.2962962963;
var FlutterwaveButton = function FlutterwaveButton(_a) {
    var style = _a.style, alignLeft = _a.alignLeft, children = _a.children, disabled = _a.disabled, onPress = _a.onPress;
    // render primary button
    return (<TouchableHighlight underlayColor={colors.primaryLight} disabled={disabled} onPress={onPress} style={[
        styles.button,
        disabled ? styles.buttonBusy : {},
        alignLeft ? styles.buttonAlignLeft : {},
        style
    ]} activeOpacity={1} testID='flw-button'>
        <>
          {children ? children : (<Image source={pryContent} resizeMode="contain" resizeMethod="resize" style={styles.buttonContent} fadeDuration={0}/>)}
          {disabled
        ? (<View style={styles.buttonBusyOvelay}/>)
        : null}
        </>
    </TouchableHighlight>);
};
// component UI styles
var styles = StyleSheet.create({
    buttonBusyOvelay: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    buttonBusy: {
        borderColor: colors.primaryLight
    },
    buttonAlignLeft: {
        justifyContent: 'flex-start'
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
    },
    buttonContent: {
        resizeMode: 'contain',
        width: 187.3,
        height: 187.3 / contentSizeDimension
    }
});
// export component as default
export default FlutterwaveButton;
