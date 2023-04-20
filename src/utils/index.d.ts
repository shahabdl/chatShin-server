import { UserDataType } from "./types";

export {}

declare global {
  namespace Express {
    export interface Request {
      userData?: UserDataType;
    }
  }
}
