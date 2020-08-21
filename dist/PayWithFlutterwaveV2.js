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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import PropTypes from 'prop-types';
import { OptionsPropTypeBase, PayWithFlutterwavePropTypesBase } from './PaywithFlutterwaveBase';
import FlutterwaveInitV2 from './FlutterwaveInitV2';
import { PAYMENT_OPTIONS_V2 } from './configs';
import { PaymentOptionsPropRule } from './utils/CustomPropTypesRules';
import PayWithFlutterwaveBase from './PaywithFlutterwaveBase';
// create V2 component
var PayWithFlutterwaveV2 = function (_a) {
    var options = _a.options, props = __rest(_a, ["options"]);
    return (<PayWithFlutterwaveBase {...props} reference={options.txref} options={options} init={FlutterwaveInitV2}/>);
};
// define component prop types
PayWithFlutterwaveV2.propTypes = __assign(__assign({}, PayWithFlutterwavePropTypesBase), { 
    // @ts-ignore
    options: PropTypes.shape(__assign(__assign({}, OptionsPropTypeBase), { payment_options: PaymentOptionsPropRule(PAYMENT_OPTIONS_V2), txref: PropTypes.string.isRequired, PBFPubKey: PropTypes.string.isRequired, customer_firstname: PropTypes.string, customer_lastname: PropTypes.string, customer_email: PropTypes.string.isRequired, customer_phone: PropTypes.string, country: PropTypes.string, pay_button_text: PropTypes.string, custom_title: PropTypes.string, custom_description: PropTypes.string, custom_logo: PropTypes.string, meta: PropTypes.arrayOf(PropTypes.shape({
            metaname: PropTypes.string,
            metavalue: PropTypes.string
        })) })).isRequired });
// export component as default
export default PayWithFlutterwaveV2;
