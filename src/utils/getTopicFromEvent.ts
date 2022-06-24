// typings
import { EventABI } from "typings/abi";

export default (event: EventABI) => {
  const params = event.inputs.map(input => input.internalType).join(',');
  const { name } = event;

  return `${name}(${params})`;
}