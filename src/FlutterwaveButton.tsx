import {ViewStyle, StyleProp} from 'react-native';
import PropTypes from 'prop-types';
import FlutterwaveButton from './v3/FlutterwaveButton';
import FlutterwaveInitError from './utils/FlutterwaveInitError';

export interface RedirectParams {
  status: 'successful' | 'cancelled',
  transaction_id?: string;
  tx_ref: string;
}

export interface RedirectParamsV2 {
  cancelled?: 'true' | 'false';
  flwref?: string;
  txref: string;
}

export interface CustomButtonProps {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}

export interface FlutterwaveButtonPropsBase {
  style?: StyleProp<ViewStyle>;
  onComplete: (data: any) => void;
  onWillInitialize?: () => void;
  onDidInitialize?: () => void;
  onInitializeError?: (error: FlutterwaveInitError) => void;
  onAbort?: () => void;
  customButton?: (params: CustomButtonProps) => React.ReactNode;
  alignLeft?: 'alignLeft' | boolean;
}

export const OptionsPropTypeBase = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.oneOf(['GBP', 'NGN', 'USD', 'GHS', 'KES', 'ZAR', 'TZS']),
  payment_plan: PropTypes.number,
  subaccounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    transaction_split_ratio: PropTypes.number,
    transaction_charge_type: PropTypes.string,
    transaction_charge: PropTypes.number,
  })),
  integrity_hash: PropTypes.string,
};

export default FlutterwaveButton;
