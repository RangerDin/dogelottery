import { WEB3_ERROR_CODE } from "./declarations";

export default class Web3Error extends Error {
  code: WEB3_ERROR_CODE;

  constructor(message: string, code = WEB3_ERROR_CODE.SOMETHING_WRONG) {
    super(message);
    this.name = "Web3Error";
    this.code = code;
  }

  toString(): string {
    return `${this.name}: ${this.code}`;
  }
}
