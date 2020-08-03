import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PayWithFlutterwave from '../src/PayWithFlutterwave';
import {FlutterwaveInitOptions} from '../src/FlutterwaveInit';
import {TouchableOpacity, Text} from 'react-native';
const CustomBtnTestID = 'flw-custom-button';

const CustomButton = ({onPress, disabled}) => (
  <TouchableOpacity
    testID={CustomBtnTestID}
    onPress={onPress}
    disabled={disabled}>
    <Text>{disabled ? 'Please wait...' : 'Pay'}</Text>
  </TouchableOpacity>
)

const PAYMENT_INFO: Omit<FlutterwaveInitOptions, 'redirect_url'> = {
  tx_ref: '34h093h09h034034',
  customer: {
    email: 'customer-email@example.com',
  },
  authorization: '[Authorization]',
  amount: 50,
  currency: 'NGN',
};

describe('PayWithFlutterwaveV3', () => {

  it('renders a default pay with flutterwave button', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwave
        onRedirect={() => {}}
        options={PAYMENT_INFO}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  });

  it('uses custom button in place of flw button if defined', () => {
    const Tree = renderer.create(
      <PayWithFlutterwave
        onRedirect={() => {}}
        options={PAYMENT_INFO}
        customButton={CustomButton}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  })
});
