import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PayWithFlutterwaveV2 from '../src/PayWithFlutterwaveV2';
import {FlutterwaveInitV2Options} from '../src/FlutterwaveInitV2';
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

const PAYMENT_INFO: Omit<FlutterwaveInitV2Options, 'redirect_url'> = {
  txref: '34h093h09h034034',
  customer_email: 'customer-email@example.com',
  PBFPubKey: '[Public Key]',
  amount: 50,
  currency: 'NGN',
};

describe('PayWithFlutterwaveV3', () => {

  it('renders a default pay with flutterwave button', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveV2
        onRedirect={() => {}}
        options={PAYMENT_INFO}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  });

  it('uses custom button in place of flw button if defined', () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveV2
        onRedirect={() => {}}
        options={PAYMENT_INFO}
        customButton={CustomButton}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  })
});
