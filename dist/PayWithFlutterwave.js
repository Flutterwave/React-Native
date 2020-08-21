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
import FlutterwaveInit from './FlutterwaveInit';
import { PAYMENT_OPTIONS } from './configs';
import { PaymentOptionsPropRule } from './utils/CustomPropTypesRules';
import PayWithFlutterwaveBase from './PaywithFlutterwaveBase';
// create V3 component
var PayWithFlutterwave = function (_a) {
    var options = _a.options, props = __rest(_a, ["options"]);
    return (<PayWithFlutterwaveBase {...props} reference={options.tx_ref} options={options} init={FlutterwaveInit}/>);
};
// define component prop types
PayWithFlutterwave.propTypes = __assign(__assign({}, PayWithFlutterwavePropTypesBase), { 
    // @ts-ignore
    options: PropTypes.shape(__assign(__assign({}, OptionsPropTypeBase), { authorization: PropTypes.string.isRequired, tx_ref: PropTypes.string.isRequired, payment_options: PaymentOptionsPropRule(PAYMENT_OPTIONS), customer: PropTypes.shape({
            name: PropTypes.string,
            phonenumber: PropTypes.string,
            email: PropTypes.string.isRequired
        }).isRequired, meta: PropTypes.object, customizations: PropTypes.shape({
            title: PropTypes.string,
            logo: PropTypes.string,
            description: PropTypes.string
        }) })).isRequired });
// export component as default
export default PayWithFlutterwave;
