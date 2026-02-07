import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  products: {
    list: (query?: { q?: string; status?: "ACTIVE" | "INACTIVE" | "ALL" }) =>
      ipcRenderer.invoke("products:list", query ?? {}),
    get: (id: number) => ipcRenderer.invoke("products:get", { id }),
    create: (input: unknown) => ipcRenderer.invoke("products:create", input),
    update: (input: unknown) => ipcRenderer.invoke("products:update", input),
    setStatus: (id: number, status: "ACTIVE" | "INACTIVE") =>
      ipcRenderer.invoke("products:setStatus", { id, status }),
    delete: (id: number) => ipcRenderer.invoke("products:delete", { id }),
  },
});
