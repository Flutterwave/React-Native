import { ResponseData } from "../FlutterwaveInit";
/**
 * The purpose of this function is to parse the response message gotten from a
 * payment initialization error.
 * @param message string
 * @param code string (optional)
 * @returns {message: string; code: string}
 */
export default function ResponseParser({ status, errors, message, data, code, error_id, }: ResponseData): Promise<string>;
//# sourceMappingURL=ResponseParser.d.ts.map