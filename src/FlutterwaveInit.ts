import {STANDARD_URL} from './configs';

type FlutterwavePaymentMeta = {
  metaname: string;
  metavalue: string;
}

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
  config: FlutterwaveInitConfig = {},
): Promise<FlutterwaveInitResult> {
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

    // add canceller if defined
    if (config.canceller) {
      fetchOptions.signal = config.canceller.signal
    };

    // make http request
    const response = await fetch(STANDARD_URL, fetchOptions);

    // get response json
    const responseJSON: ResponseJSON = await response.json();

    // check if data is missing from response
    if (!responseJSON.data) {
      throw new FlutterwaveInitException({
        code: 'NODATA',
        message: responseJSON.message || 'An unknown error occured!',
      });
    }

    // check if the link is missing in data
    if (!responseJSON.data.link) {
      throw new FlutterwaveInitException({
        code: responseJSON.data.code || 'UNKNOWN',
        message: responseJSON.data.message || 'An unknown error occured!',
      });
    }

    // resolve with the payment link
    return Promise.resolve({
      link: responseJSON.data.link,
    });
  } catch (e) {
    // resolve with error
    return Promise.resolve({
      error: {
        code:
          e instanceof FlutterwaveInitException
            ? e.code
            : String(e.name).toUpperCase(),
        message: e.message,
      }
    });
  }
}

/**
 * Flutterwave Init Error
 */
export class FlutterwaveInitException extends Error {
  /**
   * Error code
   * @var string
   */
  code: string;

  /**
   * Constructor Method
   * @param props {message?: string; code?: string}
   */
  constructor(props: {message: string; code: string}) {
    super(props.message);
    this.code = props.code;
  }
}
