import PropTypes from 'prop-types';
import FlutterwaveButton from './v3/FlutterwaveButton';
export var OptionsPropTypeBase = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.oneOf(['GBP', 'NGN', 'USD', 'GHS', 'KES', 'ZAR', 'TZS']),
    payment_plan: PropTypes.number,
    subaccounts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        transaction_split_ratio: PropTypes.number,
        transaction_charge_type: PropTypes.string,
        transaction_charge: PropTypes.number
    })),
    integrity_hash: PropTypes.string
};
export default FlutterwaveButton;
