import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
require('jest-fetch-mock').enableMocks();
jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn()
  };
});
