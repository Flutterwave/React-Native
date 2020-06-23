import React from 'react';
import { ViewStyle } from "react-native";
interface DefaultButtonProps {
    style?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
    children: React.ReactElement;
    isBusy?: boolean;
    onSizeChange?: (ev: {
        width: number;
        height: number;
    }) => void;
    alignLeft?: 'alignLeft' | boolean;
}
/**
 * Button base design.
 * @param param0
 */
declare const DefaultButton: React.FC<DefaultButtonProps>;
export default DefaultButton;
//# sourceMappingURL=DefaultButton.d.ts.map