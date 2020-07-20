/// <reference types="react-native" />
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
export interface FlutterwaveInitSubAccount {
    id: string;
    transaction_split_ratio?: number;
    transaction_charge_type?: string;
    transaction_charge?: number;
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
    customer: FlutterwaveInitCustomer;
    subaccounts?: Array<FlutterwaveInitSubAccount>;
    meta?: Array<FlutterwavePaymentMeta>;
    customizations?: FlutterwaveInitCustomizations;
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