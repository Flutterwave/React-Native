import React from 'react';
import PropTypes from 'prop-types';
import FlutterwaveInitError from './utils/FlutterwaveInitError';
import FlutterwaveCheckout from './FlutterwaveCheckout';
import FlutterwaveButton from './FlutterwaveButton';
import {REDIRECT_URL} from './configs';
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

export const PayWithFlutterwavePropTypesBase = {
  alignLeft: PropTypes.bool,
  onAbort: PropTypes.func,
  onRedirect: PropTypes.func.isRequired,
  onWillInitialize: PropTypes.func,
  onDidInitialize: PropTypes.func,
  onInitializeError: PropTypes.func,
  customButton: PropTypes.func,
};

export const OptionsPropTypeBase = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.oneOf([
    'AUD',
    'BIF',
    'CDF',
    'CAD',
    'CVE',
    'EUR',
    'GBP',
    'GHS',
    'GMD',
    'GNF',
    'KES',
    'LRD',
    'MWK',
    'MZN',
    'NGN',
    'RWF',
    'SLL',
    'STD',
    'TZS',
    'UGX',
    'USD',
    'XAF',
    'XOF',
    'ZAR',
    'ZMK',
    'ZMW',
    'ZWD'
  ]),
  payment_plan: PropTypes.number,
  subaccounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    transaction_split_ratio: PropTypes.number,
    transaction_charge_type: PropTypes.string,
    transaction_charge: PropTypes.number,
  })),
  integrity_hash: PropTypes.string,
};

interface PayWithFlutterwaveState {
  link: string | null;
  isPending: boolean;
  showDialog: boolean;
  reference: string | null;
  resetLink: boolean;
}

export type PayWithFlutterwaveBaseProps = PayWithFlutterwavePropsBase & {
  options: any;
  init: (options: any, abortController?: AbortController) => Promise<string>;
  reference: string;
};

class PayWithFlutterwaveBase<P = {}> extends React.Component<
  PayWithFlutterwaveBaseProps & P,
  PayWithFlutterwaveState
> {

  state: PayWithFlutterwaveState = {
    isPending: false,
    link: null,
    resetLink: false,
    showDialog: false,
    reference: null,
  };

  abortController?: AbortController;

  timeout: any;

  handleInitCall?: () => Promise<string>;

  componentDidUpdate(prevProps: PayWithFlutterwaveBaseProps) {
    const prevOptions = JSON.stringify(prevProps.options);
    const options = JSON.stringify(this.props.options);
    if (prevOptions !== options) {
      this.handleOptionsChanged()
    }
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  reset = () => {
    if (this.abortController) {
      this.abortController.abort();
    }
    // reset the necessaries
    this.setState(({resetLink, link}) => ({
      isPending: false,
      link: resetLink ? null : link,
      resetLink: false,
      showDialog: false,
    }));
  };

  handleOptionsChanged = () => {
    const {showDialog, link} = this.state;
    if (!link) {
      return;
    }
    if (!showDialog) {
      return this.setState({
        link: null,
        reference: null,
      })
    }
    this.setState({resetLink: true})
  }

  handleAbort = () => {
    const {onAbort} = this.props;
    if (onAbort) {
      onAbort();
    }
    this.reset();
  }

  handleRedirect = (params: any) => {
    const {onRedirect} = this.props;
    // reset payment link
    this.setState(
      ({resetLink, reference}) => ({
        reference: params.flwref || params.status === 'successful' ? null : reference,
        resetLink: params.flwref || params.status === 'successful' ? true : resetLink,
        showDialog: false,
      }),
      () => {
        onRedirect(params)
        this.reset();
      }
    );
  }

  handleInit = async () => {
    const {
      options,
      onWillInitialize,
      onInitializeError,
      onDidInitialize,
      init,
    } = this.props;
    const {isPending, reference, link} = this.state;
    // just show the dialod if the link is already set
    if (link) {
      return this.setState({showDialog: true});
    }
    // throw error if transaction reference has not changed
    if (reference === this.props.reference) {
      // fire oninitialize error handler if available
      if (onInitializeError) {
        onInitializeError(new FlutterwaveInitError({
          message: 'Please generate a new transaction reference.',
          code: 'SAME_TXREF',
        }))
      }
      return;
    }
    // stop if currently in pending mode
    if (isPending) {
      return;
    }
    // initialize abort controller if not set
    this.abortController = new AbortController;
    // fire will initialize handler if available
    if (onWillInitialize) {
      onWillInitialize();
    }
    this.setState({
      isPending: true,
      link: null,
      reference: this.props.reference,
      showDialog: false,
    }, async () => {
      // handle init
      try {
        // initialize payment
        const paymentLink = await init(
          {...options, redirect_url: REDIRECT_URL},
          this.abortController
        );
        // set payment link
        this.setState({
          link: paymentLink,
          isPending: false,
          showDialog: true,
        }, () => {
          // fire did initialize handler if available
          if (onDidInitialize) {
            onDidInitialize();
          }
        });
      } catch (error) {
        // stop if request was canceled
        if (error && /aborterror/i.test(error.code)) {
          return;
        }
        // call onInitializeError handler if an error occured
        if (onInitializeError) {
          onInitializeError(error);
        }
        // set payment link to reset
        this.setState({
          resetLink: true,
          reference: null,
        }, this.reset);
      }
    })
  };

  render() {
    const {link, showDialog} = this.state;
    return (
      <>
        {this.renderButton()}
        <FlutterwaveCheckout
          onAbort={this.handleAbort}
          onRedirect={this.handleRedirect}
          link={link || undefined}
          visible={showDialog}
        />
      </>
    );
  }

  renderButton() {
    const {alignLeft, customButton, children, style} = this.props;
    const {isPending} = this.state;
    if (customButton) {
      return customButton({
        disabled: isPending,
        onPress: this.handleInit
      });
    }
    return <FlutterwaveButton
      style={style}
      alignLeft={!!alignLeft}
      children={children}
      onPress={this.handleInit}
      disabled={isPending}
    />;
  }
}

export default PayWithFlutterwaveBase;
