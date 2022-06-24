// Typings
import { EventABI } from "typings/abi";

type ABI = Record<string, any>[];

export default (eventName: string, abi: ABI) => {
  return abi.find(({ name, type }) => {
    return type === "event" && name === eventName
  }) as EventABI;
}