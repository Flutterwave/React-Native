import React from 'react';
import { Animated } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { FlutterwaveButtonPropsBase, RedirectParams } from '../FlutterwaveButton';
import { FlutterwaveInitOptions } from './FlutterwaveInit';
export declare type FlutterwaveButtonProps = FlutterwaveButtonPropsBase & {
    onComplete: (data: RedirectParams) => void;
    options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
};
interface FlutterwaveButtonState {
    link: string | null;
    isPending: boolean;
    showDialog: boolean;
    animation: Animated.Value;
    tx_ref: string | null;
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
            authorization: PropTypes.Validator<string>;
            tx_ref: PropTypes.Validator<string>;
            payment_options: (props: {
                [k: string]: any;
            }, propName: string) => Error | null;
            customer: PropTypes.Validator<PropTypes.InferProps<{
                name: PropTypes.Requireable<string>;
                phonenumber: PropTypes.Requireable<string>;
                email: PropTypes.Validator<string>;
            }>>;
            meta: PropTypes.Requireable<(object | null | undefined)[]>;
            customizations: PropTypes.Requireable<PropTypes.InferProps<{
                title: PropTypes.Requireable<string>;
                logo: PropTypes.Requireable<string>;
                description: PropTypes.Requireable<string>;
            }>>;
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
    handleComplete(data: RedirectParams): void;
    handleReload: () => void;
    handleAbortConfirm: () => void;
    handleAbort: () => void;
    handleButtonResize: (size: {
        width: number;
        height: number;
    }) => void;
    getRedirectParams: (url: string) => RedirectParams;
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