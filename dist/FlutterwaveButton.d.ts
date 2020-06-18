import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { FlutterwaveInitOptions, FlutterwaveInitError } from './FlutterwaveInit';
interface CustomButtonParams {
    disabled: boolean;
    isInitializing: boolean;
    onPress: () => void;
}
declare type OnCompleteData = {
    cancelled: boolean;
    flwref?: string;
    txref: string;
};
interface RedirectParams {
    cancelled: 'true' | 'false';
    flwref?: string;
    txref?: string;
    response?: string;
}
export interface FlutterwaveButtonProps {
    style?: ViewStyle;
    onComplete: (data: OnCompleteData) => void;
    onWillInitialize?: () => void;
    onDidInitialize?: () => void;
    onInitializeError?: (error: FlutterwaveInitError) => void;
    onAbort?: () => void;
    options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
    customButton?: (params: CustomButtonParams) => React.ReactNode;
    alt?: 'alt' | boolean;
    alignLeft?: 'alignLeft' | boolean;
}
interface FlutterwaveButtonState {
    link: string | null;
    isPending: boolean;
    showDialog: boolean;
    animation: Animated.Value;
    txref: string | null;
    buttonSize: {
        width: number;
        height: number;
    };
}
declare class FlutterwaveButton extends React.Component<FlutterwaveButtonProps, FlutterwaveButtonState> {
    static propTypes: {
        alt: PropTypes.Requireable<boolean>;
        alignLeft: PropTypes.Requireable<boolean>;
        onAbort: PropTypes.Requireable<(...args: any[]) => any>;
        onComplete: PropTypes.Validator<(...args: any[]) => any>;
        onWillInitialize: PropTypes.Requireable<(...args: any[]) => any>;
        onDidInitialize: PropTypes.Requireable<(...args: any[]) => any>;
        onInitializeError: PropTypes.Requireable<(...args: any[]) => any>;
        options: PropTypes.Validator<PropTypes.InferProps<{
            txref: PropTypes.Validator<string>;
            PBFPubKey: PropTypes.Validator<string>;
            customer_email: PropTypes.Validator<string>;
            amount: PropTypes.Validator<number>;
            currency: PropTypes.Validator<string>;
            payment_options: (props: {
                [k: string]: any;
            }, propName: string) => Error | null;
            payment_plan: PropTypes.Requireable<number>;
            subaccounts: PropTypes.Requireable<(number | null | undefined)[]>;
            country: PropTypes.Requireable<string>;
            pay_button_text: PropTypes.Requireable<string>;
            custom_title: PropTypes.Requireable<string>;
            custom_description: PropTypes.Requireable<string>;
            custom_logo: PropTypes.Requireable<string>;
            meta: PropTypes.Requireable<(PropTypes.InferProps<{
                metaname: PropTypes.Requireable<string>;
                metavalue: PropTypes.Requireable<string>;
            }> | null | undefined)[]>;
        }>>;
        customButton: PropTypes.Requireable<(...args: any[]) => any>;
    };
    state: FlutterwaveButtonState;
    webviewRef: WebView | null;
    canceller?: AbortController;
    componentWillUnmount(): void;
    reset: () => void;
    handleNavigationStateChange: (ev: WebViewNavigation) => void;
    handleComplete(data: any): void;
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