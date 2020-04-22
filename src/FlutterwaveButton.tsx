import React from 'react';
import {StyleSheet, ViewStyle, Image} from 'react-native';
import PropTypes from 'prop-types';
import DefaultButton from './DefaultButton';
const pryContent = require('./pry-button-content.png');
const altContent = require('./alt-button-content.png');
const contentWidthPercentage = 0.6549707602;
const contentSizeDimension = 8.2962962963;
const contentMaxWidth = 187.3;
const contentMaxHeight = contentMaxWidth / contentSizeDimension;
const contentMinWidth = 187.3;
const contentMinHeight = contentMinWidth / contentSizeDimension;

export interface FlutterwaveButtonProps {
  style?: ViewStyle;
  alt?: 'alt' | boolean;
  alignLeft?: 'alignLeft' | boolean;
}

interface FlutterwaveButtonState {
  buttonSize: {
    width: number;
    height: number;
  };
}

class FlutterwaveButton extends React.Component<
  FlutterwaveButtonProps,
  FlutterwaveButtonState
> {
  static propTypes = {
    alt: PropTypes.bool,
    alignLeft: PropTypes.bool,
  };

  state: FlutterwaveButtonState = {
    buttonSize: {
      width: 0,
      height: 0,
    },
  };

  reset = () => {};

  handleButtonResize = (size: {width: number; height: number}) => {
    const {buttonSize} = this.state;
    if (JSON.stringify(buttonSize) !== JSON.stringify(size)) {
      this.setState({buttonSize: size});
    }
  };

  render() {
    // render UI
    return (
      this.renderButton()
    );
  }

  renderButton() {
    const {style, alt, alignLeft} = this.props;
    const {buttonSize} = this.state;
    const contentWidth = buttonSize.width * contentWidthPercentage;
    const contentHeight = contentWidth / contentSizeDimension;
    const contentSizeStyle = {
      width:
        contentWidth > contentMaxWidth
          ? contentMaxWidth
          : contentWidth < contentMinWidth
          ? contentMinWidth
          : contentWidth,
      height:
        contentHeight > contentMaxHeight
          ? contentMaxHeight
          : contentHeight < contentMinHeight
          ? contentMinHeight
          : contentHeight,
    };
    // render primary button
    return (
      <DefaultButton
        alt={alt}
        alignLeft={alignLeft}
        style={style}
        onSizeChange={this.handleButtonResize}>
        <Image
          source={alt ? altContent : pryContent}
          resizeMode="contain"
          resizeMethod="resize"
          style={[styles.buttonContent, contentSizeStyle]}
          fadeDuration={0}
        />
      </DefaultButton>
    );
  }
}

const styles = StyleSheet.create({
  buttonContent: {
    resizeMode: 'contain',
  },
});

export default FlutterwaveButton;
