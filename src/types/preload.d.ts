import type { Product, ProductCreate, ProductQuery, ProductUpdate } from "../../shared/product";

export type IpcErrorCode =
  | "VALIDATION_ERROR"
  | "PRODUCT_NOT_FOUND"
  | "SKU_ALREADY_EXISTS"
  | "DB_ERROR";

export type IpcSuccess<T> = { ok: true; data: T };
export type IpcFailure = { ok: false; error: { code: IpcErrorCode; message: string } };
export type IpcResult<T> = IpcSuccess<T> | IpcFailure;

declare global {
  interface Window {
    api: {
      products: {
        list: (query?: ProductQuery) => Promise<IpcResult<Product[]>>;
        get: (id: number) => Promise<IpcResult<Product | null>>;
        create: (input: ProductCreate) => Promise<IpcResult<Product>>;
        update: (input: ProductUpdate) => Promise<IpcResult<Product>>;
        setStatus: (id: number, status: "ACTIVE" | "INACTIVE") => Promise<IpcResult<Product>>;
        delete: (id: number) => Promise<IpcResult<void>>;
      };
    };
  }
}

export {};
