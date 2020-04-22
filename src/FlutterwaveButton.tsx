import React from 'react';
import {StyleSheet, ViewStyle, Image} from 'react-native';
import PropTypes from 'prop-types';
import FlutterwaveInit, {FlutterwaveInitOptions, FlutterwaveInitError} from './FlutterwaveInit';
import {PaymentOptionsPropRule} from './utils/CustomPropTypesRules';
import DefaultButton from './DefaultButton';
const pryContent = require('./pry-button-content.png');
const altContent = require('./alt-button-content.png');
const contentWidthPercentage = 0.6549707602;
const contentSizeDimension = 8.2962962963;
const contentMaxWidth = 187.3;
const contentMaxHeight = contentMaxWidth / contentSizeDimension;
const contentMinWidth = 187.3;
const contentMinHeight = contentMinWidth / contentSizeDimension;

interface CustomButtonParams {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}

export interface FlutterwaveButtonProps {
  style?: ViewStyle;
  onWillInitialize?: () => void;
  onDidInitialize?: () => void;
  onError?: (error: FlutterwaveInitError) => void;
  options: FlutterwaveInitOptions;
  customButton?: (params: CustomButtonParams) => React.ReactNode;
  alt?: 'alt' | boolean;
  alignLeft?: 'alignLeft' | boolean;
}

interface FlutterwaveButtonState {
  link: string | null;
  isPending: boolean;
  buttonSize: {
    width: number;
    height: number;
  };
}

class FlutterwaveButton extends React.Component<
  FlutterwaveButtonProps,
  FlutterwaveButtonState
> {
  static propTypes = {
    alt: PropTypes.bool,
    alignLeft: PropTypes.bool,
    onWillInitialize: PropTypes.func,
    onDidInitialize: PropTypes.func,
    onError: PropTypes.func,
    options: PropTypes.shape({
      txref: PropTypes.string.isRequired,
      PBFPubKey: PropTypes.string.isRequired,
      customer_email: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      currency: PropTypes.oneOf(['NGN', 'USD']).isRequired,
      redirect_url: PropTypes.string.isRequired,
      payment_options: PaymentOptionsPropRule,
      payment_plan: PropTypes.number,
      subaccounts: PropTypes.arrayOf(PropTypes.number),
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
    customButton: PropTypes.func,
  };

  state: FlutterwaveButtonState = {
    isPending: false,
    link: null,
    buttonSize: {
      width: 0,
      height: 0,
    },
  };

  canceller?: AbortController;

  componentDidUpdate(prevProps: FlutterwaveButtonProps) {
    if (
      JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)
    ) {
      this.reset();
    }
  }

  componentWillUnmount() {
    if (this.canceller) {
      this.canceller.abort();
    }
  }

  reset = () => {
    if (this.canceller) {
      this.canceller.abort();
    }
    setTimeout(() => {
      this.setState({
        isPending: false,
        link: null,
      });
    }, 200);
  };

  handleButtonResize = (size: {width: number; height: number}) => {
    const {buttonSize} = this.state;
    if (JSON.stringify(buttonSize) !== JSON.stringify(size)) {
      this.setState({buttonSize: size});
    }
  };

  handleInit = () => {
    const {options, onWillInitialize, onError, onDidInitialize} = this.props;
    const {isPending} = this.state;

    // initialize abort controller if not set
    this.canceller = new AbortController;

    // stop if currently in pending mode
    if (isPending) {
      return;
    }

    // fire will initialize handler if available
    if (onWillInitialize) {
      onWillInitialize();
    }

    // set pending state to true
    this.setState(
      {
        isPending: true,
        link: null,
      },
      async () => {
        // make init request
        const result = await FlutterwaveInit(options, {canceller: this.canceller});
        // stop if request was cancelled
        if (result.error && /aborterror/i.test(result.error.code)) {
          return;
        }
        // call onError handler if an error occured
        if (!result.link) {
          if (onError && result.error) {
            onError(result.error);
          }
          return this.reset();
        }
        this.setState({link: result.link, isPending: false});
        // fire did initialize handler if available
        if (onDidInitialize) {
          onDidInitialize();
        }
      },
    );
  };

  render() {
    // render UI
    return (
      this.renderButton()
    );
  }

  renderButton() {
    const {customButton, style, alt, alignLeft} = this.props;
    const {isPending, link, buttonSize} = this.state;
    const contentWidth = buttonSize.width * contentWidthPercentage;
    const contentHeight = contentWidth / contentSizeDimension;
    const contentSizeStyle = {
      width:
        contentWidth > contentMaxWidth
          ? contentMaxWidth
          : contentWidth < contentMinWidth
          ? contentMinWidth
          : contentWidth,
      height:
        contentHeight > contentMaxHeight
          ? contentMaxHeight
          : contentHeight < contentMinHeight
          ? contentMinHeight
          : contentHeight,
    };
    // render custom button
    if (customButton) {
      return customButton({
        isInitializing: isPending && !link ? true : false,
        disabled: isPending || link ? true : false,
        onPress: this.handleInit,
      });
    }
    // render primary button
    return (
      <DefaultButton
        alt={alt}
        alignLeft={alignLeft}
        style={style}
        isBusy={isPending && !link}
        disabled={isPending || link ? true : false}
        onPress={this.handleInit}
        onSizeChange={this.handleButtonResize}>
        <Image
          source={alt ? altContent : pryContent}
          resizeMode="contain"
          resizeMethod="resize"
          style={[styles.buttonContent, contentSizeStyle]}
          fadeDuration={0}
        />
      </DefaultButton>
    );
  }
}

const styles = StyleSheet.create({
  buttonContent: {
    resizeMode: 'contain',
  },
});

export default FlutterwaveButton;
