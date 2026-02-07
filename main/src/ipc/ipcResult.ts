export type IpcErrorCode =
  | "VALIDATION_ERROR"
  | "PRODUCT_NOT_FOUND"
  | "SKU_ALREADY_EXISTS"
  | "DB_ERROR";

export type IpcSuccess<T> = { ok: true; data: T };
export type IpcFailure = { ok: false; error: { code: IpcErrorCode; message: string } };
export type IpcResult<T> = IpcSuccess<T> | IpcFailure;

export function ok<T>(data: T): IpcSuccess<T> {
  return { ok: true, data };
}

export function err(code: IpcErrorCode, message: string): IpcFailure {
  return { ok: false, error: { code, message } };
}
