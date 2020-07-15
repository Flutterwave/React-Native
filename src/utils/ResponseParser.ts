import { ResponseData } from "../FlutterwaveInit";
import FlutterwaveInitError from "./FlutterwaveInitError";

type ParsedSuccess = string;

/**
 * The purpose of this function is to parse the response message gotten from a
 * payment initialization error.
 * @param message string
 * @param code string (optional)
 * @returns {message: string; code: string}
 */
export default function ResponseParser(
  {
    status,
    errors,
    message,
    data,
    code,
    error_id,
  }: ResponseData
): FlutterwaveInitError | ParsedSuccess {
  // return success message
  if (status === 'success') {
    // check if data or data link is missing
    if (!data || !data.link) {
      return new FlutterwaveInitError({
        code: 'MALFORMED_RESPONSE',
        message,
      })
    }
    // return the payment link
    return data.link;
  }
  // missing authorization
  if (/authorization/i.test(message) && /required/i.test(message)) {
    return new FlutterwaveInitError({
      code: 'AUTH_MISSING',
      message,
    });
  }
  // invalid authorization
  if (/authorization/i.test(message) && /invalid/i.test(message)) {
    return new FlutterwaveInitError({
      code: 'AUTH_INVALID',
      message,
    });
  }
  // field errors
  if (errors) {
    return new FlutterwaveInitError({
      code: 'INVALID_OPTIONS',
      message,
      errors: errors.map(i => i.message),
    });
  }
  // defaults to the initially passed message
  return new FlutterwaveInitError({
    code: String(code || 'UNKNOWN').toUpperCase(),
    message,
    errorId: error_id
  });
}
