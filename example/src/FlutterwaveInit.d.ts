/// <reference types="react-native" />
declare type FlutterwavePaymentMeta = {
    metaname: string;
    metavalue: string;
};
export interface FlutterwaveInitOptions {
    txref: string;
    PBFPubKey: string;
    customer_firstname?: string;
    customer_lastname?: string;
    customer_phone?: string;
    customer_email: string;
    amount: number;
    currency: string;
    redirect_url: string;
    payment_options?: string;
    payment_plan?: number;
    subaccounts?: Array<number>;
    country?: string;
    pay_button_text?: string;
    custom_title?: string;
    custom_description?: string;
    custom_logo?: string;
    meta?: Array<FlutterwavePaymentMeta>;
}
interface FlutterwaveInitConfig {
    canceller?: AbortController;
}
export interface FlutterwaveInitError {
    code: string;
    message: string;
}
interface FlutterwaveInitResult {
    error?: FlutterwaveInitError | null;
    link?: string | null;
}
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
export default function FlutterwaveInit(options: FlutterwaveInitOptions, config?: FlutterwaveInitConfig): Promise<FlutterwaveInitResult>;
/**
 * Flutterwave Init Error
 */
export declare class FlutterwaveInitException extends Error {
    /**
     * Error code
     * @var string
     */
    code: string;
    /**
     * Constructor Method
     * @param props {message?: string; code?: string}
     */
    constructor(props: {
        message: string;
        code: string;
    });
}
export {};
//# sourceMappingURL=FlutterwaveInit.d.ts.map