import 'react-native';
import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import FlutterwaveButton from '../src/FlutterwaveButton';
const testID = 'flw-button';

describe('<FlutterwaveButton/>', () => {
  it('renders pay with flutterwave by default', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlutterwaveButton />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('renders with overlay and inactive style of button is disabled', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlutterwaveButton disabled />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('applies left aligned style if alignLeft prop is present', () => {
    // create test renderer
    const TestRenderer = renderer.create(<FlutterwaveButton alignLeft />);
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('replaces pay with flutterwave image with children', () => {
    // create test renderer
    const TestRenderer = renderer.create(
      <FlutterwaveButton>
        <Text>Hello, World!</Text>
      </FlutterwaveButton>
    );
    // run assertions
    expect(TestRenderer.toJSON()).toMatchSnapshot();
  });

  it('fires on press if set', () => {
    // create onPress function
    const onPress = jest.fn();
    // create test renderer
    const TestRenderer = renderer.create(
      <FlutterwaveButton onPress={onPress}>
        <Text>Hello, World!</Text>
      </FlutterwaveButton>
    );
    // fire onPress function
    TestRenderer.root.findByProps({testID}).props.onPress();
    // run assertions
    expect(TestRenderer.root.findByProps({testID}).props.onPress).toBeDefined();
    expect(onPress).toBeCalledTimes(1);
  });
});

