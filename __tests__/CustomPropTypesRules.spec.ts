import 'react-native';
import {PaymentOptionsPropRule} from '../src/utils/CustomPropTypesRules';
const PropName = 'payment_options';
const PAYMENT_OPTIONS = ['barter', 'card', 'banktransfer']

describe('CustomPropTypes.PaymentOptionsPropRule', () => {
  it ('returns null if prop is not defined in props', () => {
    const result = PaymentOptionsPropRule(PAYMENT_OPTIONS)({}, PropName);
    expect(result).toBe(null);
  });

  it ('returns error if prop is not a string', () => {
    const result = PaymentOptionsPropRule(PAYMENT_OPTIONS)({[PropName]: []}, PropName);
    expect(result !== null).toBe(true);
    expect(result.message).toContain('should be a string.');
  });

  it ('returns error if prop includes invalid payment option', () => {
    const result = PaymentOptionsPropRule(PAYMENT_OPTIONS)({[PropName]: 'barter, foo'}, PropName);
    expect(result !== null).toBe(true);
    expect(result.message).toContain('must be any of the following values.');
  });

  it ('returns null if payment options are valid', () => {
    const result = PaymentOptionsPropRule(PAYMENT_OPTIONS)({[PropName]: 'barter'}, PropName);
    expect(result).toBe(null);
  });
})
