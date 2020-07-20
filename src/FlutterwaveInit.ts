import {STANDARD_URL} from './configs';
import ResponseParser from './utils/ResponseParser';
import FlutterwaveInitError from './utils/FlutterwaveInitError';

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
    // always return a flutterwave init error
    const error = e instanceof FlutterwaveInitError
      ? e
      : new FlutterwaveInitError({message: e.message, code: e.name.toUpperCase()})
    // resolve with error
    return Promise.reject(error);
  }
}
