import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  Text,
  Alert,
  Image,
  Dimensions,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import {WebViewNavigation} from 'react-native-webview/lib/WebViewTypes';
import {colors} from './configs';
const loader = require('./assets/loader.gif');
const borderRadiusDimension = 24 / 896;
const windowHeight = Dimensions.get('window').height;

export interface FlwCheckoutProps {
  onRedirect?: (data: any) => void;
  onAbort?: () => void;
  link?: string;
  visible?: boolean;
}

interface FlwCheckoutBackdropProps {
  animation: Animated.Value,
  onPress?: () => void;
}

interface FlwCheckoutErrorProps {
  hasLink: boolean;
  onTryAgain: () => void;
}

const getRedirectParams = (url: string): {[k: string]: string} => {
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

const FlwCheckout: React.FC<FlwCheckoutProps> = function FlwCheckout(props) {
  const {link, visible, onRedirect, onAbort} = props;
  const [show, setShow] = React.useState<boolean>(false);
  const webviewRef = React.useRef<WebView | null>(null);
  const animation = React.useRef<Animated.Value>(new Animated.Value(0));

  const animateIn = React.useCallback(() => {
    setShow(true);
    Animated.timing(animation.current, {
      toValue: 1,
      duration: 700,
      easing: Easing.in(Easing.elastic(0.72)),
      useNativeDriver: false,
    }).start();
  }, []);

  const animateOut = React.useCallback(() => {
    return new Promise(resolve => {
      Animated.timing(animation.current, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        setShow(false);
        resolve();
      });
    })
  }, []);

  const handleReload = React.useCallback(() => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  }, []);

  const handleAbort = React.useCallback((confirmed: boolean = false) => {
    if (!confirmed) {
      Alert.alert('', 'Are you sure you want to cancel this payment?', [
        {text: 'No'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => handleAbort(true),
        },
      ]);
      return;
    }
    // remove tx_ref and dismiss
    animateOut().then(onAbort);
  }, [onAbort, animateOut]);

  const handleNavigationStateChange = React.useCallback((ev: WebViewNavigation) => {
    // cregex to check if redirect has occured on completion/cancel
    const rx = /\/flutterwave\.com\/rn-redirect/;
    // Don't end payment if not redirected back
    if (!rx.test(ev.url)) {
      return
    }
    // dismiss modal
    animateOut().then(() => {
      if (onRedirect) {
        onRedirect(getRedirectParams(ev.url))
      }
    });
  }, [onRedirect]);

  const doAnimate = React.useCallback(() => {
    if (visible === show) {
      return;
    }
    if (visible) {
      return animateIn();
    }
    animateOut().then(() => {});
  }, [visible, show, animateOut, animateIn]);

  React.useEffect(() => {
    doAnimate();
    return () => {};
  }, [doAnimate]);

  const marginTop = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0],
  });
  const opacity = animation.current.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Modal
      transparent={true}
      animated={false}
      hardwareAccelerated={false}
      visible={show}>
      <FlwCheckoutBackdrop onPress={() => handleAbort()} animation={animation.current} />
      <Animated.View
        style={[
          styles.webviewContainer,
          {
            marginTop,
            opacity
          }
        ]}
        testID='flw-checkout-dialog'
      >
        <WebView
          ref={webviewRef}
          source={{uri: link || ''}}
          style={styles.webview}
          startInLoadingState={true}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}
          renderError={() => <FlwCheckoutError hasLink={!!link} onTryAgain={handleReload} />}
          renderLoading={() => <FlwCheckoutLoader />}
        />
      </Animated.View>
    </Modal>
  )
}

const FlwCheckoutBackdrop: React.FC<
  FlwCheckoutBackdropProps
> = function FlwCheckoutBackdrop({
  animation,
  onPress
}) {
  // Interpolation backdrop animation
  const backgroundColor = animation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [colors.transparent, colors.transparent, 'rgba(0,0,0,0.5)'],
  });
  return (
    <TouchableWithoutFeedback testID='flw-checkout-backdrop' onPress={onPress}>
      <Animated.View style={Object.assign({}, styles.backdrop, {backgroundColor})} />
    </TouchableWithoutFeedback>
  );
}

export const FlwCheckoutError: React.FC<FlwCheckoutErrorProps> = ({
  hasLink,
  onTryAgain
}): React.ReactElement => {
  return (
    <View style={styles.error} testID="flw-checkout-error">
      {hasLink ? (
        <>
          <Text style={styles.errorText}>
            An error occurred, please tab below to try again.
          </Text>
          <TouchableOpacity style={styles.errorActionButton} onPress={onTryAgain}>
            <Text style={styles.errorActionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>
          An error occurred, please close the checkout dialog and try again.
        </Text>
      )}
    </View>
  );
}

const FlwCheckoutLoader: React.FC<{}> = (): React.ReactElement => {
  return (
    <View style={styles.loading} testID="flw-checkout-loader">
      <Image
        source={loader}
        resizeMode="contain"
        style={styles.loadingImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorActionButtonText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
  },
  errorActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorText: {
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 18,
  },
  error: {
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
    top: Platform.select({ios: 96, android: 64}), // status bar height aware for ios
    flex: 1,
    backgroundColor: '#efefef',
    paddingBottom: Platform.select({ios: 96, android: 64}), // status bar height aware for ios
    overflow: 'hidden',
    borderTopLeftRadius: windowHeight * borderRadiusDimension,
    borderTopRightRadius: windowHeight * borderRadiusDimension,
  },
  webview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

export default FlwCheckout;
