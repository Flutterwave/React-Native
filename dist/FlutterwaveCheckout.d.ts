import React from 'react';
export interface FlutterwaveCheckoutProps {
    onRedirect?: (data: any) => void;
    onAbort?: () => void;
    link?: string;
    visible?: boolean;
}
interface FlutterwaveCheckoutErrorProps {
    hasLink: boolean;
    onTryAgain: () => void;
}
declare const FlutterwaveCheckout: React.FC<FlutterwaveCheckoutProps>;
export declare const FlutterwaveCheckoutError: React.FC<FlutterwaveCheckoutErrorProps>;
export default FlutterwaveCheckout;
//# sourceMappingURL=FlutterwaveCheckout.d.ts.map