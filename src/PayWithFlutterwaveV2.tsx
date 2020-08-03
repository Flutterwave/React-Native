import React from 'react';
import PropTypes from 'prop-types';
import {
  PayWithFlutterwavePropsBase,
  OptionsPropTypeBase,
  PayWithFlutterwavePropTypesBase
} from './PaywithFlutterwaveBase';
import FlutterwaveInitV2, {FlutterwaveInitV2Options} from './FlutterwaveInitV2';
import {PAYMENT_OPTIONS_V2} from './configs';
import {PaymentOptionsPropRule} from './utils/CustomPropTypesRules';
import PayWithFlutterwaveBase from './PaywithFlutterwaveBase';

export interface RedirectParamsV2 {
  cancelled?: 'true' | 'false';
  flwref?: string;
  txref: string;
}

export type PayWithFlutterwaveV2Props = PayWithFlutterwavePropsBase & {
  onRedirect: (data: RedirectParamsV2) => void;
  options: Omit<FlutterwaveInitV2Options, 'redirect_url'>;
}

// create V2 component
const PayWithFlutterwaveV2:React.FC<PayWithFlutterwaveV2Props> = ({options, ...props}) => {
  return (
    <PayWithFlutterwaveBase
      {...props}
      reference={options.txref}
      options={options}
      init={FlutterwaveInitV2}
    />
  );
}

// define component prop types
PayWithFlutterwaveV2.propTypes = {
  ...PayWithFlutterwavePropTypesBase,
  // @ts-ignore
  options: PropTypes.shape({
    ...OptionsPropTypeBase,
    payment_options: PaymentOptionsPropRule(PAYMENT_OPTIONS_V2),
    txref: PropTypes.string.isRequired,
    PBFPubKey: PropTypes.string.isRequired,
    customer_firstname: PropTypes.string,
    customer_lastname: PropTypes.string,
    customer_email: PropTypes.string.isRequired,
    customer_phone: PropTypes.string,
    country: PropTypes.string,
    pay_button_text: PropTypes.string,
    custom_title: PropTypes.string,
    custom_description: PropTypes.string,
    custom_logo: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.shape({
      metaname: PropTypes.string,
      metavalue: PropTypes.string,
    })),
  }).isRequired,
};
// export component as default
export default PayWithFlutterwaveV2;
