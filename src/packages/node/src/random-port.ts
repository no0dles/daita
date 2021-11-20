import { randomNumber } from '@daita/common';

const minPort = 49152;
const maxPort = 65535;

export function getRandomTestPort() {
  return randomNumber(minPort, maxPort);
}
