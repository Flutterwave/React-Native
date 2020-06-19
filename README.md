# React Native Flutterwave
Easily implement Flutterwave for payments in your React Native appliction. This library has support for both Android and iOS.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<p align="center">
  <img src=".github/images/github-preview.gif" alt="preview"/>
</p>

## What's Inside?
- Pay with Flutterwave button and checkout dialog.
- Standard payment initialisation function.
- Flutterwave designed button.

## Installation
This library is available on npm, you can install it by running `npm install --save react-native-flutterwave` or `yarn add react-native-flutterwave`

## Dependencies
In order to use the dialog pop up this library depends on [react-native-webview](https://github.com/react-native-community/react-native-webview) ensure you properly install this library before continuing.

## Activity Indicator (only needed for android)
To display Flutterwave styled the activity indicator when the checkout screen is being loaded on android you will need to add some modules in `android/app/build.gradle`.
***Skip this if you already have setup your app to support gif images.***
````javascript
dependencies {
  // If your app supports Android versions before Ice Cream Sandwich (API level 14)
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // For animated GIF support
  implementation 'com.facebook.fresco:animated-gif:2.0.0'
}
````


## Usage
Below are a few examples showcasing how you can use the library to implement payment in you React Native app.

### Flutterwave Button 
<img src=".github/images/pay-with-flutterwave.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````javascript
import {FlutterwaveButton} from 'react-native-flutterwave';
// or import FlutterwaveButton from 'react-native-flutterwave';

<FlutterwaveButton
  ...
  onComplete={handleOnComplete}
  options={{
    txref: txref,
    PBFPubKey: '[Your Flutterwave Public Key]',
    customer_email: 'customer-email@example.com',
    amount: 2000,
    currency: 'NGN',
  }}
/>
````

### Flutterwave Button (with custom render)
<img src=".github/images/pay-with-flutterwave-custom.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````javascript
import {FlutterwaveButton} from 'react-native-flutterwave';
// or import FlutterwaveButton from 'react-native-flutterwave';

<FlutterwaveButton
  ...
  onComplete={handleOnComplete}
  options={{...}}
  customButton={(props) => (
    <TouchableOpacity
      style={styles.paymentButton}
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={styles.paymentButtonText}>Pay $500</Text>
    </TouchableOpacity>
  )}
/>
````

### DefaultButton (Flutterwave styled button)
<img src=".github/images/flutterwave-styled-button.png" alt="preview" width="350"/>

[View All Props](#defaultbuttonprops)

Import `DefaultButton` from `react-native-flutterwave` and use it like so.
````javascript
import {DefaultButton} from 'react-native-flutterwave';

<DefaultButton
  style={styles.paymentButton}
  onPress={onPress}
  isBusy={isInitializing}
  disabled={disabled}>
    <Text style={styles.paymentButtonText}>Pay $500</Text>
</DefaultButton>
````

### Flutterwave Standard Init
[View All Options](#flutterwaveinitioptions) | [Returned Value](#flutterwaveinitresult)

Import `FlutterwaveInit` from `react-native-flutterwave` and use it like so.
````javascript
import {FlutterwaveInit} from 'react-native-flutterwave';;

// initialize a new payment
const payment = await FlutterwaveInit({
  txref: generateTransactionRef(),
  PBFPubKey: '[Your Flutterwave Public Key]',
  amount: 100,
  currency: 'USD',
});

// link is available if payment initialized successfully
if (payment.link) {
  // use payment link
  return usePaymentLink(payment.link);
}

// handle payment error
handlePaymentError(
  payment.error
    ? paymet.error.message
    : 'Kai, an unknown error occurred!'
);
````

## Props
### FlutterwaveButtonProps
| Name     | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | Object | undefined | Used to apply styling to the button.|
| onComplete | Yes | function | **REQUIRED** | Called when a payment is completed successfully or is cancelled. The function will receive [on complete data](#oncompletedata)|
| onWillInitialize | No | function | undefined | This will be called before a payment link is generated.|
| onDidInitialize | No | function | undefined | This is called when a new payment link has been successfully initialized.|
| onInitializeError | No | function | undefined | This is called if an error occurred while initializing a new pyment link. The function will receive [FlutterwaveInitError](#flutterwaveiniterror) |
| onAbort | No | function | undefined | This is called if a user aborts a transaction, a user can abort a transaction when they click on the dialog's backdrop and choose cancel when prompted to cancel transaction. |
| options | Yes | **[FlutterwaveInitOptions](#flutterwaveinitoptions)** | **REQUIRED** | The option passed here is used to initialize a payment. |
| customButton | No | function | undefined | This is used to render a custom button. The function a prop argument structured like [CustomButtonProps](#custombuttonprops), this function should return a valid React node. |
| alignLeft | No | boolean | undefined | This aligns the content of the button to the left. |

### DefaultButtonProps
| Name     | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | Object | undefined | Used to apply styling to the button.|
| onPress | Yes | function | undefined | This |
| disabled | No | boolean | undefined | This disables button, and causes onPress not to be fired.|
| isBusy | No | boolean | undefined | This puts the button in a busy state, making the content look faded.|
| onSizeChange | No | (ev: {width: number; height: number}) => void | undefined | If provided this function is fired whenever the size(height or width) of the button changes |
| children | Yes | ReactElement | undefined | This will be the content rendered within the button, if string is to be direct decendant, remember to put string in the Text component. |
| alignLeft | No | boolean | undefined | This aligns the content of the button to the left. |

## Types
#### CustomButtonProps
````typescript
interface CustomButtonProps {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}
````

#### OnCompleteData
````typescript
interface OnCompleteData {
  cancelled: boolean;
  flwref?: string;
  txref: string;
}
````

#### FlutterwaveInitError
````typescript
interface FlutterwaveInitError {
  code: string;
  message: string;
}
````

#### FlutterwavePaymentMeta
````typescript
interface FlutterwavePaymentMeta {
  metaname: string;
  metavalue: string;
}
````

#### FlutterwaveInitOptions
````typescript
export interface FlutterwaveInitOptions {
  txref: string;
  PBFPubKey: string;
  customer_firstname?: string;
  customer_lastname?: string;
  customer_phone?: string;
  customer_email: string;
  amount: number;
  currency: string;
  redirect_url?: string;
  payment_options?: string;
  payment_plan?: number;
  subaccounts?: Array<number>;
  country?: string;
  pay_button_text?: string;
  custom_title?: string;
  custom_description?: string;
  custom_logo?: string;
  meta?: Array<FlutterwavePaymentMeta>;
}
````

#### FlutterwaveButtonProps
````typescript
interface FlutterwaveButtonProps {
  style?: ViewStyle;
  onComplete: (data: OnCompleteData) => void;
  onWillInitialize?: () => void;
  onDidInitialize?: () => void;
  onInitializeError?: (error: FlutterwaveInitError) => void;
  onAbort?: () => void;
  options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
  customButton?: (props: CustomButtonProps) => React.ReactNode;
  alignLeft?: 'alignLeft' | boolean;
}
````

#### DefaultButtonProps
````typescript
interface DefaultButtonProps {
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactElement;
  isBusy?: boolean;
  onSizeChange?: (ev: {width: number; height: number}) => void;
  alignLeft?: 'alignLeft' | boolean,
}
````
