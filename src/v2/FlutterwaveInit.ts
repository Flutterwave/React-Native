import {STANDARD_URL_V2} from '../configs';
import {FlutterwaveInitOptionsBase} from '../FlutterwaveInit';
import FlutterwaveInitError from '../utils/FlutterwaveInitError';

interface FlutterwavePaymentMetaV2 {
  metaname: string;
  metavalue: string;
}

export type FlutterwaveInitOptions = FlutterwaveInitOptionsBase & {
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
}

interface ResponseJSON {
  status: 'success' | 'error';
  message: string;
  data: {
    link?: string;
    code?: string;
    message?: string;
  };
}

interface FetchOptions {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body: string;
  headers: Headers;
  signal?: AbortSignal; 
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
export default async function FlutterwaveInit(
  options: FlutterwaveInitOptions,
  abortController?: AbortController,
): Promise<string> {
  try {
    // make request body
    const body = {...options};
    // make request headers
    const headers = new Headers;
    headers.append('Content-Type', 'application/json');
    // make fetch options
    const fetchOptions: FetchOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    }
    // add abort controller if defined
    if (abortController) {
      fetchOptions.signal = abortController.signal
    };
    // make http request
    const response = await fetch(STANDARD_URL_V2, fetchOptions);
    // get response json
    const responseJSON: ResponseJSON = await response.json();
    // check if data is missing from response
    if (!responseJSON.data) {
      throw new FlutterwaveInitError({
        code: 'NODATA',
        message: responseJSON.message || 'An unknown error occured!',
      });
    }
    // check if the link is missing in data
    if (!responseJSON.data.link) {
      throw new FlutterwaveInitError({
        code: responseJSON.data.code || 'UNKNOWN',
        message: responseJSON.data.message || 'An unknown error occured!',
      });
    }
    // resolve with the payment link
    return Promise.resolve(responseJSON.data.link);
  } catch (e) {
    // always return a flutterwave init error
    const error = e instanceof FlutterwaveInitError
     ? e
     : new FlutterwaveInitError({message: e.message, code: e.name.toUpperCase()})
    // resolve with error
    return Promise.reject(error);
  }
}
