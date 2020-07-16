/// <reference types="react-native" />
interface FlutterwavePaymentMeta {
    [k: string]: any;
}
export interface InitCustomer {
    email: string;
    phonenumber?: string;
    name?: string;
}
export interface InitCustomizations {
    title?: string;
    logo?: string;
    description?: string;
}
export interface FlutterwaveInitOptions {
    authorization: string;
    tx_ref: string;
    amount: number;
    currency: string;
    integrity_hash?: string;
    payment_options?: string;
    payment_plan?: number;
    redirect_url: string;
    customer: InitCustomer;
    subaccounts?: Array<number>;
    meta?: Array<FlutterwavePaymentMeta>;
    customizations?: InitCustomizations;
}
export interface FieldError {
    field: string;
    message: string;
}
export interface ResponseData {
    status?: 'success' | 'error';
    message: string;
    error_id?: string;
    errors?: Array<FieldError>;
    code?: string;
    data?: {
        link: string;
    };
}
/**
 * This function is responsible for making the request to
 * initialize a Flutterwave payment.
 * @param options FlutterwaveInitOptions
 * @param abortController AbortController
 * @return Promise<string>
 */
export default function FlutterwaveInit(options: FlutterwaveInitOptions, abortController?: AbortController): Promise<string>;
export {};
//# sourceMappingURL=FlutterwaveInit.d.ts.map