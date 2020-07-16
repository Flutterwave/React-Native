import FlutterwaveInitError from "./FlutterwaveInitError";
/**
 * The purpose of this function is to parse the response message gotten from a
 * payment initialization error.
 * @param message string
 * @param code string (optional)
 * @returns {message: string; code: string}
 */
export default function ResponseParser(_a) {
    var status = _a.status, errors = _a.errors, message = _a.message, data = _a.data, code = _a.code, error_id = _a.error_id;
    return new Promise(function (resolve, reject) {
        // return success message
        if (status === 'success') {
            // check if data or data link is missing
            if (!data || !data.link) {
                return reject(new FlutterwaveInitError({
                    code: 'MALFORMED_RESPONSE',
                    message: message
                }));
            }
            // return the payment link
            return resolve(data.link);
        }
        // missing authorization
        if (/authorization/i.test(message) && /required/i.test(message)) {
            reject(new FlutterwaveInitError({
                code: 'AUTH_MISSING',
                message: message
            }));
        }
        // invalid authorization
        if (/authorization/i.test(message) && /invalid/i.test(message)) {
            reject(new FlutterwaveInitError({
                code: 'AUTH_INVALID',
                message: message
            }));
        }
        // field errors
        if (errors) {
            reject(new FlutterwaveInitError({
                code: 'INVALID_OPTIONS',
                message: message,
                errors: errors.map(function (i) { return i.message; })
            }));
        }
        // defaults to the initially passed message
        reject(new FlutterwaveInitError({
            code: String(code || 'STANDARD_INIT_ERROR').toUpperCase(),
            message: message,
            errorId: error_id
        }));
    });
}
