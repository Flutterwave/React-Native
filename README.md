# React Native Flutterwave
Easily implement Flutterwave for payments in your React Native appliction. This library has support for both Android and iOS.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<p align="center">
    <img src=".github/images/github-preview-ios.gif" alt="ios-preview"/>
    <img src=".github/images/github-preview-android.gif" alt="android-preview"/>
</p>

## Table Of Content
- Getting Started
  - [V2 API](#warning-if-using-version-2-api-warning)
  - [Installation](#installation)
  - [Dependencies](#dependencies)
  - [Activity Indicator (Android)](#activity-indicator-only-needed-for-android)
  - [Important Information](#fire-important-information-fire)
- Usage
  - [Flutterwave Button ](#flutterwave-button)
  - [Flutterwave Button (with custom render)](#flutterwave-button-with-custom-render)
  - [Default Button (Flutterwave styled button)](#defaultbutton-flutterwave-styled-button)
  - [Flutterwave Standard Init](#flutterwave-standard-init)
  - [Aborting Payment Initialization](#aborting-payment-initialization)
- Props
  - [Flutterwave Button Props](#flutterwavebuttonprops)
  - [Default Button Props](#defaultbuttonprops)
  - [Flutterwave Init Options](#flutterwaveinitoptions)
- Types
  - [Flutterwave Button Props](#flutterwavebuttonprops-interface)
  - [Default Button Props](#defaultbuttonprops-interface)
  - [Flutterwave Init Customer](#flutterwaveinitcustomer)
  - [Flutterwave Init Customization](#flutterwaveinitcustomization)
  - [Flutterwave Init Sub Account](#flutterwaveinitsubaccount)
  - [Flutterwave Init Options](#flutterwaveinitoptions-interface)
  - [Flutterwave Init Error](#flutterwaveiniterror)
  - [FlutterwavePaymentMeta](#flutterwavepaymentmeta)
  - [RedirectParams](#redirectparams)
  - [CustomButtonProps](#custombuttonprops)
- [Contributing](./CONTRIBUTING.md)

## What's Inside?
- Pay with Flutterwave button and checkout dialog.
- Standard payment initialization function.
- Flutterwave designed button.

## :warning: If Using Version 2 API :warning:
This version of the library's docs focuses on use cases with the Version 3 of Flutterwaves API, if you are still using the Version 2 API please use [this documentation](./README.v2.md) instead.

## Installation
This library is available on npm, you can install it by running `npm install --save react-native-flutterwave` or `yarn add react-native-flutterwave`

### Dependencies
In order to render the Flutterwave checkout screen this library depends on [react-native-webview](https://github.com/react-native-community/react-native-webview) ensure you properly install this library before continuing.

### Activity Indicator (only needed for android)
To display the Flutterwave styled activity indicator when the checkout screen is being loaded on Android you will need to add some modules in `android/app/build.gradle`.
***Skip this if you already have setup your app to support gif images.***
````javascript
dependencies {
  // If your app supports Android versions before Ice Cream Sandwich (API level 14)
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // For animated GIF support
  implementation 'com.facebook.fresco:animated-gif:2.0.0'
}
````

### :fire: IMPORTANT INFORMATION :fire:
If the `options` property on the [FlutterwaveButton](#flutterwavebuttonprops-interface) changes, when next the user taps on the button a new payment will be initialized whether the last one was successful or not.

Remember you cannot use the same transaction reference for two different payments, remember to recreate the transaction reference before allowing the user initiate a new payment.


## Usage
Below are a few examples showcasing how you can use the library to implement payment in your React Native app.

### Flutterwave Button 
<img src=".github/images/pay-with-flutterwave.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````jsx
import {FlutterwaveButton} from 'react-native-flutterwave';
// or import FlutterwaveButton from 'react-native-flutterwave';

<FlutterwaveButton
  ...
  onComplete={handleOnComplete}
  options={{
    tx_ref: transactionReference,
    authorization: '[merchant secret key]',
    customer: {
      email: 'customer-email@example.com'
    },
    amount: 2000,
    currency: 'NGN',
    payment_options: 'card'
  }}
/>
````

### Flutterwave Button (with custom render)
<img src=".github/images/pay-with-flutterwave-custom.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `FlutterwaveButton` from `react-native-flutterwave` and use it like so.
````jsx
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
````jsx
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
When called, this function returns a Promise which resolves to a string on success and rejects if an error occurs. [See all config options](#flutterwaveinitoptions)

Import `FlutterwaveInit` from `react-native-flutterwave` and use it like so.
````javascript
import {FlutterwaveInit} from 'react-native-flutterwave';

try {
  // initialize payment
  const paymentLink = await FlutterwaveInit({
    tx_ref: generateTransactionRef(),
    authorization: '[your merchant secret Key]',
    amount: 100,
    currency: 'USD',
    customer: {
      email: 'customer-email@example.com'
    },
    payment_options: 'card'
  });
  // use payment link
  usePaymentLink(paymentLink);
} catch (error) {
  // handle payment error
  displayError(error.message);
}
````
### Aborting Payment Initialization
:wave: Hi, so there are cases where you have already initialized a payment with `FlutterwaveInit` but might also want to be able to cancel the payment initialization should in case your component is being unmounted or you want to allow users cancel the action before the payment is initialized, we have provided a way for you to do this... [continue reading](./docs/AbortingPaymentInitialization.md)

## Props

### FlutterwaveInitOptions
[See Interface](#flutterwaveinitoptions-interface)
| Name     | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| authorization | Yes | string | **REQUIRED** | Your merchant secret key, see how to get your [API Keys](https://developer.flutterwave.com/v3.0/docs/api-keys)|
| tx_ref | Yes | string | **REQUIRED** | Your transaction reference. This MUST be unique for every transaction.|
| amount | Yes | string | **REQUIRED** | Amount to charge the customer. |
| currency | No | string | NGN | Currency to charge in. Defaults to NGN. |
| integrity_hash | No | string | undefined | This is a sha256 hash of your FlutterwaveCheckout values, it is used for passing secured values to the payment gateway. |
| payment_options | Yes | string | **REQUIRED** | This specifies the payment options to be displayed e.g - card, mobilemoney, ussd and so on. |
| payment_plan | No | number | undefined | This is the payment plan ID used for [Recurring billing](https://developer.flutterwave.com/v3.0/docs/recurring-billing). |
| redirect_url | Yes | string | **REQUIRED** | URL to redirect to when a transaction is completed. This is useful for 3DSecure payments so we can redirect your customer back to a custom page you want to show them. **IMPORTANT** This only required when you are directly using [FlutterwaveInit](#flutterwave-standard-init) |
| customer | Yes | [FlutterwaveInitCustomer](#flutterwaveinitcustomer) | **REQUIRED** | This is an object that can contains your customer details. `E.g.'customer': { 'email': 'example@example.com', 'phonenumber': '08012345678', 'name': 'Takeshi Kovacs' }.` |
| subaccounts | No | array of [FlutterwaveInitSubAccount](#flutterwaveinitsubaccount) | undefined | This is an array of objects containing the subaccount IDs to split the payment into. Check out the [Split Payment page](https://developer.flutterwave.com/docs/split-payment) for more info |
| meta | No | array of [FlutterwavePaymentMeta](#flutterwavepaymentmeta) | undefined | This is an object that helps you include additional payment information to your request. `E.g. { 'consumer_id': 23, 'consumer_mac': '92a3-912ba-1192a' }` |
| customizations | No | [FlutterwaveInitCustomizations](#flutterwaveinitcustomizations) | undefined | This is an object that contains title, logo, and description you want to display on the modal `E.g. {'title': 'Pied Piper Payments', 'description': 'Middleout isn't free. Pay the price', 'logo': 'https://assets.piedpiper.com/logo.png'}` |

### FlutterwaveButtonProps
[See Interface](#flutterwavebuttonprops-interface)
| Name     | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | object | undefined | Used to apply styling to the button.|
| onComplete | Yes | function | **REQUIRED** | Called when a payment is completed successfully or is canceled. The function will receive [redirect params](#redirectparams) as an argument.|
| onWillInitialize | No | function | undefined | This will be called before a payment link is generated.|
| onDidInitialize | No | function | undefined | This is called when a new payment link has been successfully initialized.|
| onInitializeError | No | function | undefined | This is called if an error occurred while initializing a new pyment link. The function will receive [FlutterwaveInitError](#flutterwaveiniterror) |
| onAbort | No | function | undefined | This is called if a user aborts a transaction, a user can abort a transaction when they click on the dialog's backdrop and choose cancel when prompted to cancel transaction. |
| options | Yes | [FlutterwaveInitOptions](#flutterwaveinitoptions) | **REQUIRED** | The option passed here is used to initialize a payment. |
| customButton | No | function | undefined | This is used to render a custom button. The function a prop argument structured like [CustomButtonProps](#custombuttonprops), this function should return a valid React node. |
| alignLeft | No | boolean | undefined | This aligns the content of the button to the left. |

### DefaultButtonProps
[See Interface](#defaultbuttonprops-interface)
| Name     | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | object | undefined | Used to apply styling to the button.|
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

#### RedirectParams
````typescript
interface RedirectParams {
  status: 'successful' | 'cancelled',
  transaction_id?: string;
  tx_ref: string;
}
````

#### FlutterwaveInitError
````typescript
interface FlutterwaveInitError {
  code: string;
  message: string;
  errorId?: string;
  errors?: Array<string>;
}
````

### FlutterwaveInitSubAccount
```typescript
interface FlutterwaveInitSubAccount {
  id: string;
  transaction_split_ratio?: number;
  transaction_charge_type?: string;
  transaction_charge?: number;
}
```

#### FlutterwavePaymentMeta
````typescript
interface FlutterwavePaymentMeta {
  [k: string]: any;
}
````

### FlutterwaveInitCustomer
```typescript
interface FlutterwaveInitCustomer {
  email: string;
  phonenumber?: string;
  name?: string;
}
```

### FlutterwaveInitCustomizations
```typescript
interface FlutterwaveInitCustomizations {
  title?: string;
  logo?: string;
  description?: string;
}
```

### FlutterwaveInitSubAccount
```typescript
interface FlutterwaveInitSubAccount {
  id: string;
  transaction_split_ratio?: number;
  transaction_charge_type?: string;
  transaction_charge?: number;
}
```

#### FlutterwaveInitOptions Interface
````typescript
export interface FlutterwaveInitOptions {
  authorization: string;
  tx_ref: string;
  amount: number;
  currency: string;
  integrity_hash?: string;
  payment_options?: string;
  payment_plan?: number;
  redirect_url: string;
  customer: FlutterwaveInitCustomer;
  subaccounts?: Array<FlutterwaveInitSubAccount>;
  meta?: Array<FlutterwavePaymentMeta>;
  customizations?: FlutterwaveInitCustomizations;
}
````

#### FlutterwaveButtonProps Interface
````typescript
interface FlutterwaveButtonProps {
  style?: ViewStyle;
  onComplete: (data: RedirectParams) => void;
  onWillInitialize?: () => void;
  onDidInitialize?: () => void;
  onInitializeError?: (error: FlutterwaveInitError) => void;
  onAbort?: () => void;
  options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
  customButton?: (props: CustomButtonProps) => React.ReactNode;
  alignLeft?: 'alignLeft' | boolean;
}
````

#### DefaultButtonProps Interface
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

## Contributing
For information on how you can contribute to this repo, simply [go here](./CONTRIBUTING.md), all contributions are greatly appreciated.

With love from Flutterwave. :yellow_heart:
