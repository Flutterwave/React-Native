<p align="center">
    <img title="Flutterwave" height="200" src="https://flutterwave.com/images/logo/full.svg" width="50%"/>
</p>

# React Native Flutterwave

Easily integrate Flutterwave for payment collection in your React Native application. This library is compatible with both Android and iOS and utilizes Flutterwave's V3 API.

[![V2 API](https://img.shields.io/badge/API-V3-brightgreen)](https://developer.flutterwave.com/docs) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

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
  - [Merchant Public Key](#fire-merchant-public-key-fire)
  - [Important Information](#fire-important-information-fire)
- Usage
  - [PayWithFlutterwave ](#flutterwave-button)
  - [PayWithFlutterwave (with custom render)](#flutterwave-button-with-custom-render)
  - [FlutterwaveButton (Flutterwave styled button)](#flutterwavebutton-flutterwave-styled-button)
  - [FlutterwaveInit](#flutterwaveinit)
  - [Aborting Payment Initialization](#aborting-payment-initialization)
- Props
  - [FlutterwaveInitOptions](#flutterwaveinitoptions)
  - [PayWithFlutterwaveProps](#flutterwavebuttonprops)
  - [FlutterwaveButtonProps](#flutterwavebutton-props)
- Types
  - [PayWithFlutterwaveProps](#paywithflutterwaveprops-interface)
  - [FlutterwaveButtonProps](#flutterwavebuttonprops-interface)
  - [FlutterwaveInitCustomer](#flutterwaveinitcustomer)
  - [FlutterwaveInitCustomization](#flutterwaveinitcustomization)
  - [FlutterwaveInitSubAccount](#flutterwaveinitsubaccount)
  - [FlutterwaveInitOptions](#flutterwaveinitoptions-interface)
  - [FlutterwaveInitError](#flutterwaveiniterror)
  - [FlutterwavePaymentMeta](#flutterwavepaymentmeta)
  - [RedirectParams](#redirectparams)
  - [CustomButtonProps](#custombuttonprops)
- [Contributing](./CONTRIBUTING.md)

## What's Inside?

- Pay with Flutterwave button and checkout dialog.
- Standard payment initialization function.
- Flutterwave designed button.

## :warning: If Using Version 2 API :warning:

This section of the library documentation focuses on use cases for Version 3 of the Flutterwave API. If you are still using Version 2 of the API, please refer to [this documentation](./README.v2.md) instead.

## Installation

This library is available on npm. You can install it by running the following command:

`npm install --save flutterwave-react-native` 

or 

`yarn add flutterwave-react-native`


### Dependencies

To render the Flutterwave checkout screen, this library requires the installation of [react-native-webview](https://github.com/react-native-community/react-native-webview). Please ensure that this library is installed correctly before proceeding.

### Activity Indicator (only needed for android)

To display the Flutterwave styled activity indicator when the checkout screen is loading on Android, you will need to add a few modules to your `android/app/build.gradle` file.
**_Skip this step if your app is already setup to support gif images._**

```javascript
dependencies {
  // Include this if your app supports Android versions before Ice Cream Sandwich (API level 14).
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // Add this for animated GIF support.
  implementation 'com.facebook.fresco:animated-gif:2.0.0'
}
```

### :fire: MERCHANT PUBLIC KEY :fire:

To use this library, you are required to use your merchant public key instead of the secret key. Learn how to retrieve your API Keys [here](https://developer.flutterwave.com/v3.0.0/docs/authentication#get-your-api-keys).

### :fire: IMPORTANT INFORMATION :fire:

If the `options` property on [PayWithFlutterwave](#paywithflutterwaveprops-interface) changes, the next time your customer taps on the button, a new payment will be initialized, regardless of whether the previous transaction was successful or not.

Keep in mind that you cannot use the same transaction reference for two different payments. Make sure you generate a new transaction reference before allowing your customer start a new payment.

## Usage

Below are some examples demonstrating how to implement payment features in your React Native application.

### PayWithFlutterwave

<img src=".github/images/pay-with-flutterwave.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `PayWithFlutterwave` from `flutterwave-react-native` and use it as follows:

```tsx
import {PayWithFlutterwave} from 'flutterwave-react-native';
// or import PayWithFlutterwave from 'flutterwave-react-native';

interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
  }

 /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (data: RedirectParams) => {
      console.log(data);
    };

/* An example function to generate a random transaction reference */
  const generateTransactionRef = (length: number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

<PayWithFlutterwave
  ...
  onRedirect={handleOnRedirect}
  options={{
    tx_ref: generateTransactionRef(10)
    authorization: '[merchant public key]',
    customer: {
      email: 'customer-email@example.com'
    },
    amount: 2000,
    currency: 'NGN',
    payment_options: 'card'
  }}
/>
```

### PayWithFlutterwave (with custom render)

<img src=".github/images/pay-with-flutterwave-custom.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `PayWithFlutterwave` from `flutterwave-react-native` and use it as follows:

```tsx
import {PayWithFlutterwave} from 'flutterwave-react-native';
// or import PayWithFlutterwave from 'flutterwave-react-native';

interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
  }

 /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (data: RedirectParams) => {
      console.log(data);
    };

<PayWithFlutterwave
  ...
  onRedirect={handleOnRedirect}
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
```

### FlutterwaveButton (Flutterwave styled button)

<img src=".github/images/flutterwave-styled-button.png" alt="preview" width="350"/>

[View All Props](#flutterwavebuttonprops)

Import `FlutterwaveButton` from `flutterwave-react-native` and use it as follows:

```jsx
import {FlutterwaveButton} from 'flutterwave-react-native';

<FlutterwaveButton
  style={styles.paymentButton}
  onPress={onPress}
  disabled={disabled}>
  <Text style={styles.paymentButtonText}>Pay $500</Text>
</FlutterwaveButton>;
```

### FlutterwaveInit

When called, this function returns a Promise that either resolves to a string on success or rejects if an error occurs. [See all config options](#flutterwaveinitoptions).

Import `FlutterwaveInit` from `flutterwave-react-native` and use it as follows:

```javascript
import {FlutterwaveInit} from 'flutterwave-react-native';

try {
  // initialize payment
  const paymentLink = await FlutterwaveInit({
    tx_ref: generateTransactionRef(),
    authorization: '[your merchant public Key]',
    amount: 100,
    currency: 'USD',
    customer: {
      email: 'customer-email@example.com',
    },
    payment_options: 'card',
  });
  // use payment link
  usePaymentLink(paymentLink);
} catch (error) {
  // handle payment error
  displayError(error.message);
}
```

### Aborting Payment Initialization

:wave: Hi! There may be cases where you've already initiated a payment using `FlutterwaveInit`, but you might want the option of cancelling the payment initiation. This could be necessary if your component is being unmounted or if you want to allow customers cancel the action before the payment is initialized. We have provided a method for you to accomplish this. [Continue reading here](./docs/AbortingPaymentInitialization.md).

## Props

### FlutterwaveInitOptions

[See Interface](#flutterwaveinitoptions-interface)
| Name | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| authorization | Yes | string | **REQUIRED** | Your merchant public key. Learn how to retrieve your key [here](https://developer.flutterwave.com/v3.0.0/docs/authentication#get-your-api-keys).|
| tx_ref | Yes | string | **REQUIRED** | Your transaction reference. This must be unique for each transaction.|
| amount | Yes | string | **REQUIRED** | The amount to charge your customer. |
| currency | No | string | NGN | The currency to charge in. Defaults to NGN. [See accepted currencies here](https://flutterwave.com/tz/support/general/what-are-the-currencies-accepted-on-flutterwave)|
| integrity_hash | No | string | undefined | This is a sha256 hash of your FlutterwaveCheckout values, it is used for passing secured values to the payment gateway. |
| payment_options | Yes | string | **REQUIRED** | This specifies the payment options displayed to your customers e.g - card, mobilemoney, ussd and so on. |
| payment_plan | No | number | undefined | This is the payment plan ID used for recurring payments. You can learn more by visiting [here](https://developer.flutterwave.com/v3.0.0/docs/payment-plans-1). |
| redirect_url | Yes | string | **REQUIRED** | The URL where you want to redirect customers after a completed transaction. This is useful for 3DSecure payments, allowing us to send your customer to a custom page you wish to display. **IMPORTANT** This is only required when you are directly using [FlutterwaveInit](#flutterwave-standard-init). |
| customer | Yes | [FlutterwaveInitCustomer](#flutterwaveinitcustomer) | **REQUIRED** | This is an object that contains your customer details. `E.g.'customer': { 'email': 'example@example.com', 'phonenumber': '08012345678', 'name': 'Takeshi Kovacs' }.` |
| subaccounts | No | array of [FlutterwaveInitSubAccount](#flutterwaveinitsubaccount) | undefined | This is an array of objects containing the subaccount IDs for splitting payments. Find more information by visiting our [Split Payment Page](https://developer.flutterwave.com/v3.0.0/docs/split-payments).|
| meta | No | [FlutterwavePaymentMeta](#flutterwavepaymentmeta) | undefined | This object is used to include additional payment information for your request.`E.g. { 'consumer_id': 23, 'consumer_mac': '92a3-912ba-1192a' }` |
| customizations | No | [FlutterwaveInitCustomizations](#flutterwaveinitcustomizations) | undefined | This object contains a title, logo, and description to display on the modal. `E.g. {'title': 'Pied Piper Payments', 'description': 'Middleout isn't free. Pay the price', 'logo': 'https://assets.piedpiper.com/logo.png'}` |

### PayWithFlutterwaveProps

[See Interface](#paywithflutterwaveprops-interface)
| Name | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | object | undefined | This property is used to apply styling to the button.|
| onRedirect | Yes | function | **REQUIRED** | This function is called when a payment is either completed successfully or cancelled. It receives [redirect params](#redirectparams) as an argument.|
| onWillInitialize | No | function | undefined | This function is called before a payment link is generated.|
| onDidInitialize | No | function | undefined | This function is called when a new payment link has been successfully initialized.|
| onInitializeError | No | function | undefined | This function is called if an error occurs while initializing a new payment link. It will receive [FlutterwaveInitError](#flutterwaveiniterror). |
| onAbort | No | function | undefined | This function is called if a customer aborts a transaction, a customer can abort a transaction when they click on the dialog's backdrop and choose cancel when prompted to cancel transaction. |
| options | Yes | [FlutterwaveInitOptions](#flutterwaveinitoptions) | **REQUIRED** | The option passed here is used to initialize a payment. |
| customButton | No | function | undefined | This function is used to render a custom button. It accepts a prop argument structured like [CustomButtonProps](#custombuttonprops), this function should return a valid React node. |
| alignLeft | No | boolean | undefined | This property aligns the content of the button to the left. |

### FlutterwaveButton Props

[See Interface](#flutterwavebuttonprops-interface)
| Name | Required | Type | Default | Description |
| --------- | --------- | ---- | ------- | ----------- |
| style | No | ViewStyle | undefined | This component accepts the same style properties applicable to React-Native View component.|
| onPress | Yes | function | undefined | This property receive a function that is called when the button is pressed. |
| disabled | No | boolean | undefined | This disables the button, preventing the onPress function from being triggered.|
| alignLeft | No | boolean | undefined | This aligns the content of the button to the left. |

## Types

#### CustomButtonProps

```typescript
interface CustomButtonProps {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}
```

#### RedirectParams

```typescript
interface RedirectParams {
  status: 'successful' | 'cancelled';
  transaction_id?: string;
  tx_ref: string;
}
```

#### FlutterwaveInitError

```typescript
interface FlutterwaveInitError {
  code: string;
  message: string;
  errorId?: string;
  errors?: Array<string>;
}
```

#### FlutterwavePaymentMeta

```typescript
interface FlutterwavePaymentMeta {
  [k: string]: any;
}
```

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

```typescript
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
  meta?: FlutterwavePaymentMeta;
  customizations?: FlutterwaveInitCustomizations;
}
```

#### PayWithFlutterwaveProps Interface

```typescript
interface PayWithFlutterwaveProps {
  style?: ViewStyle;
  onRedirect: (data: RedirectParams) => void;
  onWillInitialize?: () => void;
  onDidInitialize?: () => void;
  onInitializeError?: (error: FlutterwaveInitError) => void;
  onAbort?: () => void;
  options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
  customButton?: (props: CustomButtonProps) => React.ReactNode;
  alignLeft?: 'alignLeft' | boolean;
}
```

#### FlutterwaveButtonProps Interface

```typescript
interface FlutterwaveButtonProps {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  alignLeft?: boolean;
  onPress?: () => void;
}
```

## Contributing

For information on how you can contribute to this repo, simply [go here](./CONTRIBUTING.md), all contributions are greatly appreciated.

With love from Flutterwave. :yellow_heart:
