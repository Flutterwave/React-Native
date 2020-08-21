import React from 'react';
import { PayWithFlutterwavePropsBase } from './PaywithFlutterwaveBase';
import { FlutterwaveInitV2Options } from './FlutterwaveInitV2';
export interface RedirectParamsV2 {
    cancelled?: 'true' | 'false';
    flwref?: string;
    txref: string;
}
export declare type PayWithFlutterwaveV2Props = PayWithFlutterwavePropsBase & {
    onRedirect: (data: RedirectParamsV2) => void;
    options: Omit<FlutterwaveInitV2Options, 'redirect_url'>;
};
declare const PayWithFlutterwaveV2: React.FC<PayWithFlutterwaveV2Props>;
export default PayWithFlutterwaveV2;
//# sourceMappingURL=PayWithFlutterwaveV2.d.ts.map