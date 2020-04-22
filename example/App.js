/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FlutterwaveButton} from './src';
import {colors} from './src/configs';
const TEST_OPTIONS = {
  txref: String(Date.now()),
  PBFPubKey: '[A Public Key]',
  customer_email: 'customer-email@example.com',
  amount: 100,
  currency: 'NGN',
  redirect_url: 'https://example.com/flutterwave',
  payment_options: "card,ussd,account,barter",
};

const App = () => {
  const [flwref, setFlwref] = React.useState(null);
  const [cancelled, setCanclled] = React.useState(false);
  const [trxref, setTrxref] = React.useState(null);
  const [options, setOptions] = React.useState(TEST_OPTIONS);
  const optionsSetter = () => {
    setOptions({
      ...TEST_OPTIONS,
      txref: 'TR' + Date.now() + '' + Math.ceil(Math.random() * 9000)
    });
  }
  const handleComplete = (data) => {
    optionsSetter();
    if (data.txref) {
      setTrxref(data.txref);
    }
    if (data.flref) {
      setFlwref(data.flref);
    }
    if (data.response) {
      setFlwref(data.response.flwRef);
      setTrxref(data.response.txRef);
    }
    setCanclled(data.cancelled);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safearea}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'padding', android: undefined})}
          style={styles.body}>
          <View style={styles.transactionInfoContainer}>
            <Text style={styles.transactionInfoHeading}>TRANSACTION INFO</Text>
            <Text style={styles.transactionInfo}>
              Reference: {trxref || ''}
            </Text>
            <Text style={styles.transactionInfo}>
              Flutterwave Ref: {flwref || ''}
            </Text>
            <Text style={styles.transactionInfo}>
              Cancelled: {cancelled ? 'YES' : 'NO'}
            </Text>
          </View>
          <FlutterwaveButton
            style={styles.paymentButton}
            onComplete={handleComplete}
            onError={(e) => Alert.alert(e.code, e.message)}
            options={options}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  transactionInfo: {
    marginBottom: 8,
    color: '#444',
    fontSize: 13,
  },
  transactionInfoHeading: {
    marginBottom: 16,
    color: '#000',
    fontSize: 18,
  },
  transactionInfoContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 48,
    justifyContent: 'center',
  },
  safearea: {
    flex: 1,
  },
  paymentButtonCustomBusy: {
    opacity: 0.3,
  },
  paymentButtonCustom: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.secondary,
  },
  paymentButton: {
    marginHorizontal: 24,
    marginBottom: 72,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
});

export default App;
