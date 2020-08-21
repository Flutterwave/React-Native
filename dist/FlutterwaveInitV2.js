var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import FlutterwaveInitError from './utils/FlutterwaveInitError';
import { STANDARD_URL_V2 } from './configs';
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
export default function FlutterwaveInitV2(options, abortController) {
    return __awaiter(this, void 0, void 0, function () {
        var body, headers, fetchOptions, response, responseJSON, e_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    body = __assign({}, options);
                    headers = new Headers;
                    headers.append('Content-Type', 'application/json');
                    fetchOptions = {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: headers
                    };
                    // add abort controller if defined
                    if (abortController) {
                        fetchOptions.signal = abortController.signal;
                    }
                    ;
                    return [4 /*yield*/, fetch(STANDARD_URL_V2, fetchOptions)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    responseJSON = _a.sent();
                    // check if data is missing from response
                    if (!responseJSON.data) {
                        throw new FlutterwaveInitError({
                            code: 'STANDARD_INIT_ERROR',
                            message: responseJSON.message || 'An unknown error occured!'
                        });
                    }
                    // check if the link is missing in data
                    if (!responseJSON.data.link) {
                        throw new FlutterwaveInitError({
                            code: responseJSON.data.code || 'MALFORMED_RESPONSE',
                            message: responseJSON.data.message || 'An unknown error occured!'
                        });
                    }
                    // resolve with the payment link
                    return [2 /*return*/, Promise.resolve(responseJSON.data.link)];
                case 3:
                    e_1 = _a.sent();
                    error = e_1 instanceof FlutterwaveInitError
                        ? e_1
                        : new FlutterwaveInitError({ message: e_1.message, code: e_1.name.toUpperCase() });
                    // resolve with error
                    return [2 /*return*/, Promise.reject(error)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
