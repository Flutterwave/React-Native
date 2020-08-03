import 'react-native';
import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import FlwButton from '../src/FlwButton';
const testID = 'flw-button';

describe('<FlwButton/>', () => {
  it('renders pay with flutterwave by default', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlwButton />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('renders with overlay and inactive style of button is disabled', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlwButton disabled />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('applies left aligned style if alignLeft prop is present', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlwButton alignLeft />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('replaces pay with flutterwave image with children', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwButton>
        <Text>Hello, World!</Text>
      </FlwButton>
    );
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('fires on press if set', () => {
    // create onPress function
    const onPress = jest.fn();
    // create test renderer
    const TestRenderer = renderer.create(
      <FlwButton onPress={onPress}>
        <Text>Hello, World!</Text>
      </FlwButton>
    );
    // fire onPress function
    TestRenderer.root.findByProps({testID}).props.onPress();
    // run assertions
    expect(TestRenderer.root.findByProps({testID}).props.onPress).toBeDefined();
    expect(onPress).toBeCalledTimes(1);
  });
});

