import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
  TouchableHighlight,
} from "react-native";
import {colors} from './configs';

interface DefaultButtonProps {
  style?: ViewStyle;
  textStyle?: any;
  overlayStyle?: any;
  onPress?: () => void;
  disabled?: boolean;
  underlayColor?: string;
  children: React.ReactElement;
  isBusy?: boolean;
  onSizeChange?: (props: {width: number; height: number}) => void;
  alt?: 'alt' | boolean,
  alignLeft?: 'alignLeft' | boolean,
}

function getBaseStyle(alt?: 'alt' | boolean) {
  if (alt) {
    return {
      ...styles.button,
      ...styles.buttonAlt
    };
  }
  return styles.button;
}


function getBusyStyle(isBusy?: 'isBusy' | boolean, alt?: 'alt' | boolean) {
  if (!isBusy) {
    return {};
  }
  if (alt) {
    return {
      ...styles.buttonBusy,
      ...styles.buttonAltBusy
    };
  }
  return styles.buttonBusy;
}

function getAlginStyle(alignLeft?: 'alignLeft' | boolean) {
  if (alignLeft) {
    return styles.buttonAlignLeft;
  }
  return {};
}

function getBusyOverlayStyle(alt?: 'alt' | boolean) {
  if (alt) {
    return{
      ...styles.buttonBusyOvelay,
      ...styles.buttonAltBusyOvelay
    };
  }
  return styles.buttonBusyOvelay;
}

/**
 * Button base design.
 * @param param0
 */
const DefaultButton: React.FC<DefaultButtonProps> = function Button({
  style,
  onPress,
  disabled,
  children,
  isBusy,
  overlayStyle,
  onSizeChange,
  alt,
  alignLeft,
}) {
  const handleOnLayout = (ev: LayoutChangeEvent) => {
    const {width, height} = ev.nativeEvent.layout;
    if (onSizeChange) {
      onSizeChange({width, height});
    }
  };

  return (
    <TouchableHighlight
      underlayColor={alt ? '#fff' : colors.primary}
      disabled={disabled}
      onPress={onPress}
      style={{
        ...getBaseStyle(alt),
        ...getBusyStyle(isBusy, alt),
        ...getAlginStyle(alignLeft),
        ...(style || {}
      )}}
      activeOpacity={1}
      onLayout={handleOnLayout}
      testID='flw-default-button'>
      <>
        {children}
        {isBusy
          ? (<View
              style={{
                ...getBusyOverlayStyle(alt),
                ...(overlayStyle || {})
              }}
            />)
          : null}
      </>
    </TouchableHighlight>
  );
};

DefaultButton.defaultProps = {
  underlayColor: colors.primary,
}

const styles = StyleSheet.create({
  buttonBusyOvelay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  buttonAltBusyOvelay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonBusy: {
    borderColor: '#FBDBA7',
  },
  buttonAltBusy: {
    borderColor: '#D0D0D5',
  },
  buttonAlignLeft: {
    justifyContent: 'flex-start',
  },
  buttonAlt: {
    backgroundColor: '#fff',
    borderColor: colors.secondary,
  },
  button: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 52,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
});

export default DefaultButton;
