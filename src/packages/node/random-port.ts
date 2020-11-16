import { randomNumber } from '../common/utils/random-string';

const minPort = 49152;
const maxPort = 65535;

export function getRandomTestPort() {
  return randomNumber(minPort, maxPort);
}
