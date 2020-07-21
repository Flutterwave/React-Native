/// <reference types="react-native" />
import { FlutterwaveInitOptionsBase } from '../FlutterwaveInit';
interface FlutterwavePaymentMetaV2 {
    metaname: string;
    metavalue: string;
}
export declare type FlutterwaveInitOptions = FlutterwaveInitOptionsBase & {
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
export default function FlutterwaveInit(options: FlutterwaveInitOptions, abortController?: AbortController): Promise<string>;
export {};
//# sourceMappingURL=FlutterwaveInit.d.ts.map