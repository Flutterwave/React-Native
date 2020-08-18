import React from 'react';
import PropTypes from 'prop-types';
import {
  PayWithFlutterwavePropsBase,
  OptionsPropTypeBase,
  PayWithFlutterwavePropTypesBase
} from './PaywithFlutterwaveBase';
import FlutterwaveInit, {FlutterwaveInitOptions} from './FlutterwaveInit';
import {PAYMENT_OPTIONS} from './configs';
import {PaymentOptionsPropRule} from './utils/CustomPropTypesRules';
import PayWithFlutterwaveBase from './PaywithFlutterwaveBase';

export interface RedirectParams {
  status: 'successful' | 'cancelled',
  transaction_id?: string;
  tx_ref: string;
}

// create V3 component props
export type PayWithFlutterwaveProps = PayWithFlutterwavePropsBase & {
  onRedirect: (data: RedirectParams) => void;
  options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
}

// create V3 component
const PayWithFlutterwave:React.FC<PayWithFlutterwaveProps> = ({options, ...props}) => {
  return (
    <PayWithFlutterwaveBase
      {...props}
      reference={options.tx_ref}
      options={options}
      init={FlutterwaveInit}
    />
  );
}

// define component prop types
PayWithFlutterwave.propTypes = {
  ...PayWithFlutterwavePropTypesBase,
  // @ts-ignore
  options: PropTypes.shape({
    ...OptionsPropTypeBase,
    authorization: PropTypes.string.isRequired,
    tx_ref: PropTypes.string.isRequired,
    payment_options: PaymentOptionsPropRule(PAYMENT_OPTIONS),
    customer: PropTypes.shape({
      name: PropTypes.string,
      phonenumber: PropTypes.string,
      email: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.object,
    customizations: PropTypes.shape({
      title: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string,
    }),
  }).isRequired,
};
// export component as default
export default PayWithFlutterwave;
