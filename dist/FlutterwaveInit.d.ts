import FlutterwaveInit from './v3/FlutterwaveInit';
export interface FlutterwaveInitSubAccount {
    id: string;
    transaction_split_ratio?: number;
    transaction_charge_type?: string;
    transaction_charge?: number;
}
export interface FlutterwaveInitOptionsBase {
    amount: number;
    currency?: string;
    integrity_hash?: string;
    payment_options?: string;
    payment_plan?: number;
    redirect_url: string;
    subaccounts?: Array<FlutterwaveInitSubAccount>;
}
export default FlutterwaveInit;
//# sourceMappingURL=FlutterwaveInit.d.ts.map