import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
require('jest-fetch-mock').enableMocks();
const MockDate = require('mockdate');
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

// global time travel mock for mocking "RN Animated" fram steps;
global.timeTravel = (time = frameTime) => {
  // tick travel handler
  const tickTravel = () => {
    // move time forward by number of fram time ms
    const now = Date.now();
    MockDate.set(new Date(now + frameTime));
    // run the timers forward
    jest.advanceTimersByTime(frameTime);
  }
  // step through each of the frames
  const frames = time / frameTime;
  for (let i = 0; i < frames; i++) {
      tickTravel();
  }
};
