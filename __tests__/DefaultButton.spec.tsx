import 'react-native';
import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import DefaultButton from '../src/DefaultButton';
const BtnTestID = 'flw-default-button';

describe('<DefaultButton />', () => {
  it('renders primary button correctly', () => {
    const TestRender = renderer.create(
      <DefaultButton>
        <Text>Hello, World</Text>
      </DefaultButton>
    );
    expect(TestRender.toJSON()).toMatchSnapshot();
  });

  it('renders alt button correctly', () => {
    const TestRender = renderer.create(
      <DefaultButton alt>
        <Text>Hello, World</Text>
      </DefaultButton>
    );
    expect(TestRender.toJSON()).toMatchSnapshot();
  });

  it('renders overlay if busy', () => {
    const TestRender = renderer.create(
      <DefaultButton isBusy>
        <Text>Hello, World</Text>
      </DefaultButton>
    );
    expect(TestRender.toJSON()).toMatchSnapshot();
  });

  it('renders alt overlay if alt and busy', () => {
    const TestRender = renderer.create(
      <DefaultButton alt isBusy>
        <Text>Hello, World</Text>
      </DefaultButton>
    );
    expect(TestRender.toJSON()).toMatchSnapshot();
  });

  it('renders with align left style', () => {
    const TestRender = renderer.create(
      <DefaultButton alignLeft>
        <Text>Hello, World</Text>
      </DefaultButton>
    );
    expect(TestRender.toJSON()).toMatchSnapshot();
  });

  it('fires onSizeChange if set', () => {
    const onSizeChange = jest.fn();
    const TestRender = renderer.create(
      <DefaultButton onSizeChange={onSizeChange}>
          <Text>Hello, World</Text>
      </DefaultButton>
    );
    TestRender.root.findByProps({testID: BtnTestID}).props.onLayout({
      nativeEvent: {
        layout:{
          width: 1,
          height: 1,
        }
      }
    });
    expect(onSizeChange).toHaveBeenCalledTimes(1);
    expect(onSizeChange).toHaveBeenCalledWith({width: 1, height: 1});
  });

  it('fires onPress if set', () => {
    const onPress = jest.fn();
    const TestRender = renderer.create(
      <DefaultButton onPress={onPress}>
        <Text>Hello, World</Text>
      </DefaultButton>
    );

    TestRender.root.findByProps({testID: BtnTestID}).props.onPress();

    expect(TestRender.root.findByProps({testID: BtnTestID}).props.onPress).toBeDefined();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
