import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
  TouchableHighlight,
  StyleProp,
} from "react-native";
import {colors} from './configs';

interface DefaultButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  isBusy?: boolean;
  onSizeChange?: (ev: {width: number; height: number}) => void;
  alignLeft?: 'alignLeft' | boolean,
}

function getBusyStyle(isBusy?: 'isBusy' | boolean) {
  if (!isBusy) {
    return {};
  }
  return styles.buttonBusy;
}

function getAlginStyle(alignLeft?: 'alignLeft' | boolean) {
  if (alignLeft) {
    return styles.buttonAlignLeft;
  }
  return {};
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
  onSizeChange,
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
      underlayColor={colors.primary}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        getBusyStyle(isBusy),
        getAlginStyle(alignLeft),
        style
      ]}
      activeOpacity={1}
      onLayout={handleOnLayout}
      testID='flw-default-button'>
      <>
        {children}
        {isBusy
          ? (<View style={styles.buttonBusyOvelay} />)
          : null}
      </>
    </TouchableHighlight>
  );
};

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
