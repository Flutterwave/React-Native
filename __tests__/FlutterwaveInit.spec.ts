import FlutterwaveInit, {FlutterwaveInitOptions} from '../src/FlutterwaveInit';
import {STANDARD_URL} from '../src/configs';

// default fetch header
const DefaultFetchHeader = new Headers();
DefaultFetchHeader.append('Content-Type', 'application/json');

describe('<FlutterwaveInit />', () => {
  it('returns a payment link after initialization', async () => {
    // mock next fetch request
    fetchMock.mockOnce(JSON.stringify({
      status: 'success',
      message: 'Payment link generated.',
      data: {
        link: 'http://payment-link.com/checkout',
      },
    }));
    // payment information
    const paymentInfo: FlutterwaveInitOptions = {
      redirect_url: 'http://flutterwave.com',
      PBFPubKey: '[PUB Key]',
      amount: 50,
      currency: 'NGN',
      customer_email: 'email@example.com',
      txref: Date.now() + '-txref',
    };
    // flutterwave init test
    const response = await FlutterwaveInit(paymentInfo);
    
    // expect fetch to have been called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // expect fetch to have been called to the standard init url
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
      body: JSON.stringify(paymentInfo),
      headers: DefaultFetchHeader,
      method: 'POST',
    });
    expect(typeof response.link === 'string').toBeTruthy();
  });

  it('includes error code and message of init error', async () => {
    // payment information
    const paymentInfo: FlutterwaveInitOptions = {
      redirect_url: 'http://flutterwave.com',
      PBFPubKey: 'FLWPUBK_TEST-c761fb7f0e443f5704a796781b621875-X44',
      amount: 50,
      currency: 'NGN',
      customer_email: 'email@example.com',
      txref: Date.now() + '-txref',
    };
    // reject next fetch
    fetchMock.mockRejectOnce(new Error('An error occured!'));
    // flutterwave init test
    const response = await FlutterwaveInit(paymentInfo);
    // expect fetch to have been called
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
      body: JSON.stringify(paymentInfo),
      headers: DefaultFetchHeader,
      method: 'POST',
    });
    // expect error and error code to be defined
    expect(typeof response.error.code === 'string').toBeTruthy();
    expect(typeof response.error.message === 'string').toBeTruthy();
  });

  it('returns unknown error if the error response has no code or message', async () => {
    // payment information
    const paymentInfo: FlutterwaveInitOptions = {
      redirect_url: 'http://flutterwave.com',
      PBFPubKey: 'FLWPUBK_TEST-c761fb7f0e443f5704a796781b621875-X44',
      amount: 50,
      currency: 'NGN',
      customer_email: 'email@example.com',
      txref: Date.now() + '-txref',
    };
    // mock next fetch
    fetchMock.mockOnce(JSON.stringify({status: 'error', data: {}}));
    // flutterwave init test
    const response = await FlutterwaveInit(paymentInfo);
    // expect fetch to have been called
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
      body: JSON.stringify(paymentInfo),
      headers: DefaultFetchHeader,
      method: 'POST',
    });
    // expect unkown error from from response
    expect(/unknown/i.test(response.error.code)).toBeTruthy();
  });

  it('catches missing response data error', async () => {
    // payment information
    const paymentInfo: FlutterwaveInitOptions = {
      redirect_url: 'http://flutterwave.com',
      PBFPubKey: 'FLWPUBK_TEST-c761fb7f0e443f5704a796781b621875-X44',
      amount: 50,
      currency: 'NGN',
      customer_email: 'email@example.com',
      txref: Date.now() + '-txref',
    };
    // mock next fetch
    fetchMock.mockOnce(JSON.stringify({status: 'error'}));
    // flutterwave init test
    const response = await FlutterwaveInit(paymentInfo);
    // expect fetch to have been called
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(STANDARD_URL, {
      body: JSON.stringify(paymentInfo),
      headers: DefaultFetchHeader,
      method: 'POST',
    });
    // expect a no response error
    expect(/nodata/i.test(response.error.code)).toBeTruthy();
  });

  it('is abortable', async () => {
    // use fake jest timers
    jest.useFakeTimers();
    // mock fetch response
    fetchMock.mockResponse(async () => {
      jest.advanceTimersByTime(60)
      return ''
    });
    // create abort controller
    const abortController = new AbortController;
    // payment information
    const paymentInfo: FlutterwaveInitOptions = {
      redirect_url: 'http://flutterwave.com',
      PBFPubKey: 'FLWPUBK_TEST-c761fb7f0e443f5704a796781b621875-X44',
      amount: 50,
      currency: 'NGN',
      customer_email: 'email@example.com',
      txref: Date.now() + '-txref',
    };
    // abort next fetch
    setTimeout(() => abortController.abort(), 50);
    // expect a no response error
    await expect(FlutterwaveInit(paymentInfo, {canceller: abortController})).resolves.toMatchObject({
      error: {
        code: 'ABORTERROR'
      }
    });
  });
});
