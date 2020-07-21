/// <reference types="react" />
import { ViewStyle, StyleProp } from 'react-native';
import PropTypes from 'prop-types';
import FlutterwaveButton from './v3/FlutterwaveButton';
import FlutterwaveInitError from './utils/FlutterwaveInitError';
export interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
}
export interface RedirectParamsV2 {
    cancelled?: 'true' | 'false';
    flwref?: string;
    txref?: string;
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
export declare const OptionsPropTypeBase: {
    amount: PropTypes.Validator<number>;
    currency: PropTypes.Requireable<string>;
    payment_plan: PropTypes.Requireable<number>;
    subaccounts: PropTypes.Requireable<(PropTypes.InferProps<{
        id: PropTypes.Validator<string>;
        transaction_split_ratio: PropTypes.Requireable<number>;
        transaction_charge_type: PropTypes.Requireable<string>;
        transaction_charge: PropTypes.Requireable<number>;
    }> | null | undefined)[]>;
    integrity_hash: PropTypes.Requireable<string>;
};
export default FlutterwaveButton;
//# sourceMappingURL=FlutterwaveButton.d.ts.map