import React from 'react';
import { PayWithFlutterwavePropsBase } from './PaywithFlutterwaveBase';
import { FlutterwaveInitOptions } from './FlutterwaveInit';
export interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
}
export declare type PayWithFlutterwaveProps = PayWithFlutterwavePropsBase & {
    onRedirect: (data: RedirectParams) => void;
    options: Omit<FlutterwaveInitOptions, 'redirect_url'>;
};
declare const PayWithFlutterwave: React.FC<PayWithFlutterwaveProps>;
export default PayWithFlutterwave;
//# sourceMappingURL=PayWithFlutterwave.d.ts.map