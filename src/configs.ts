/**
 * V# API Standard initialization endpoint
 */
export const STANDARD_URL = 'https://api.flutterwave.com/v3/sdkcheckout/payments';

/**
 * Redirect URL used in V3 FlutterwaveButton
 */
export const REDIRECT_URL = 'https://flutterwave.com/rn-redirect';

/**
 * Fluttereave volors
 */
export const colors = {
  primary: '#f5a623',
  primaryLight: '#f9ce85',
  secondary: '#12122C',
  transparent: 'rgba(0,0,0,0)',
};

/**
 * Payment options available in V3
 */
export const PAYMENT_OPTIONS = [
  'account',
  'card',
  'banktransfer',
  'mpesa',
  'mobile_money_rwanda',
  'mobile_money_zambia',
  'qr',
  'mobile_money_uganda',
  'ussd',
  'credit',
  'barter',
  'mobile_money_ghana',
  'payattitude',
  'mobile_money_franco',
  'paga',
  '1voucher',
  'mobile_money_tanzania',
];

/**
 * V2 API standard initialization endpoint
 */
export const STANDARD_URL_V2: string =
  'https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay';

/**
 * Payment options available in V2 API
 */
export const PAYMENT_OPTIONS_V2 = [
  'card',
  'account',
  'ussd',
  'qr',
  'mpesa',
  'mobilemoneyghana',
  'mobilemoneyuganda',
  'mobilemoneyrwanda',
  'mobilemoneyzambia',
  'mobilemoneytanzania',
  'barter',
  'bank transfer',
  'wechat',
];
