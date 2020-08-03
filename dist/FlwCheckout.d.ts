import React from 'react';
export interface FlwCheckoutProps {
    onRedirect?: (data: any) => void;
    onAbort?: () => void;
    link?: string;
    visible?: boolean;
}
interface FlwCheckoutErrorProps {
    hasLink: boolean;
    onTryAgain: () => void;
}
declare const FlwCheckout: React.FC<FlwCheckoutProps>;
export declare const FlwCheckoutError: React.FC<FlwCheckoutErrorProps>;
export default FlwCheckout;
//# sourceMappingURL=FlwCheckout.d.ts.map