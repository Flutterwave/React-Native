export const PaymentOptionsPropRule = (options: Array<string>) => (props:{[k: string]: any}, propName: string) => {
  // skip check if payment options is not defined
  if (props[propName] === undefined) {
    return null;
  }
  // if not an array of payment options
  if (typeof props[propName] !== 'string') {
    return new Error(
      '"payment_methods" should be a string.',
    );
  }
  const paymentOptionsList = props[propName].split(',');
  for (let i = 0; i < paymentOptionsList.length; i++) {
    if (
      options.findIndex(
        (j) => j.trim() === paymentOptionsList[i].trim(),
      ) === -1
    ) {
      return new Error(
        `"payment_options"(${
          props[propName]
        }) must be any of the following values.\n${options.map(
          (i, n) => `${n + 1}. ${i}\n`,
        ).join('')}`,
      );
    }
  }
  return null;
}
