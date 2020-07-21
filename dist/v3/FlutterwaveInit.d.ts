/// <reference types="react-native" />
import { FlutterwaveInitOptionsBase } from '../FlutterwaveInit';
interface FlutterwavePaymentMeta {
    [k: string]: any;
}
export interface FlutterwaveInitCustomer {
    email: string;
    phonenumber?: string;
    name?: string;
}
export interface FlutterwaveInitCustomizations {
    title?: string;
    logo?: string;
    description?: string;
}
export declare type FlutterwaveInitOptions = FlutterwaveInitOptionsBase & {
    authorization: string;
    tx_ref: string;
    customer: FlutterwaveInitCustomer;
    meta?: Array<FlutterwavePaymentMeta>;
    customizations?: FlutterwaveInitCustomizations;
};
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