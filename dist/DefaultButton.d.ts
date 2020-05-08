import React from 'react';
import { ViewStyle } from "react-native";
interface DefaultButtonProps {
    style?: ViewStyle;
    textStyle?: any;
    overlayStyle?: any;
    onPress?: () => void;
    disabled?: boolean;
    underlayColor?: string;
    children: React.ReactElement;
    isBusy?: boolean;
    onSizeChange?: (props: {
        width: number;
        height: number;
    }) => void;
    alt?: 'alt' | boolean;
    alignLeft?: 'alignLeft' | boolean;
}
/**
 * Button base design.
 * @param param0
 */
declare const DefaultButton: React.FC<DefaultButtonProps>;
export default DefaultButton;
//# sourceMappingURL=DefaultButton.d.ts.map