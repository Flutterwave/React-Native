const MockDate = require('mockdate');
export const FRAME_TIME = 1;

const advanceOneFrame = () => {
  MockDate.set(new Date(Date.now() + FRAME_TIME))
  jest.advanceTimersByTime(FRAME_TIME)
}

// global time travel mock for mocking "RN Animated" fram steps;
const timeTravel = (msToAdvance = FRAME_TIME) => {
  const numberOfFramesToRun = msToAdvance / FRAME_TIME
  let framesElapsed = 0

  // Step through each of the frames until we've ran them all
  while (framesElapsed < numberOfFramesToRun) {
    advanceOneFrame()
    framesElapsed++
  }
}

export const setupTimeTravel = () => {
  MockDate.set(0)
  jest.useFakeTimers()
}

export default timeTravel
