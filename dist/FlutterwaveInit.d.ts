export type Currency = 'AED' | 'ALL' | 'ARS' | 'AUD' | 'BGN' | 'BHD' | 'BIF' | 'BND' | 'BRL' | 'BWP' | 'CAD' | 'CDF' | 'CFA' | 'CHF' | 'CLP' | 'CNY' | 'COP' | 'CRC' | 'CVE' | 'CZK' | 'DJF' | 'DKK' | 'DOP' | 'DZD' | 'EGP' | 'ETB' | 'EUR' | 'GBP' | 'GHS' | 'GMD' | 'GNF' | 'GTQ' | 'HKD' | 'HNL' | 'HUF' | 'IDR' | 'ILS' | 'INR' | 'IQD' | 'ISK' | 'JOD' | 'JPY' | 'KES' | 'KHR' | 'KMF' | 'KRW' | 'KWD' | 'LBP' | 'LKR' | 'LRD' | 'LYD' | 'MAD' | 'MOP' | 'MUR' | 'MWK' | 'MXN' | 'MYR' | 'MZN' | 'NGN' | 'NOK' | 'NZD' | 'OMR' | 'PAB' | 'PEN' | 'PHP' | 'PLN' | 'PYG' | 'QAR' | 'RUB' | 'RWF' | 'SAR' | 'SDD' | 'SEK' | 'SGD' | 'SLL' | 'STD' | 'SVC' | 'SYP' | 'THB' | 'TND' | 'TRY' | 'TWD' | 'TZS' | 'UGX' | 'USD' | 'UYI' | 'VEF' | 'VND' | 'VUV' | 'XAF' | 'XOF' | 'XPF' | 'YER' | 'ZAR' | 'ZMK' | 'ZMW' | 'ZWD';
export interface FlutterwaveInitSubAccount {
    id: string;
    transaction_split_ratio?: number;
    transaction_charge_type?: string;
    transaction_charge?: number;
}
export interface FlutterwaveInitOptionsBase {
    amount: number;
    currency?: Currency;
    integrity_hash?: string;
    payment_options?: string;
    payment_plan?: number;
    redirect_url: string;
    subaccounts?: Array<FlutterwaveInitSubAccount>;
}
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
export type FlutterwaveInitOptions = FlutterwaveInitOptionsBase & {
    authorization: string;
    tx_ref: string;
    customer: FlutterwaveInitCustomer;
    meta?: FlutterwavePaymentMeta | null;
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