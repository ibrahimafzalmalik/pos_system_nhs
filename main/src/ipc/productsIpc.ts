import { ipcMain } from "electron";
import { ZodError } from "zod";
import { z } from "zod";
import {
  ProductCreateSchema,
  ProductQuerySchema,
  ProductUpdateSchema,
} from "../../../shared/product";
import { Status } from "../../../shared/product";
import { productsRepo } from "../db/productsRepo";
import { err, ok, type IpcErrorCode } from "./ipcResult";

const IdSchema = z.object({ id: z.number() });
const SetStatusSchema = z.object({
  id: z.number(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

function mapError(e: unknown): { code: IpcErrorCode; message: string } {
  if (e instanceof ZodError) {
    const msg = e.errors.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ");
    return { code: "VALIDATION_ERROR", message: msg };
  }
  if (e instanceof Error) {
    if (e.message === "PRODUCT_NOT_FOUND") return { code: "PRODUCT_NOT_FOUND", message: e.message };
    if (e.message === "SKU_ALREADY_EXISTS") return { code: "SKU_ALREADY_EXISTS", message: e.message };
    if (e.message === "PRODUCT_HAS_QUANTITY")
      return { code: "DB_ERROR", message: "Product has quantity and cannot be deleted." };
    return { code: "DB_ERROR", message: e.message };
  }
  return { code: "DB_ERROR", message: String(e) };
}

export function registerProductsIpc(): void {
  ipcMain.handle("products:list", async (_event, raw: unknown) => {
    try {
      const args = ProductQuerySchema.parse(raw ?? {});
      const data = productsRepo.listProducts(args);
      return ok(data);
    } catch (e) {
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });

  ipcMain.handle("products:get", async (_event, raw: unknown) => {
    try {
      const { id } = IdSchema.parse(raw);
      const data = productsRepo.getProductById(id);
      if (data === null) return err("PRODUCT_NOT_FOUND", "Product not found.");
      return ok(data);
    } catch (e) {
      if (e instanceof ZodError) {
        const msg = e.errors.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ");
        return err("VALIDATION_ERROR", msg);
      }
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });

  ipcMain.handle("products:create", async (_event, raw: unknown) => {
    try {
      const args = ProductCreateSchema.parse(raw);
      const data = productsRepo.createProduct(args);
      return ok(data);
    } catch (e) {
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });

  ipcMain.handle("products:update", async (_event, raw: unknown) => {
    try {
      const args = ProductUpdateSchema.parse(raw);
      const data = productsRepo.updateProduct(args);
      return ok(data);
    } catch (e) {
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });

  ipcMain.handle("products:setStatus", async (_event, raw: unknown) => {
    try {
      const { id, status } = SetStatusSchema.parse(raw);
      const data = productsRepo.setProductStatus(id, status as Status);
      return ok(data);
    } catch (e) {
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });

  ipcMain.handle("products:delete", async (_event, raw: unknown) => {
    try {
      const { id } = IdSchema.parse(raw);
      productsRepo.deleteProduct(id);
      return ok(undefined);
    } catch (e) {
      const { code, message } = mapError(e);
      return err(code, message);
    }
  });
}
