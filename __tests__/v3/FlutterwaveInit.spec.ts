import FlutterwaveInit, {FlutterwaveInitOptions} from '../../src/v3/FlutterwaveInit';
import {STANDARD_URL} from '../../src/configs';
import FlutterwaveInitError from '../../src/utils/FlutterwaveInitError';

const AUTHORIZATION = '[AUTHORIZATION]';

// fetch header
const FETCH_HEADER = new Headers();
FETCH_HEADER.append('Content-Type', 'application/json');
FETCH_HEADER.append('Authorization', `Bearer ${AUTHORIZATION}`);

// fetch body
const FETCH_BODY = {
  redirect_url: 'http://flutterwave.com',
  amount: 50,
  currency: 'NGN',
  customer: {
    email: 'email@example.com',
  },
  tx_ref: Date.now() + '-txref',
  payment_options: 'card',
  customizations: {
    title: 'Hello World',
  }
}

// payment options
const INIT_OPTIONS: FlutterwaveInitOptions = {
  ...FETCH_BODY,
  authorization: AUTHORIZATION
};

describe('<FlutterwaveInit />', () => {
  it('runs a fetch request', async () => {
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify({
      status: 'success',
      message: 'Payment link generated.',
      data: {link: 'http://example.com'},
    }));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
      // run assertions
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
        body: JSON.stringify(FETCH_BODY),
        headers: FETCH_HEADER,
        method: 'POST',
      });
    } catch (e) {
      // no error occurred
    }
  });

  it('returns a payment link after initialization', async () => {
    const link = 'http://payment-link.com/checkout';
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify({
      status: 'success',
      message: 'Payment link generated.',
      data: {link},
    }));
    try {
      // initialize payment
      const response = await FlutterwaveInit(INIT_OPTIONS)
      // run assertions
      expect(response).toEqual(link)
    } catch (e) {
      // no error occurred
    }
  });

  it('includes error code and message of init error', async () => {
    const message = 'An error has occurred.';
    // reject next fetch
    fetchMock.mockOnce(JSON.stringify({
      status: 'error',
      message: message,
    }));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.message).toEqual(message);
      expect(error.code).toEqual('STANDARD_INIT_ERROR');
    }
  });

  it('returns missing authorization request error code', async () => {
    const message = 'Authorization is required.';
    // reject next fetch
    fetchMock.mockOnce(JSON.stringify({
      status: 'error',
      message: message,
    }));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.message).toEqual(message);
      expect(error.code).toEqual('AUTH_MISSING');
    }
  });

  it('returns invalid authorization request error code', async () => {
    const message = 'Authorization is invalid.';
    // reject next fetch
    fetchMock.mockOnce(JSON.stringify({
      status: 'error',
      message: message,
    }));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.message).toEqual(message);
      expect(error.code).toEqual('AUTH_INVALID');
    }
  });

  it('returns field errors from request errors', async () => {
    const message = 'Missin fields.';
    const errors = [{field: 'tx_ref', message: 'tx_ref is required'}];
    // reject next fetch
    fetchMock.mockOnce(JSON.stringify({
      status: 'error',
      message: message,
      errors: errors,
    }));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.message).toEqual(message);
      expect(error.code).toEqual('INVALID_OPTIONS');
      expect(error.errors).toBeDefined();
      expect(error.errors[0]).toEqual(errors[0].message);
    }
  });

  it('always has an error code property on error object', async () => {
    const message = 'An error has occurred.';
    // reject next fetch
    fetchMock.mockRejectOnce(new Error(message));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.code).toBeDefined();
    }
  });

  it('catches missing response data error', async () => {
    const message = 'Hello, World!';
    // mock next fetch
    fetchMock.mockOnce(JSON.stringify({status: 'success', message}));
    try {
      // initialize payment
      await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.code).toEqual('MALFORMED_RESPONSE');
    }
  });

  it('is abortable', async () => {
    // use fake jest timers
    jest.useFakeTimers();
    // mock fetch response
    fetchMock.mockResponse(async () => {
      jest.advanceTimersByTime(60)
      return JSON.stringify({
        status: 'error',
        message: 'Error!',
      })
    });
    // create abort controller
    const abortController = new AbortController;
    // abort next fetch
    setTimeout(() => abortController.abort(), 50);
    try {
      // initialize payment
      await FlutterwaveInit(
        INIT_OPTIONS,
        abortController
      )
    } catch(error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('ABORTERROR');
    }
  });
});
