import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
require('jest-fetch-mock').enableMocks();
jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn()
  };
});

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    get: () => ({
      height: 1305,
      width: 300,
    })
  };
});
