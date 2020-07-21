import React from 'react';
import { Animated } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { FlutterwaveButtonPropsBase, RedirectParamsV2 } from '../FlutterwaveButton';
import { FlutterwaveInitOptions } from './FlutterwaveInit';
export declare type FlutterwaveButtonProps = FlutterwaveButtonPropsBase & {
    onComplete: (data: RedirectParamsV2) => void;
    options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
};
interface FlutterwaveButtonState {
    link: string | null;
    isPending: boolean;
    showDialog: boolean;
    animation: Animated.Value;
    txref: string | null;
    resetLink: boolean;
    buttonSize: {
        width: number;
        height: number;
    };
}
declare class FlutterwaveButton extends React.Component<FlutterwaveButtonProps, FlutterwaveButtonState> {
    static propTypes: {
        alignLeft: PropTypes.Requireable<boolean>;
        onAbort: PropTypes.Requireable<(...args: any[]) => any>;
        onComplete: PropTypes.Validator<(...args: any[]) => any>;
        onWillInitialize: PropTypes.Requireable<(...args: any[]) => any>;
        onDidInitialize: PropTypes.Requireable<(...args: any[]) => any>;
        onInitializeError: PropTypes.Requireable<(...args: any[]) => any>;
        options: PropTypes.Validator<PropTypes.InferProps<{
            payment_options: (props: {
                [k: string]: any;
            }, propName: string) => Error | null;
            txref: PropTypes.Validator<string>;
            PBFPubKey: PropTypes.Validator<string>;
            customer_firstname: PropTypes.Requireable<string>;
            customer_lastname: PropTypes.Requireable<string>;
            customer_email: PropTypes.Validator<string>;
            customer_phone: PropTypes.Requireable<string>;
            country: PropTypes.Requireable<string>;
            pay_button_text: PropTypes.Requireable<string>;
            custom_title: PropTypes.Requireable<string>;
            custom_description: PropTypes.Requireable<string>;
            custom_logo: PropTypes.Requireable<string>;
            meta: PropTypes.Requireable<(PropTypes.InferProps<{
                metaname: PropTypes.Requireable<string>;
                metavalue: PropTypes.Requireable<string>;
            }> | null | undefined)[]>;
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
        }>>;
        customButton: PropTypes.Requireable<(...args: any[]) => any>;
    };
    state: FlutterwaveButtonState;
    webviewRef: WebView | null;
    abortController?: AbortController;
    componentDidUpdate(prevProps: FlutterwaveButtonProps): void;
    componentWillUnmount(): void;
    reset: () => void;
    handleOptionsChanged: () => void;
    handleNavigationStateChange: (ev: WebViewNavigation) => void;
    handleComplete(data: RedirectParamsV2): void;
    handleReload: () => void;
    handleAbortConfirm: () => void;
    handleAbort: () => void;
    handleButtonResize: (size: {
        width: number;
        height: number;
    }) => void;
    getRedirectParams: (url: string) => RedirectParamsV2;
    show: () => void;
    dismiss: () => void;
    handleInit: () => void | null;
    render(): JSX.Element;
    renderButton(): {} | null | undefined;
    renderBackdrop(): JSX.Element;
    renderLoading(): JSX.Element;
    renderError: () => JSX.Element;
}
export default FlutterwaveButton;
//# sourceMappingURL=FlutterwaveButton.d.ts.map