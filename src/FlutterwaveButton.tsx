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
const altContent = require('./alt-button-content.png');
const contentWidthPercentage = 0.6549707602;
const contentSizeDimension = 8.2962962963;
const contentMaxWidth = 187.3;
const contentMaxHeight = contentMaxWidth / contentSizeDimension;
const contentMinWidth = 187.3;
const contentMinHeight = contentMinWidth / contentSizeDimension;
const borderRadiusDimension = 24 / 896;
const windowHeight = Dimensions.get('window').height;

interface CustomButtonParams {
  disabled: boolean;
  isInitializing: boolean;
  onPress: () => void;
}

type OnCompleteData = {
  cancelled?: string;
  flwref?: string;
  txref?: string;
  response?: string;
  [k: string]: string | undefined;
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
  onError?: (error: FlutterwaveInitError) => void;
  onAbort?: () => void;
  options: FlutterwaveInitOptions;
  customButton?: (params: CustomButtonParams) => React.ReactNode;
  alt?: 'alt' | boolean;
  alignLeft?: 'alignLeft' | boolean;
}

interface FlutterwaveButtonState {
  link: string | null;
  isPending: boolean;
  backdropAnimation: Animated.Value;
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
    backdropAnimation: new Animated.Value(0),
    buttonSize: {
      width: 0,
      height: 0,
    },
  };

  webviewRef: WebView | null = null;

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

  handleNavigationStateChange = (ev: WebViewNavigation) => {
    const {options} = this.props;
    // check if has redirected to page
    const {redirect_url} = options;
    const rx = new RegExp(redirect_url);
    // Don't end payment if not redirected back
    if (!rx.test(ev.url)) {
      return
    }
    // fire handle complete
    this.handleComplete(this.getRedirectParams(ev.url));
  };

  handleComplete(response: any) {
    const {onComplete} = this.props;
    // reset payment link
    this.setState(
      {link: null},
      () => {
        // reset
        this.reset();
        // copy response
        const data = {...response};
        // format response if available
        if (data.response) {
          data.response = JSON.parse(data.response);
        }
        // format canclled if available
        if (typeof data.cancelled === 'string') {
          data.cancelled = /true|yes/i.test(data.cancelled)
        }
        // fire onComplete handler
        onComplete(data);
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
    // remove link
    this.reset();
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

  animateBackdrop = (amount: number) => {
    const {backdropAnimation} = this.state;
    Animated.timing(backdropAnimation, {
      toValue: amount,
      duration: 400,
      useNativeDriver: false,
    }).start();
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
    const {link} = this.state;
    // render UI
    return (
      <>
        {this.renderButton()}
        <Modal
          transparent={true}
          animated
          animationType="slide"
          onDismiss={() => this.animateBackdrop(0)}
          hardwareAccelerated={false}
          visible={link ? true : false}
          onShow={() => this.animateBackdrop(1)}>
          <View style={styles.modalContent}>
            {this.renderBackdrop()}
            <View style={styles.webviewContainer}>
              {this.renderLoading()}
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
            </View>
          </View>
        </Modal>
      </>
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

  renderBackdrop() {
    const {backdropAnimation} = this.state;
    // Interpolation backdrop animation
    const backgroundColor = backdropAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.transparent, 'rgba(0,0,0,0.3)'],
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
    return (
      <View style={styles.prompt}>
        <Text style={styles.promptQuestion}>
          The page failed to load, please try again.
        </Text>
        <View>
          <TouchableWithoutFeedback onPress={this.handleReload}>
            <Text style={styles.promptActionText}>Try Again</Text>
          </TouchableWithoutFeedback>
        </View>
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
  modalContent: {
    flex: 1,
    backgroundColor: colors.transparent,
    paddingTop: Platform.select({ios: 96, android: 64}),
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#efefef',
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
