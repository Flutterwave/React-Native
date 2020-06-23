# Aborting Payment Initialization
Hi :wave:, so there are cases where you have already initialized a payment with `FlutterwaveInit` but might also want to be able to cancel the payment initialization should in case your component is being unmounted or you want to allow users cancel the action before the payment is initialized, we have provided a way for you to do this, we use `fetch` underneath the hood to make the request to the standard payment endpoint and `fetch` allows you to pass an [abort controller](https://github.com/mo/abortcontroller-polyfill) which you can use to cancel ongoing requests, if your version of React Native does not have the abort functionality for fetch in the Javascript runtime, you will need to [install the polyfill](https://github.com/mo/abortcontroller-polyfill) before moving on. Below is a code snippet showcasing how you can go about cancelling an ongoing payment initialization.

**:point_right:`If you have already installed the polyfill or have it already available in the Javascript runtime, this action happens automatically within FlutterwaveButton.`**

````jsx
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {FlutterwaveInit} from 'react-native-flutterwave';

class MyCart extends React.Component {
  abortController = null;

  componentWillUnmout() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  handlePaymentInitialization = () => {
    this.setState({
      isPending: true,
    }, () => {
      // set abort controller
      this.abortController = new AbortController;
      // initialize a new payment
      const payment = await FlutterwaveInit({
        txref: generateTransactionRef(),
        PBFPubKey: '[Your Flutterwave Public Key]',
        amount: 100,
        currency: 'USD',
      }, {
        canceller: this.abortController,
      });
        // do nothing if our payment initialization was aborted
      if (payment.error && payment.error.code === 'ABORTERROR') {
        return;
      }
      // link is available if payment initialized successfully
      if (payment.link) {
        // use payment link
        return;
      }
      // handle other errors
    })
  }

  render() {
    const {isPending} = this.state;
    return (
      <View>
        ...
        <TouchableOpacity
          style={[
            styles.paymentbutton,
            isPending ? styles.paymentButtonBusy : {}
          ]}
          disabled={isPending}
          onPress={this.handlePaymentInitialization}
        >
          Pay $100
        </TouchableOpacity>
      </View>
    )
  }
}
````
In the above code we created a component called `MyCart` within that component we have an `abortController` property and in the same component we have two methods that interact with this property, the first is the `handlePaymentInitialization` method, this creates the abort controller before initializing the payment, the second method is `componentWillUnmount`, this is a react lifecycle hook method which is fired when the component is being unmounted, you are expected to unsubscribe from any event here before the component unmounts, so within this method we check to see if the abort controller has been defined and if it has, we call the abort method on the controller, this will abort the ongoing payment initialization and return an error with the error code `ABORTERROR`, if the we check the error code and it is the `ABORTERROR` we can then stop the execution of `handlePaymentInitialization` so nothing else happens within our unmounted component.

And that's all you need to abort an ongoing payment initialization.

With love from Flutterwave. :heart:
