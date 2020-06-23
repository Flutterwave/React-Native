import 'react-native';
import React from 'react';
import {TouchableWithoutFeedback, Text, Alert} from 'react-native';
import renderer from 'react-test-renderer';
import FlutterwaveButton from '../src/FlutterwaveButton';
import {FlutterwaveInitOptions} from '../src/FlutterwaveInit';
import {STANDARD_URL} from '../src/configs';
import WebView from 'react-native-webview';
import DefaultButton from '../src/DefaultButton';
const BtnTestID = 'flw-default-button';
const SuccessResponse = {
  status: 'success',
  message: 'Payment link generated.',
  data: {
    link: 'http://payment-link.com/checkout',
  },
};
const PaymentOptions: Omit<FlutterwaveInitOptions, 'redirect_url'> = {
  txref: '34h093h09h034034',
  customer_email: 'customer-email@example.com',
  PBFPubKey: '[Public Key]',
  amount: 50,
  currency: 'NGN',
};

describe('<FlutterwaveButton />', () => {
  it('renders component correctly', () => {
    const Renderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    expect(Renderer.toJSON()).toMatchSnapshot();
  });
  
  it('renders busy button if isPending', () => {
    // get create instance of flutterwave button
    const Renderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    Renderer.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    expect(Renderer.toJSON()).toMatchSnapshot();
  });

  it('renders modal with visibile property as true if show dialog state is true', (done) => {
    // get create instance of flutterwave button
    const Renderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    Renderer.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    setTimeout(() => {
      expect(Renderer.toJSON()).toMatchSnapshot();
      done();
    }, 50);
  });

  it('renders custom button correctly', () => {
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      customButton={({
        disabled,
        isInitializing,
        onPress
      }) => {
        return (
          <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
            {isInitializing ? (<Text>Please wait...</Text>) : (<Text>Pay</Text>)}
          </TouchableWithoutFeedback>
        );
      }}
    />);
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('renders webview loading correctly', () => {
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    // get webview
    const webView = TestRenderer.root.findByType(WebView);
    // create loading renderer
    const LoadingRenderer = renderer.create(webView.props.renderLoading());
    // checks
    expect(LoadingRenderer).toMatchSnapshot();
  });

  it('renders webview error correctly', () => {
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    // get webview
    const webView = TestRenderer.root.findByType(WebView);
    // create error renderer
    const ErrorRenderer = renderer.create(webView.props.renderError());
    // checks
    expect(ErrorRenderer).toMatchSnapshot();
  });

  it('disables custom button and set is initializing to true when initializing payment', () => {
    const customButton = jest.fn();
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      customButton={customButton}
    />);
    TestRenderer.root.instance.handleInit();
    expect(customButton).toHaveBeenCalledTimes(2);
    expect(customButton).toHaveBeenLastCalledWith({
      disabled: true,
      isInitializing: true,
      onPress: expect.any(Function),
    });
  });

  it('disables custom button and set is initializing to false after initializing payment', (done) => {
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    const customButton = jest.fn();
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      customButton={customButton}
    />);
    TestRenderer.root.instance.handleInit();
    setTimeout(() => {
      expect(customButton).toHaveBeenCalledTimes(4);
      expect(customButton).toHaveBeenLastCalledWith({
        disabled: true,
        isInitializing: false,
        onPress: expect.any(Function),
      });
      done();
    }, 50);
  });

  it('asks user to confirm abort when pressed backdrop', () => {
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    // get backdrop
    const Backdrop = TestRenderer.root.findByProps({testID: 'flw-backdrop'});
    // simulate backdrop onPress
    Backdrop.props.onPress();
    // checks
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('cancel this payment'),
      expect.any(Array),
    );
  });

  it('calls onAbort if available and abort event occurred', () => {
    const onAbort = jest.fn();
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      onAbort={onAbort}
    />);
    // fire handle abort confirm
    FlwButton.root.instance.handleAbortConfirm();
    // called on abort
    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  it('does not call onAbort if not available and abort event occurred', () => {
    const onAbort = jest.fn();
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    // fire handle abort confirm
    FlwButton.root.instance.handleAbortConfirm();
    // called on abort
    expect(onAbort).toHaveBeenCalledTimes(0);
  });

  it('does not make standard api call if in pending state', () => {
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);

    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();

    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();

    // ensure the button is disabled after beign pressed
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('makes call to standard endpoint when button is pressed', async () => {
    const Renderer = renderer.create(<FlutterwaveButton
    onComplete={jest.fn()}
    options={PaymentOptions}
    />);
    const Button = Renderer.root.findByProps({testID: BtnTestID});
    const c = new AbortController;
    const headers = new Headers
      
    headers.append('Content-Type', 'application/json');
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    Button.props.onPress();

    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
      body: JSON.stringify(PaymentOptions),
      headers: headers,
      method: 'POST',
      signal: c.signal,
    });
  });

  it("updates button size when current and new size don't match", () => {
    // on layout event
    const onSizeChangeEv = {
      width: 100,
      height: 100
    };

    // create test renderer
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);

    // spy on component methods
    const setState = jest.spyOn(TestRenderer.root.instance, 'setState');
    const handleButtonResize = jest.spyOn(TestRenderer.root.instance, 'handleButtonResize');

    // get default button
    const Button = TestRenderer.root.findByProps({testID: BtnTestID});

    // fire on size change on button
    Button.props.onLayout({nativeEvent: {layout: onSizeChangeEv}});
    Button.props.onLayout({nativeEvent: {layout: onSizeChangeEv}});
    
    // handle button resize checks
    expect(handleButtonResize).toHaveBeenCalledTimes(1);
    expect(handleButtonResize).toHaveBeenLastCalledWith(onSizeChangeEv);

    // set state checks
    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith({buttonSize: onSizeChangeEv})
  });

  it('initialized without a redirect url', () => {
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    const abortController = new AbortController
    // default fetch header
    const FetchHeader = new Headers();
    FetchHeader.append('Content-Type', 'application/json');
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
     // expect fetch to have been called
     expect(global.fetch).toHaveBeenCalledTimes(1);
     expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
       body: JSON.stringify({...PaymentOptions, redirect_url: undefined}),
       headers: FetchHeader,
       method: 'POST',
       signal: abortController.signal
     });
  });

  it('fires onDidInitialize if available', (done) => {
    const onDidInitialize = jest.fn();
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      onDidInitialize={onDidInitialize}
    />);
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    // wait for request to be made
    setTimeout(() => {
      expect(onDidInitialize).toHaveBeenCalledTimes(1);
      // end test
      done();
    }, 50);
  });

  it('fires onWillInitialize if available', (done) => {
    const onWillInitialize = jest.fn();
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      onWillInitialize={onWillInitialize}
    />);
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    // wait for request to be made
    setTimeout(() => {
      expect(onWillInitialize).toHaveBeenCalledTimes(1);
      // end test
      done();
    }, 50);
  });

  it('fires OnInitializeError if available', (done) => {
    const err = new Error('Error occurred.');
    const OnInitializeError = jest.fn();
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
      OnInitializeError={OnInitializeError}
    />);
    // mock next fetch request
    fetchMock.mockRejectOnce(err);
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    // wait for request to be made
    setTimeout(() => {
      expect(OnInitializeError).toHaveBeenCalledTimes(1);
      expect(OnInitializeError).toHaveBeenCalledWith({
        code: err.name.toUpperCase(),
        message: err.message
      });
      // end test
      done();
    }, 50);
  });

  it('does not update state if init is aborted', (done) => {
    // get create instance of flutterwave button
    const FlwButton = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    // spy on set state
    const setState = jest.spyOn(FlwButton.root.instance, 'setState');
    // mock next fetch request
    fetchMock.mockAbortOnce();
    // fire on press
    FlwButton.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
    // wait for request to be made
    setTimeout(() => {
      expect(setState).toHaveBeenCalledTimes(1);
      expect(FlwButton.root.instance.state.isPending).toBe(true);
      // end test
      done();
    }, 50);
  });

  it("gets redirect params and returns them on redirect", (done) => {
    // define response
    const response = {
      flwref: 'erinf930rnf09',
      txref: 'nfeinr09erss',
    }

    // define url
    const url = "http://redirect-url.com/api/hosted_pay/undefined"

    const urlWithParams = url + '?flwref=' + response.flwref + '&txref=' + response.txref;

    // get create instance of flutterwave button
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);

    // spy on getRedirectParams method
    const getRedirectParams = jest.spyOn(TestRenderer.root.instance, 'getRedirectParams');

    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));

    // find button and 
    const Button = TestRenderer.root.findByProps({testID: BtnTestID});
    Button.props.onPress();

    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();

    // wait for fetch to complete
    setTimeout(() => {
      // find webview and fire webview onNavigationStateChange
      const webView = TestRenderer.root.findByType(WebView);
      webView.props.onNavigationStateChange({url: urlWithParams});

      // run checks
      expect(getRedirectParams).toHaveBeenCalledTimes(1);
      expect(getRedirectParams).toHaveBeenCalledWith(urlWithParams);
      expect(getRedirectParams).toHaveReturnedWith(response);
      // end test
      done();
    }, 50);
  });

  it("does not fire complete handle if redirect url does not match", (done) => {
    // define url
    const url = "http://redirect-url.com";

    // get create instance of flutterwave button
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);

    // spy on getRedirectParams method
    const handleComplete = jest.spyOn(TestRenderer.root.instance, 'handleComplete');
    const handleNavigationStateChange = jest.spyOn(TestRenderer.root.instance, 'handleNavigationStateChange');

    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));

    // find button and 
    const Button = TestRenderer.root.findByProps({testID: BtnTestID});
    Button.props.onPress();

    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();

    // wait for fetch to complete
    setTimeout(() => {
      // find webview and fire webview onNavigationStateChange
      const webView = TestRenderer.root.findByType(WebView);
      webView.props.onNavigationStateChange({url: url});

      // run checks
      expect(handleNavigationStateChange).toHaveBeenCalledTimes(1);
      expect(handleComplete).toHaveBeenCalledTimes(0);

      // end test
      done();
    }, 50);
  });

  it("fires onComplete when redirected", (done) => {
    // define response
    const response = {
      flwref: 'erinf930rnf09',
      txref: 'nfeinr09erss',
    }

    const onComplete = jest.fn();

    // define url
    const url = "http://redirect-url.com/api/hosted_pay/undefined?flwref=" +
      response.flwref +
      "&txref=" +
      response.txref

    // get create instance of flutterwave button
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={onComplete}
      options={PaymentOptions}
    />);

    // spy on getRedirectParams method
    const handleComplete = jest.spyOn(TestRenderer.root.instance, 'handleComplete');
    const handleNavigationStateChange = jest.spyOn(
      TestRenderer.root.instance,
      'handleNavigationStateChange'
    );

    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));

    // press init button
    TestRenderer.root.findByProps({testID: BtnTestID}).props.onPress();

    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();

    // wait for fetch to complete
    setTimeout(() => {
      // find webview and fire webview onNavigationStateChange
      const webView = TestRenderer.root.findByType(WebView);
      webView.props.onNavigationStateChange({url: url});

      // run checks
      expect(handleNavigationStateChange).toHaveBeenCalledTimes(1);
      expect(handleComplete).toHaveBeenCalledTimes(1);
      expect(handleComplete).toHaveBeenCalledWith(response);
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({
        ...response,
        cancelled: false
      });

      // end test
      done();
    }, 50);
  });

  it("cancels fetch on will unmount.", () => {
    // get create instance of flutterwave button
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    TestRenderer
      .root
      .findByProps({testID: BtnTestID})
      .props
      .onPress();
    // spy on abort method
    const abort = jest.spyOn(TestRenderer.root.instance.canceller, 'abort');
    // call component will unmount
    TestRenderer.root.instance.componentWillUnmount();
    // run checks
    expect(abort).toHaveBeenCalledTimes(1);
    // end test
  });

  it("does not cancel fetch on will unmount if canceller is not set.", () => {
    // get create instance of flutterwave button
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    const willUnmount = jest.spyOn(TestRenderer.root.instance, 'componentWillUnmount');
    // call component will unmount
    TestRenderer.root.instance.componentWillUnmount();
    // run checks
    expect(willUnmount).toHaveBeenCalledTimes(1);
    expect(TestRenderer.root.instance.canceller).toBeUndefined();
  });

  it('can reload webview if webview ref is set', (done) => {
    // create renderer
    const TestRender = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />); 
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // fire on press
    TestRender.root.findByProps({testID: BtnTestID}).props.onPress();
    // simulate animated animation
    jest.useFakeTimers();
    global.timeTravel();
    jest.useRealTimers();
  
    // wait for standard call to occurr
    setTimeout(() => {
      const webviewReload = jest.spyOn(
        TestRender.root.instance.webviewRef,
        'reload'
      ).mockImplementationOnce((() => {}));
      TestRender.root.instance.handleReload();
      expect(webviewReload).toHaveBeenCalledTimes(1);
      done();
    }, 50);
  });

  it('does not reload if webview ref is not set', () => {
    // create renderer
    const TestRender = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    Object.defineProperty(TestRender.root.instance, 'webviewRef', {value: null});
    const handleReload = jest.spyOn(TestRender.root.instance, 'handleReload');
    TestRender.root.instance.handleReload();
    expect(handleReload).toHaveBeenCalledTimes(1);
    expect(TestRender.root.instance.webviewRef === null).toBe(true);
  });

  it("handles DefaultButton onSizeChange", () => {
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    const size = {width: 1200, height: 0};
    const handleButtonResize = jest.spyOn(TestRenderer.root.instance, 'handleButtonResize');

    TestRenderer.root.findByType(DefaultButton).props.onSizeChange(size);
    TestRenderer.root.findByType(DefaultButton).props.onSizeChange(size);

    expect(handleButtonResize).toHaveBeenCalledTimes(1);
    expect(handleButtonResize).toHaveBeenCalledWith(size);
  });

  it("does not return query params if non is available with getRedirectParams method", () => {
    const url = new String('http://example.com');
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    const split = jest.spyOn(url, 'split');
    TestRenderer.root.instance.getRedirectParams(url);;
    expect(split).toHaveBeenCalledTimes(1);
  });

  it("returns query params if avialeble with getRedirectParams method", () => {
    const url = new String('http://example.com?foo=bar');
    const TestRenderer = renderer.create(<FlutterwaveButton
      onComplete={jest.fn()}
      options={PaymentOptions}
    />);
    const split = jest.spyOn(url, 'split');
    TestRenderer.root.instance.getRedirectParams(url);;
    expect(split).toHaveBeenCalledTimes(2);
  });
});

it("updates state if reset is called.", () => {
  // get create instance of flutterwave button
  const TestRenderer = renderer.create(<FlutterwaveButton
    onComplete={jest.fn()}
    options={PaymentOptions}
  />);
  const setState = jest.spyOn(TestRenderer.root.instance, 'setState');
  // call component will unmount
  TestRenderer.root.instance.reset();
  // run checks
  expect(setState).toHaveBeenCalledTimes(1);
  expect(TestRenderer.root.instance.canceller).toBeUndefined();
});

it("cancels fetch if reset is called and abort controller is set.", () => {
  // get create instance of flutterwave button
  const TestRenderer = renderer.create(<FlutterwaveButton
    onComplete={jest.fn()}
    options={PaymentOptions}
  />);
  fetchMock.mockOnce(JSON.stringify(SuccessResponse));
  TestRenderer
    .root
    .findByProps({testID: BtnTestID})
    .props
    .onPress();
  // spy on abort method
  const abort = jest.spyOn(TestRenderer.root.instance.canceller, 'abort');
  // call component will unmount
  TestRenderer.root.instance.reset();
  // run checks
  expect(abort).toHaveBeenCalledTimes(1);
  // end test
});
