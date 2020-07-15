import FlutterwaveInitError from '../src/utils/FlutterwaveInitError';

describe('<FlutterwaveInitError/>', () => {
  it('initializes with the the message and code passed', () => {
    const message = 'Hello, World!';
    const code = 'TEST';
    const error = new FlutterwaveInitError({message, code});
    expect(error.message).toEqual(message);
    expect(error.code).toEqual(code);
  });

  it('has errors if specified', () => {
    const message = 'Hello, World!';
    const code = 'TEST';
    const errors = ['Error 1', 'Error 2'];
    const error = new FlutterwaveInitError({message, code, errors});
    expect(Array.isArray(error.errors)).toBeTruthy();
  });

  it('has an error ID if specified', () => {
    const message = 'Hello, World!';
    const code = 'TEST';
    const errorId = 'N/F39040830498039434';
    const error = new FlutterwaveInitError({message, code, errorId});
    expect(typeof error.errorId === 'string').toBeTruthy();
  });
});
