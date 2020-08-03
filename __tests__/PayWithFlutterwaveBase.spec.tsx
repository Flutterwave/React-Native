import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PayWithFlutterwaveBase from '../src/PayWithFlutterwaveBase';
import {FlutterwaveInitOptions} from '../src/FlutterwaveInit';
import {REDIRECT_URL, STANDARD_URL} from '../src/configs';
import {Modal, TouchableOpacity, Text} from 'react-native';
import timeTravel, { setupTimeTravel } from '../timeTravel';
import FlwCheckout from '../src/FlwCheckout';
import FlutterwaveInitError from '../src/utils/FlutterwaveInitError';
import FlutterwaveInit from '../src/FlutterwaveInit';
const BtnTestID = 'flw-button';
const CustomBtnTestID = 'flw-custom-button';

const CustomButton = ({onPress, disabled}) => (
  <TouchableOpacity
    testID={CustomBtnTestID}
    onPress={onPress}
    disabled={disabled}>
    <Text>{disabled ? 'Please wait...' : 'Pay'}</Text>
  </TouchableOpacity>
)

const SuccessResponse = {
  status: 'success',
  message: 'Payment link generated.',
  data: {
    link: 'http://payment-link.com/checkout',
  },
};

const PAYMENT_INFO: Omit<FlutterwaveInitOptions, 'redirect_url'> = {
  tx_ref: '34h093h09h034034',
  customer: {
    email: 'customer-email@example.com',
  },
  authorization: '[Authorization]',
  amount: 50,
  currency: 'NGN',
};

const REQUEST_BODY = {...PAYMENT_INFO, redirect_url: REDIRECT_URL};
delete REQUEST_BODY.authorization;

const HEADERS = new Headers
HEADERS.append('Content-Type', 'application/json');
HEADERS.append('Authorization', `Bearer ${PAYMENT_INFO.authorization}`);

// set and unset time travel
beforeEach(() => {
  setupTimeTravel();
  fetchMock.mockReset();
});
afterEach(() => jest.useRealTimers());

describe('PayWithFlutterwaveBase', () => {

  it('renders a default pay with flutterwave button', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  });

  it('uses custom button in place of flw button if defined', () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
        customButton={CustomButton}
      />
    );
    // run assertions
    expect(Tree.toJSON()).toMatchSnapshot();
  })

  it('disables custom button and set is initializing to true when initializing payment', () => {
    const customButton = jest.fn();
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
        customButton={customButton}
      />
    );
    // call the handleInit method on component instance
    Tree.root.instance.handleInit();
    // run aseertions
    expect(customButton).toHaveBeenNthCalledWith(1, {
      disabled: false,
      onPress: expect.any(Function),
    });
    expect(customButton).toHaveBeenLastCalledWith({
      disabled: true,
      onPress: expect.any(Function),
    });
  });

  it('disables button if in pending mode', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // enter pending mode
    Tree.root.instance.setState({isPending: true});
    // get button test renderer
    const ButtonTestRender = Tree.root.findByProps({testID: BtnTestID});
    // run assertions
    expect(ButtonTestRender.props.disabled).toEqual(true);
  });

  it('initializes payment when button is pressed', async () => {
    // use real timers
    jest.useRealTimers();
    const init = jest.fn();
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={init}
        foo="Bar"
      />
    );
    // mock next request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialize payment
    Tree.root.findByProps({testID: BtnTestID}).props.onPress();
    // run assertions
    expect(init).toBeCalledTimes(1);
    expect(init).toHaveBeenCalledWith({...PAYMENT_INFO, redirect_url: REDIRECT_URL}, new AbortController);
  });

  it('does not initialize payment if already has payment link', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // set payment link
    Tree.root.instance.setState({link: 'http://checkout-url.com'});
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialise payment
    Tree.root.instance.handleInit();
    // run assertions
    expect(global.fetch).toHaveBeenCalledTimes(0);
  });

  it('does not initialize payment if not using new transaction ref', () => {
    const onInitializeError = jest.fn();
    const init = jest.fn();
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        options={PAYMENT_INFO}
        reference={PAYMENT_INFO.tx_ref}
        init={init}
        onInitializeError={onInitializeError}
      />
    );
    // set payment link
    Tree.root.instance.setState({reference: PAYMENT_INFO.tx_ref});
    // initialise payment
    Tree.root.instance.handleInit();
    // run assertions
    expect(init).toHaveBeenCalledTimes(0);
    expect(onInitializeError).toHaveBeenCalledTimes(1);
    expect(onInitializeError.mock.calls[0][0]).toBeInstanceOf(FlutterwaveInitError);
  });

  it('does not initialize payment if in pending state', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // set pending to true
    Tree.root.instance.setState({isPending: true});
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialise payment
    Tree.root.instance.handleInit();
    // run assertions
    expect(global.fetch).toHaveBeenCalledTimes(0);
  });

  it('calls onAbort if available and abort event occurred', () => {
    const onAbort = jest.fn();
    // create component tree
    const FlwButton = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
        onAbort={onAbort}
      />
    );
    // fire handle abort confirm
    FlwButton.root.instance.handleAbort();
    // called on abort
    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  it('sets resetLink state to true on v2 success redirect', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // call handle redirect method
    Tree.root.instance.handleRedirect({flwref: 'flwref'});
    // run assertions
    expect(setState.mock.calls[0][0](Tree.root.instance.state)).toMatchObject({
      reference: null,
      resetLink: true,
      showDialog: false,
    });
  });

  it('sets resetLink state to false on v2 failure redirect', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // call handle redirect method
    Tree.root.instance.handleRedirect({});
    // run assertions
    expect(setState.mock.calls[0][0](Tree.root.instance.state)).toMatchObject({
      reference: null,
      resetLink: false,
      showDialog: false,
    });
  });

  it('sets resetLink state to true on v3 success redirect', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // call handle redirect method
    Tree.root.instance.handleRedirect({status: 'successful'});
    // run assertions
    expect(setState.mock.calls[0][0](Tree.root.instance.state)).toMatchObject({
      reference: null,
      resetLink: true,
      showDialog: false,
    });
  });

  it('does not update state if options changed and no link has been generated', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // update component
    Tree.update(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={{...PAYMENT_INFO, txref: 'foobarbaz'}}
        init={jest.fn()}
      />
    )
    // run assertions
    expect(setState).toHaveReturnedTimes(0);
  });

  it('unsets link and reference if options changed and dialog is not yet visible', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // set a link
    Tree.root.instance.setState({link: 'http://link.com'});
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // update component
    Tree.update(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={{...PAYMENT_INFO, txref: 'foobarbaz'}}
        init={jest.fn()}
      />
    )
    // run assertions
    expect(setState).toHaveBeenLastCalledWith({
      link: null,
      reference: null,
    });
  });

  it('schedules link reset if options changed and dialog is visible', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // set a link and disalog visibility
    Tree.root.instance.setState({link: 'http://link.com', showDialog: true});
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // update component
    Tree.update(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={{...PAYMENT_INFO, txref: 'foobarbaz'}}
        init={jest.fn()}
      />
    )
    // run assertions
    expect(setState).toHaveBeenLastCalledWith({resetLink: true});
  });

  it('sets resetLink state to false on v2 failure redirect', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // call handle redirect method
    Tree.root.instance.handleRedirect({status: 'cancelled'});
    // run assertions
    expect(setState.mock.calls[0][0](Tree.root.instance.state)).toMatchObject({
      reference: null,
      resetLink: false,
      showDialog: false,
    });
  });

  it('fires onDidInitialize if available', (done) => {
    const onDidInitialize = jest.fn();
    // create component tree
    const FlwButton = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
        onDidInitialize={onDidInitialize}
      />
    );
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialize payment
    FlwButton.root.instance.handleInit();
    // simulate animated timeframe
    timeTravel();
    // revert to using real timers
    jest.useRealTimers();
    // wait for fetch to resolve
    setTimeout(() => {
      // run assertions
      expect(onDidInitialize).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('fires onWillInitialize if available', (done) => {
    const onWillInitialize = jest.fn();
    // create component tree
    const tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
        onWillInitialize={onWillInitialize}
      />
    );
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialize payment
    tree.root.instance.handleInit();
    // simulate animated timeframe
    timeTravel();
    // revert to using real timers
    jest.useRealTimers();
    // wait for fetch to resolve
    setTimeout(() => {
      // run assertions
      expect(onWillInitialize).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('fires onInitializeError if available', (done) => {
    // define variables
    const err = new Error('Error occurred.');
    const onInitializeError = jest.fn();
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={FlutterwaveInit}
        onInitializeError={onInitializeError}
      />
    );
    // mock next fetch request
    fetchMock.mockRejectOnce(err);
    // fire on press
    Tree.root.instance.handleInit();
    // revert to using real timers
    jest.useRealTimers();
    // wait for fetch to resolve
    setTimeout(() => {
      // run assertions
      expect(onInitializeError).toHaveBeenCalledTimes(1);
      expect(onInitializeError).toHaveBeenCalledWith(new FlutterwaveInitError({
        code: err.name.toUpperCase(),
        message: err.message
      }));
      // end test
      done();
    }, 50);
  });

  it('does not update state if init is aborted', (done) => {
    // revert to using real timers
    jest.useRealTimers();
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={FlutterwaveInit}
      />
    );
    // spy on setState method
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // mock next fetch request
    fetchMock.mockAbortOnce();
    // initialize payment
    Tree.root.instance.handleInit();
    // wait for request to be made
    setTimeout(() => {
      expect(setState).toHaveBeenCalledTimes(1);
      expect(Tree.root.instance.state.isPending).toBe(true);
      // end test
      done();
    });
  });

  it("cancels fetch on will unmount.", () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialize payment
    Tree.root.instance.handleInit();
    // spy on abort method
    const abort = jest.spyOn(Tree.root.instance.abortController, 'abort');
    // call component will unmount
    Tree.root.instance.componentWillUnmount();
    // run assertions
    expect(abort).toHaveBeenCalledTimes(1);
    // end test
  });

  it("does not cancel fetch on will unmount if canceller is not set.", () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on componentWillUnmount lifecycle hook method
    const willUnmount = jest.spyOn(Tree.root.instance, 'componentWillUnmount');
    // call component will unmount
    Tree.root.instance.componentWillUnmount();
    // run assertions
    expect(willUnmount).toHaveBeenCalledTimes(1);
    expect(Tree.root.instance.abortController).toBeUndefined();
  });

  it("updates state if reset is called.", () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // set component state
    const setState = jest.spyOn(Tree.root.instance, 'setState');
    // call component will unmount
    Tree.root.instance.reset();
    // run assertions
    expect(setState).toHaveBeenCalledTimes(1);
    expect(Tree.root.instance.abortController).toBeUndefined();
  });

  it("cancels fetch if reset is called and abort controller is set.", () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SuccessResponse));
    // initialize payment
    Tree.root.instance.handleInit();
    // spy on abort method on abortController
    const abort = jest.spyOn(Tree.root.instance.abortController, 'abort');
    // call componentWillUnmount
    Tree.root.instance.reset();
    // run assertions
    expect(abort).toHaveBeenCalledTimes(1);
  });

  it("calls options change handler if options changed", () => {
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // spy on handleOptionsChanged method
    const handleOptionsChanged = jest.spyOn(Tree.root.instance, 'handleOptionsChanged');
    // update component
    Tree.update(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={{...PAYMENT_INFO, tx_ref: 'Updated tx_ref'}}
        init={jest.fn()}
      />
    );
    // run assertions
    expect(handleOptionsChanged).toHaveBeenCalledTimes(1);
  });
 
  it('renders modal with visible prop set to false by default', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // get modal test renderer
    const ModalTestRender = Tree.root.findByType(Modal);
    // run assertions
    expect(ModalTestRender.props.visible).toEqual(false);
  });

  it('sets checkout visible prop to true when showDialog state is true', () => {
    // create component tree
    const Tree = renderer.create(
      <PayWithFlutterwaveBase
        onRedirect={() => {}}
        reference={PAYMENT_INFO.tx_ref}
        options={PAYMENT_INFO}
        init={jest.fn()}
      />
    );
    // enter pending mode
    Tree.root.instance.setState({showDialog: true});
    // simulate animated timeframe
    timeTravel();
    // get modal test renderer
    const ModalTestRender = Tree.root.findByType(FlwCheckout);
    // run assertions
    expect(ModalTestRender.props.visible).toEqual(true);
  });
});
