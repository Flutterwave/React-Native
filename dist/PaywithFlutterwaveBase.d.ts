import React from 'react';
import PropTypes from 'prop-types';
import FlutterwaveInitError from './utils/FlutterwaveInitError';
import { StyleProp, ViewStyle } from 'react-native';
export interface CustomButtonProps {
    disabled: boolean;
    onPress: () => void;
}
export interface PayWithFlutterwavePropsBase {
    style?: StyleProp<ViewStyle>;
    onRedirect: (data: any) => void;
    onWillInitialize?: () => void;
    onDidInitialize?: () => void;
    onInitializeError?: (error: FlutterwaveInitError) => void;
    onAbort?: () => void;
    customButton?: (params: CustomButtonProps) => React.ReactNode;
    alignLeft?: 'alignLeft' | boolean;
    meta?: Array<any>;
    currency?: string;
}
export declare const PayWithFlutterwavePropTypesBase: {
    alignLeft: PropTypes.Requireable<boolean>;
    onAbort: PropTypes.Requireable<(...args: any[]) => any>;
    onRedirect: PropTypes.Validator<(...args: any[]) => any>;
    onWillInitialize: PropTypes.Requireable<(...args: any[]) => any>;
    onDidInitialize: PropTypes.Requireable<(...args: any[]) => any>;
    onInitializeError: PropTypes.Requireable<(...args: any[]) => any>;
    customButton: PropTypes.Requireable<(...args: any[]) => any>;
};
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
interface PayWithFlutterwaveState {
    link: string | null;
    isPending: boolean;
    showDialog: boolean;
    reference: string | null;
    resetLink: boolean;
}
export declare type PayWithFlutterwaveBaseProps = PayWithFlutterwavePropsBase & {
    options: any;
    init: (options: any, abortController?: AbortController) => Promise<string>;
    reference: string;
};
declare class PayWithFlutterwaveBase<P = {}> extends React.Component<PayWithFlutterwaveBaseProps & P, PayWithFlutterwaveState> {
    state: PayWithFlutterwaveState;
    abortController?: AbortController;
    timeout: any;
    handleInitCall?: () => Promise<string>;
    componentDidUpdate(prevProps: PayWithFlutterwaveBaseProps): void;
    componentWillUnmount(): void;
    reset: () => void;
    handleOptionsChanged: () => void;
    handleAbort: () => void;
    handleRedirect: (params: any) => void;
    handleInit: () => Promise<void>;
    render(): JSX.Element;
    renderButton(): {} | null | undefined;
}
export default PayWithFlutterwaveBase;
//# sourceMappingURL=PaywithFlutterwaveBase.d.ts.map