import 'react-native';
import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import renderer from 'react-test-renderer';
import FlwCheckout, {FlwCheckoutError} from '../src/FlwCheckout';
import timeTravel, {setupTimeTravel} from '../timeTravel';
import {REDIRECT_URL} from '../src/configs';
import WebView from 'react-native-webview';
const link = 'http://example.com';

beforeEach(() => setupTimeTravel());
afterEach(() => jest.useRealTimers());
describe('<FlwCheckout/>', () => {
  it('renders with modal closed if visible prop is not true', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} />
    );
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('renders with modal open if visible props is true', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} visible />
    );
    // simulate animation timeframes
    timeTravel();
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('fires onRedirect if redirect url is correct', (done) => {
    const onRedirect = jest.fn();
    const url = REDIRECT_URL + '?foo=bar';
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={onRedirect} visible link={link} />
    );
    // fire on navigation state change
    TestRenderer.root.findByType(WebView).props.onNavigationStateChange({url});
    // simulate animation timeframes
    timeTravel();
    // revert to using real timers
    jest.useRealTimers()
    // wait for promise to resolve
    setTimeout(() => {
      // run assertions
      expect(onRedirect).toBeCalledTimes(1);
      expect(onRedirect).toBeCalledWith({foo: 'bar'});
      done();
    }, 10)
  });

  it('does not fire onRedirect if redirect url is not correct', (done) => {
    const onRedirect = jest.fn();
    const url = 'http://example/com?foo=bar';
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={onRedirect} visible link={link} />
    );
    // fire on navigation state change
    TestRenderer.root.findByType(WebView).props.onNavigationStateChange({url});
    // simulate animation timeframes
    timeTravel(); // revert to using real timers
    jest.useRealTimers()
    // wait for promise to resolve
    setTimeout(() => {
      // run assertions
      expect(onRedirect).toBeCalledTimes(0);
      done();
    })
  });

  it('asks user to confirm abort when use taps on the backdrop', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} visible link={link} />
    );
    // call backdrop onPress
    TestRenderer.root.findByProps({testID: 'flw-checkout-backdrop'}).props.onPress();
    // run assertions
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('cancel this payment?'),
      expect.any(Array),
    );
  });

  it('calls onAbort if defined', (done) => {
    const onAbort = jest.fn();
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} onAbort={onAbort} visible link={link} />
    );
    // call backdrop onPress
    TestRenderer.root.findByProps({testID: 'flw-checkout-backdrop'}).props.onPress();
    // call the cancel alert button
    Alert.alert.mock.calls[0][2][1].onPress();
    // simulate animation timeframes
    timeTravel();
    // revert to using real timers
    jest.useRealTimers();
    // wait for animateOut promise to resolve
    setTimeout(() => {
      // run assertions
      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(onAbort).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('renders error with hasLink prop as true if there is a link', () => {
    const onAbort = jest.fn();
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} onAbort={onAbort} visible link={link} />
    );
    // create error test renderer
    const ErrorTestRenderer = renderer.create(
      TestRenderer.root.findByType(WebView).props.renderError()
    );
    // run assertions
    expect(ErrorTestRenderer.root.props.hasLink).toEqual(true);
  });

  it('renders error with hasLink prop as false if there is no link', () => {
    const onAbort = jest.fn();
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} onAbort={onAbort} visible link={link} />
    );
    // create error test renderer
    const ErrorTestRenderer = renderer.create(
      TestRenderer.root.findByType(WebView).props.renderError()
    );
    // run assertions
    expect(ErrorTestRenderer.root.props.hasLink).toEqual(true);
  });

  // it('fires reload when called if webview reference is set', () => {
  //   const onAbort = jest.fn();
  //   // create test renderer
  //   const TestRenderer = renderer.create(
  //     <FlwCheckout
  //       onRedirect={() => {}}
  //       onAbort={onAbort}
  //       visible
  //       link={link}
  //     />
  //   );
  //   // get WebView test renderer
  //   const WebViewTestRenderer = TestRenderer.root.findByType(WebView);
  //   // spy on reload method on webview
  //   const reload = jest.spyOn(WebViewTestRenderer.instance, 'reload');
  //   // create error test renderer
  //   const ErrorTestRenderer = renderer.create(
  //     TestRenderer.root.findByType(WebView).props.renderError()
  //   );
  //   // call try again function on webview error
  //   ErrorTestRenderer.root.props.onTryAgain();
  //   // run assertions
  //   expect(reload).toHaveBeenCalledTimes(1);
  //   expect(1).toBeTruthy();
  // });

  it("returns query params if available in url passed to getRedirectParams", (done) => {
    const url = new String(REDIRECT_URL + '?foo=bar');
    // spy on split method on String object
    const split = jest.spyOn(url, 'split');
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} visible link={link} />
    );
    // fire on navigation state change
    TestRenderer.root.findByType(WebView).props.onNavigationStateChange({url});
    // simulate animation timeframes
    timeTravel();
    // revert to using real times
    jest.useRealTimers();
    // wait for animateOut promise to resolve
    setTimeout(() => {
      // run assertions
      expect(split).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it("does not return query params if not available in url passed to getRedirectParams", (done) => {
    const url = new String(REDIRECT_URL);
    // spy on split method on String object
    const split = jest.spyOn(url, 'split');
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckout onRedirect={() => {}} visible link={link} />
    );
    // fire on navigation state change
    TestRenderer.root.findByType(WebView).props.onNavigationStateChange({url});
    // simulate animation timeframes
    timeTravel();
    // revert to using real timers
    jest.useRealTimers();
    // wait for animateOut promise to resolve
    setTimeout(() => {
      // run assertions
      expect(split).toHaveBeenCalledTimes(1);
      done();
    })
  });
});

describe('<FlwCheckoutError />', () => {
  it('has a retry button if hasLink prop is true', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckoutError hasLink onTryAgain={() => {}} />
    );
    // simulate animation timeframes
    timeTravel();
    // font retry button
    const RetryButton = TestRenderer.root.findAllByType(TouchableOpacity)
    // run assertions
    expect(RetryButton).toHaveLength(1);
  });

  it('does not have a retry button if hasLink prop is false', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwCheckoutError hasLink={false} onTryAgain={() => {}} />
    );
    // simulate animation timeframes
    timeTravel();
    // font retry button
    const RetryButton = TestRenderer.root.findAllByType(TouchableOpacity)
    // run assertions
    expect(RetryButton).toHaveLength(0);
  });
});

