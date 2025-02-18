import Decimal from "decimal.js";

export const shortenAddress = (address: string, size = 4) => {
  return `${address.substring(0, size + 2)}...${address.substring(address.length - size, address.length)}`;
};

/**
 * Convert a token amount to a human readable amount by dividing by 10^decimals
 * @param value - The token amount to convert
 * @param decimalPlaces - The number of decimal places to round to (default: 2)
 * @returns The human readable amount
 */
export function toHumanAmount(
  value: string | bigint,
  decimal: number,
  decimalPlaces = 2,
) {
  const _value = value.toString();
  return new Decimal(_value)
    .div(new Decimal(10).pow(decimal))
    .toFixed(decimalPlaces, Decimal.ROUND_DOWN);
}

/**
 * Convert a human readable amount to a token amount by multiplying by 10^decimals
 * @param value - The human readable amount to convert
 * @returns The token amount
 */
export function fromHumanAmount(value: string | number, decimal: number) {
  Decimal.set({ toExpPos: 36 });
  return new Decimal(value).mul(new Decimal(10).pow(decimal));
}

export function parseAddressFromTopic(topic: string) {
  return "0x" + topic.slice(26);
}
