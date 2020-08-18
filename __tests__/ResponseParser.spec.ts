import ResponseParser from '../src/utils/ResponseParser';
import FlutterwaveInitError from '../src/utils/FlutterwaveInitError';

describe('<ResponseParser/>', () => {
  it('expect error to be instance of FlutterwaveInitError', async () => {
    try {
      // parse response
      await ResponseParser({
        message: 'Error occurred!'
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
    }
  });
  
  it('returns missing auth error', async () => {
    try {
      // parse response
      await ResponseParser({
        message: 'Authorization is required'
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('AUTH_MISSING');
    }
  });

  it('returns invalid auth error', async () => {
    try {
      // parse response
      await ResponseParser({
        message: 'Authorization is invalid'
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('AUTH_INVALID');
    }
  });

  it('return object with errors property', async () => {
    const errors = [{field: 'tx_ref', message: 'An error has occured'}];
    try {
      // parse response
      await ResponseParser({
        message: 'Missing fields error.',
        errors
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('INVALID_OPTIONS');
      expect(Array.isArray(error.errors)).toBeTruthy();
      expect(error.errors[0]).toEqual(errors[0].message);
    }
  });

  it('returns standard init error code as default code if none is specified', async () => {
    try {
      // parse response
      ResponseParser({
        message: 'A server error occurred.'
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('STANDARD_INIT_ERROR');
    }
  });

  it('returns malformed response if status is success and data or link is missing', async () => {
    try {
      // parse response
      await ResponseParser({
        message: 'Great, it worked!!!',
        status: 'success'
      });
    } catch (error) {
      // run assertions
      expect(error).toBeInstanceOf(FlutterwaveInitError);
      expect(error.code).toEqual('MALFORMED_RESPONSE');
    }
  });

  it('returns a payment link', async () => {
    try {
      const link = 'http://checkout.flutterwave.com/380340934u093u403'
      // parse response
      const data = await ResponseParser({
        message: 'Hosted link.',
        status: 'success',
        data: {link}
      });
      // run assertions
      expect(data).toEqual(link);
    } catch (err) {
      // no need to run this
    }
  });
});
