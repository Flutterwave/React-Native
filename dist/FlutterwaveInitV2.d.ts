/// <reference types="react-native" />
import { Currency, FlutterwaveInitSubAccount } from './FlutterwaveInit';
export interface FlutterwaveInitOptionsBase {
    amount: number;
    currency?: Currency;
    integrity_hash?: string;
    payment_options?: string;
    payment_plan?: number;
    redirect_url: string;
    subaccounts?: Array<FlutterwaveInitSubAccount>;
}
export interface FieldError {
    field: string;
    message: string;
}
interface FlutterwavePaymentMetaV2 {
    metaname: string;
    metavalue: string;
}
export declare type FlutterwaveInitV2Options = FlutterwaveInitOptionsBase & {
    txref: string;
    PBFPubKey: string;
    customer_firstname?: string;
    customer_lastname?: string;
    customer_phone?: string;
    customer_email: string;
    country?: string;
    pay_button_text?: string;
    custom_title?: string;
    custom_description?: string;
    custom_logo?: string;
    meta?: Array<FlutterwavePaymentMetaV2>;
};
/**
 * This function is responsible for making the request to
 * initialize a Flutterwave payment.
 * @param options FlutterwaveInitOptions
 * @return Promise<{
 *  error: {
 *    code: string;
 *    message: string;
 *  } | null;
 *  link?: string | null;
 * }>
 */
export default function FlutterwaveInitV2(options: FlutterwaveInitV2Options, abortController?: AbortController): Promise<string>;
export {};
//# sourceMappingURL=FlutterwaveInitV2.d.ts.map