import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  Text,
  ViewStyle,
  Alert,
  Image,
  Platform,
  Dimensions,
  Easing,
} from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import {WebViewNavigation} from 'react-native-webview/lib/WebViewTypes';
import FlutterwaveInit, {
  FlutterwaveInitOptions,
  FlutterwaveInitError,
} from './FlutterwaveInit';
import {colors} from './configs';
import {PaymentOptionsPropRule} from './utils/CustomPropTypesRules';
import DefaultButton from './DefaultButton';
const loader = require('./loader.gif');
const pryContent = require('./pry-button-content.png');
const contentWidthPercentage = 0.6549707602;
const contentSizeDimension = 8.2962962963;
const contentMaxWidth = 187.3;
const contentMaxHeight = contentMaxWidth / contentSizeDimension;
const contentMinWidth = 187.3;
const contentMinHeight = contentMinWidth / contentSizeDimension;
const borderRadiusDimension = 24 / 896;
const windowHeight = Dimensions.get('window').height;

interface CustomButtonProps {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}

interface OnCompleteData {
  cancelled: boolean;
  flwref?: string;
  txref: string;
}

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
  customButton?: (params: CustomButtonProps) => React.ReactNode;
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

class FlutterwaveButton extends React.Component<
  FlutterwaveButtonProps,
  FlutterwaveButtonState
> {
  static propTypes = {
    alt: PropTypes.bool,
    alignLeft: PropTypes.bool,
    onAbort: PropTypes.func,
    onComplete: PropTypes.func.isRequired,
    onWillInitialize: PropTypes.func,
    onDidInitialize: PropTypes.func,
    onInitializeError: PropTypes.func,
    options: PropTypes.shape({
      txref: PropTypes.string.isRequired,
      PBFPubKey: PropTypes.string.isRequired,
      customer_email: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      currency: PropTypes.oneOf(['NGN', 'USD', 'GHS', 'KES', 'ZAR', 'TZS']),
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
    showDialog: false,
    animation: new Animated.Value(0),
    txref: null,
    buttonSize: {
      width: 0,
      height: 0,
    },
  };

  webviewRef: WebView | null = null;

  canceller?: AbortController;

  componentWillUnmount() {
    if (this.canceller) {
      this.canceller.abort();
    }
  }

  reset = () => {
    if (this.canceller) {
      this.canceller.abort();
    }
    // reset the necessaries
    this.setState({
      isPending: false,
      link: null,
      showDialog: false,
    });
  };

  handleNavigationStateChange = (ev: WebViewNavigation) => {
    // cregex to check if redirect has occured on completion/cancel
    const rx = /\/hosted\/pay\/undefined|\/api\/hosted_pay\/undefined/;
    // Don't end payment if not redirected back
    if (!rx.test(ev.url)) {
      return
    }
    // fire handle complete
    this.handleComplete(this.getRedirectParams(ev.url));
  };

  handleComplete(data: any) {
    const {onComplete} = this.props;
    // reset payment link
    this.setState({txref: null},
      () => {
        // reset
        this.dismiss();
        // fire onComplete handler
        onComplete({
          flwref: data.flwref,
          txref: data.txref,
          cancelled: /true/i.test(data.cancelled || '') ? true : false
        });
      }
    );
  }

  handleReload = () => {
    // fire if webview is set
    if (this.webviewRef) {
      this.webviewRef.reload();
    }
  };

  handleAbortConfirm = () => {
    const {onAbort} = this.props;
    // abort action
    if (onAbort) {
      onAbort();
    }
    // remove txref and dismiss
    this.setState({txref: null}, this.dismiss);
  };

  handleAbort = () => {
    Alert.alert('', 'Are you sure you want to cancel this payment?', [
      {text: 'No'},
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: this.handleAbortConfirm,
      },
    ]);
  };

  handleButtonResize = (size: {width: number; height: number}) => {
    const {buttonSize} = this.state;
    if (JSON.stringify(buttonSize) !== JSON.stringify(size)) {
      this.setState({buttonSize: size});
    }
  };

  getRedirectParams = (url: string): RedirectParams => {
    // initialize result container
    const res: any = {};
    // if url has params
    if (url.split('?').length > 1) {
      // get query params in an array
      const params = url.split('?')[1].split('&');
      // add url params to result
      for (let i = 0; i < params.length; i++) {
        const param: Array<string> = params[i].split('=');
        const val = decodeURIComponent(param[1]).trim();
        res[param[0]] = String(val);
      }
    }
    // return result
    return res;
  };

  show = () => {
    const {animation} = this.state;
    this.setState({showDialog: true}, () => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 700,
        easing: Easing.in(Easing.elastic(0.72)),
        useNativeDriver: false,
      }).start();
    });
  };

  dismiss = () => {
    const {animation} = this.state;
    Animated.timing(animation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(this.reset);
  };

  handleInit = () => {
    const {options, onWillInitialize, onInitializeError, onDidInitialize} = this.props;
    const {isPending, txref} = this.state;

    // throw error if transaction reference has not changed
    if (txref === options.txref) {
      return onInitializeError ? onInitializeError({
        message: 'Please generate a new transaction reference.',
        code: 'SAME_TXREF',
      }) : null;
    }

    // stop if currently in pending mode
    if (isPending) {
      return;
    }

    // initialize abort controller if not set
    this.canceller = new AbortController;

    // fire will initialize handler if available
    if (onWillInitialize) {
      onWillInitialize();
    }

    // @ts-ignore
    // delete redirect url if set
    delete options.redirect_url;

    // set pending state to true
    this.setState(
      {
        isPending: true,
        link: null,
        txref: options.txref,
      },
      async () => {
        // make init request
        const result = await FlutterwaveInit(options, {canceller: this.canceller});
        // stop if request was cancelled
        if (result.error && /aborterror/i.test(result.error.code)) {
          return;
        }
        // call onInitializeError handler if an error occured
        if (!result.link) {
          if (onInitializeError && result.error) {
            onInitializeError(result.error);
          }
          return this.dismiss();
        }
        this.setState({link: result.link, isPending: false}, this.show);
        // fire did initialize handler if available
        if (onDidInitialize) {
          onDidInitialize();
        }
      },
    );
  };

  render() {
    const {link, animation, showDialog} = this.state;
    const marginTop = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [windowHeight, Platform.OS === 'ios' ? 46 : 14],
    });
    const opacity = animation.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 1, 1],
    });
    // render UI
    return (
      <>
        {this.renderButton()}
        <Modal
          transparent={true}
          animated={false}
          hardwareAccelerated={false}
          visible={showDialog}>
          {this.renderBackdrop()}
          <Animated.View style={[styles.webviewContainer, {marginTop, opacity}]}>
            <WebView
              ref={(ref) => (this.webviewRef = ref)}
              source={{uri: link || ''}}
              style={styles.webview}
              startInLoadingState={true}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              onNavigationStateChange={this.handleNavigationStateChange}
              renderError={this.renderError}
              renderLoading={this.renderLoading}
            />
          </Animated.View>
        </Modal>
      </>
    );
  }

  renderButton() {
    const {customButton, style, alignLeft} = this.props;
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
        alignLeft={alignLeft}
        style={style}
        isBusy={isPending && !link}
        disabled={isPending || link ? true : false}
        onPress={this.handleInit}
        onSizeChange={this.handleButtonResize}>
        <Image
          source={pryContent}
          resizeMode="contain"
          resizeMethod="resize"
          style={[styles.buttonContent, contentSizeStyle]}
          fadeDuration={0}
        />
      </DefaultButton>
    );
  }

  renderBackdrop() {
    const {animation} = this.state;
    // Interpolation backdrop animation
    const backgroundColor = animation.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [colors.transparent, colors.transparent, 'rgba(0,0,0,0.5)'],
    });
    return (
      <TouchableWithoutFeedback testID='flw-backdrop' onPress={this.handleAbort}>
        <Animated.View style={Object.assign({}, styles.backdrop, {backgroundColor})} />
      </TouchableWithoutFeedback>
    );
  }

  renderLoading() {
    return (
      <View style={styles.loading}>
        <Image
          source={loader}
          resizeMode="contain"
          style={styles.loadingImage}
        />
      </View>
    );
  }

  renderError = () => {
    const {link} = this.state;
    return (
      <View style={styles.prompt}>
        {link ? (
          <>
            <Text style={styles.promptQuestion}>
              The page failed to load, please try again.
            </Text>
            <View>
              <TouchableWithoutFeedback onPress={this.handleReload}>
                <Text style={styles.promptActionText}>Try Again</Text>
              </TouchableWithoutFeedback>
            </View>
          </>
        ) : null}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  promtActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptActionText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  promptQuestion: {
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 18,
  },
  prompt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 56,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  loadingImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    top: 50,
    flex: 1,
    backgroundColor: '#efefef',
    paddingBottom: 50,
    overflow: 'hidden',
    borderTopLeftRadius: windowHeight * borderRadiusDimension,
    borderTopRightRadius: windowHeight * borderRadiusDimension,
  },
  webview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonContent: {
    resizeMode: 'contain',
  },
});

export default FlutterwaveButton;
