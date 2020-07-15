import {STANDARD_URL} from './configs';

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
  public_key: string;
  tx_ref: string;
  amount: number;
  currency?: string;
  integrity_hash?: string;
  payment_options: string;
  payment_plan?: number;
  redirect_url: string;
  customer: InitCustomer;
  subaccounts?: Array<number>;
  meta?: Array<FlutterwavePaymentMeta>;
  customizations: InitCustomizations;
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
