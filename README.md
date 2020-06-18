# React Native Flutterwave
Easily implement Flutterwave for payments in your React Native appliction. This library has support for both Android and iOS.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![preview](.github/images/github-preview.gif)

## What's Inside?
- Pay with Flutterwave button and checkout dialog.
- Standard payment initialisation function.
- Flutterwave designed button.

## Installation
This library is available on npm, you can install it by running `npm install --save react-native-flutterwave` or `yarn add react-native-flutterwave`

## Dependencies
In order to use the dialog pop up this library depends on [react-native-webview](https://github.com/react-native-community/react-native-webview) ensure you properly install this library before continuing.

# Usage
Below are a few examples showcasing how you can use the library to implement payment in you React Native app.

## Flutterwave Button
![preview](.github/images/pay-with-flutterwave.png)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````javascript
import React from 'react';
import {View} from 'react-native';
import {FlutterwaveButton} from 'react-native-flutterwave';
// or import FlutterwaveButton from 'react-native-flutterwave';

const MyComponent = (props) => {
  ...
  return (
    <View>
      ...
      <FlutterwaveButton
        style={styles.paymentButton}
        onComplete={handleOnComplete}
        onAbort={handleOnInitializeError}
        onInitializeError={handleOnInitializeError}
        options={{
          txref: txref,
          PBFPubKey: '[Your Flutterwave Public Key]',
          customer_email: 'customer-email@example.com',
          amount: 2000,
          currency: 'NGN',
        }}
      />
    </View>
  );
}
````

## Flutterwave Button (with custom render)
![preview](.github/images/pay-with-flutterwave-custom.png)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````javascript
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {FlutterwaveButton} from 'react-native-flutterwave';
// or import FlutterwaveButton from 'react-native-flutterwave';

const MyComponent = (props) => {
  ...
  return (
    <View>
      ...
      <FlutterwaveButton
        onComplete={handleOnComplete}
        onAbort={handleOnInitializeError}
        onInitializeError={handleOnInitializeError}
        options={{
          txref: txref,
          PBFPubKey: '[Your Flutterwave Public Key]',
          customer_email: 'customer-email@example.com',
          amount: 2000,
          currency: 'NGN',
        }}
        customButton={(props) => (
          <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disabled}
            style={styles.paymentButton}
          >
            <Text
              style={
                props.isInitializing
                  ? styles.paymentButtonTextBusy
                  : styles.paymentButtonText
              }
            >
              {props.isInitializing  ? "Please wait..." : "Pay NGN 2000"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
````
