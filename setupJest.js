import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
require('jest-fetch-mock').enableMocks();
const frameTime = 1;

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

global.requestAnimationFrame = cb => {
  setTimeout(cb, frameTime)
}
