import FlutterwaveInit, {FlutterwaveInitOptions} from '../../src/v2/FlutterwaveInit';
import {STANDARD_URL_V2} from '../../src/configs';
import FlutterwaveInitError from '../../src/utils/FlutterwaveInitError';

const AUTHORIZATION = '[PUB Key]';

// fetch header
const FETCH_HEADER = new Headers();
FETCH_HEADER.append('Content-Type', 'application/json');

// fetch body
const FETCH_BODY = {
  redirect_url: 'http://flutterwave.com',
  PBFPubKey: AUTHORIZATION,
  amount: 50,
  currency: 'NGN',
  customer_email: 'email@example.com',
  txref: Date.now() + '-txref',
}

// payment options
const INIT_OPTIONS: FlutterwaveInitOptions = {
  ...FETCH_BODY,
};

const SUCCESS_RESPONSE = {
  status: 'success',
  message: 'Payment link generated.',
  data: {
    link: 'http://payment-link.com/checkout',
  },
};

describe('<v2/FlutterwaveInit />', () => {
  it('returns a payment link after initialization', async () => {
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify(SUCCESS_RESPONSE));
    // flutterwave init test
    const link = await FlutterwaveInit(INIT_OPTIONS);
    // expect fetch to have been called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // expect fetch to have been called to the standard init url
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL_V2, {
      body: JSON.stringify(FETCH_BODY),
      headers: FETCH_HEADER,
      method: 'POST',
    });
    expect(typeof link === 'string').toBeTruthy();
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

  it('handles missing data error', async () => {
    // mock next fetch
    fetchMock.mockOnce(JSON.stringify({status: 'error'}));
    try {
      // initialize payment
      const response = await FlutterwaveInit(INIT_OPTIONS);
    } catch (error) {
      // run assertions
      expect(error.code).toEqual('STANDARD_INIT_ERROR');
    }
  });

  it('rejects with an error if link is missing in data', async () => {
    const errorMessage = 'Missing link test.';
    // mock next fetch
    fetchMock.mockOnce(
      JSON.stringify({
        status: 'error',
        data: {
          message: errorMessage,
          code: 'MALFORMED_RESPONSE'
        }
      }
      )
    );
    try {
      // initialize payment
      const response = await FlutterwaveInit(INIT_OPTIONS);
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
