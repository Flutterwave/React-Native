import ResponseParser from '../src/utils/ResponseParser';
import FlutterwaveInitError from '../src/utils/FlutterwaveInitError';

describe('<ResponseParser/>', () => {
  it('returns missing auth error', () => {
    const code = 'AUTH_MISSING';
    // parse response
    const error = ResponseParser({
      message: 'Authorization is required'
    });
    // run assertions
    expect(error instanceof FlutterwaveInitError).toBeTruthy()
    expect(typeof error !== 'string' && error.code === code).toBeTruthy();
  });

  it('returns invalid auth error', () => {
    const code = 'AUTH_INVALID';
    // parse response
    const error = ResponseParser({
      message: 'Authorization is invalid'
    });
    // run assertions
    expect(error instanceof FlutterwaveInitError).toBeTruthy()
    expect(typeof error !== 'string' && error.code === code).toBeTruthy();
  });

  it('return object with errors property', () => {
    const code = 'INVALID_OPTIONS';
    const errors = [{field: 'tx_ref', message: 'An error has occured'}];
    // parse response
    const error = ResponseParser({
      message: 'Missing fields error.',
      errors
    });
    // run assertions
    expect(error instanceof FlutterwaveInitError).toBeTruthy()
    expect(typeof error !== 'string' && error.code === code).toBeTruthy();
    expect(typeof error !== 'string' && Array.isArray(error.errors)).toBeTruthy();
    expect(typeof error !== 'string' && error.errors[0] === errors[0].message).toBeTruthy();
  });

  it('returns standard init error code as default code if none is specified', () => {
    const code = 'STANDARD_INIT_ERROR';
    // parse response
    const error = ResponseParser({
      message: 'A server error occurred.'
    });
    // run assertions
    expect(error instanceof FlutterwaveInitError).toBeTruthy()
    expect(typeof error !== 'string' && error.code === code).toBeTruthy();
  });

  it('returns malformed response if status is success and data or link is missing', () => {
    const code = 'MALFORMED_RESPONSE';
    // parse response
    const error = ResponseParser({
      message: 'Great, it worked!!!',
      status: 'success'
    });
    // run assertions
    expect(error instanceof FlutterwaveInitError).toBeTruthy()
    expect(typeof error !== 'string' && error.code === code).toBeTruthy();
  });

  it('returns a payment link', () => {
    const link = 'http://checkout.flutterwave.com/380340934u093u403'
    // parse response
    const data = ResponseParser({
      message: 'Hosted link.',
      status: 'success',
      data: {link}
    });
    // run assertions
    expect(data instanceof FlutterwaveInitError).toBeFalsy()
    expect(data === link).toBeTruthy();
  });
});
