/**
 * Flutterwave Init Error
 */
export default class FlutterwaveInitError extends Error {
    /**
     * Error code
     * @var string
     */
    code: string;
    /**
    * Error code
    * @var string
    */
    errorId?: string;
    /**
    * Error code
    * @var string
    */
    errors?: Array<string>;
    /**
     * Constructor Method
     * @param props {message?: string; code?: string}
     */
    constructor(props: {
        message: string;
        code: string;
        errorId?: string;
        errors?: Array<string>;
    });
}
//# sourceMappingURL=FlutterwaveInitError.d.ts.map