import type { CatalogItem } from "./types";
import type { Signals } from "@/modules/agent/contracts";

export interface ProductProvider {
  name: string;
  search(signals: Signals, opts?: { limit?: number }): Promise<CatalogItem[]>;
}