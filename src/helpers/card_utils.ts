import CardNetwork from '../models/card_network';
import { inMadaRange } from './mada_util';

export const getCardNetworkFromNumber = (input: string): CardNetwork => {
  if (inMadaRange(input)) {
    return CardNetwork.mada;
  } else if (new RegExp('[4]').test(input)) {
    return CardNetwork.visa;
  } else if (
    new RegExp(
      '((5[1-5])|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720))'
    ).test(input)
  ) {
    return CardNetwork.master;
  } else if (new RegExp('((34)|(37))').test(input)) {
    return CardNetwork.amex;
  }

  return CardNetwork.unknown;
};
