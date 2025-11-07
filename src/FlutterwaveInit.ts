import FlutterwaveInitError from './utils/FlutterwaveInitError';
import ResponseParser from './utils/ResponseParser';
import {STANDARD_URL} from './configs';

export type Currency =
  'AED'| 'ALL'| 'ARS'| 'AUD'| 'BGN'| 'BHD'| 'BIF'| 'BND'| 'BRL'| 'BWP'| 'CAD'| 'CDF'| 'CFA'| 'CHF'|
  'CLP'| 'CNY'| 'COP'| 'CRC'| 'CVE'| 'CZK'| 'DJF'| 'DKK'| 'DOP'| 'DZD'| 'EGP'| 'ETB'| 'EUR'| 'GBP'|
  'GHS'| 'GMD'| 'GNF'| 'GTQ'| 'HKD'| 'HNL'| 'HUF'| 'IDR'| 'ILS'| 'INR'| 'IQD'| 'ISK'| 'JOD'| 'JPY'|
  'KES'| 'KHR'| 'KMF'| 'KRW'| 'KWD'| 'LBP'| 'LKR'| 'LRD'| 'LYD'| 'MAD'| 'MOP'| 'MUR'| 'MWK'| 'MXN'|
  'MYR'| 'MZN'| 'NGN'| 'NOK'| 'NZD'| 'OMR'| 'PAB'| 'PEN'| 'PHP'| 'PLN'| 'PYG'| 'QAR'| 'RUB'| 'RWF'|
  'SAR'| 'SDD'| 'SEK'| 'SGD'| 'SLL'| 'STD'| 'SVC'| 'SYP'| 'THB'| 'TND'| 'TRY'| 'TWD'| 'TZS'| 'UGX'|
  'USD'| 'UYI'| 'VEF'| 'VND'| 'VUV'| 'XAF'| 'XOF'| 'XPF'| 'YER'| 'ZAR'| 'ZMK'| 'ZMW'| 'ZWD';

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

interface FetchOptions {
  method: 'POST';
  body: string;
  headers: Headers;
  signal?: AbortSignal; 
}

/**
 * This function is responsible for making the request to
 * initialize a Flutterwave payment.
 * @param options FlutterwaveInitOptions
 * @param abortController AbortController
 * @return Promise<string>
 */
export default async function FlutterwaveInit(
  options: FlutterwaveInitOptions,
  abortController?: AbortController,
): Promise<string> {
  try {
    // get request body and authorization
    const {authorization, ...body} = options;
    // make request headers
    const headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization',  `Bearer ${authorization}`);
    // make fetch options
    const fetchOptions: FetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    }
    // add abortController if defined
    if (abortController) {
      fetchOptions.signal = abortController.signal
    };
    // initialize payment
    const response = await fetch(STANDARD_URL, fetchOptions);
    // get response data
    const responseData: ResponseData = await response.json();
    // resolve with the payment link
    return Promise.resolve(await ResponseParser(responseData));
  } catch (e) {
    const errorObject = e as Error;
    // always return a flutterwave init error
    const error = e instanceof FlutterwaveInitError
      ? errorObject
      : new FlutterwaveInitError({message: errorObject.message, code: errorObject.name.toUpperCase()})
    // resolve with error
    return Promise.reject(error);
  }
}
