import raw from "../data/menu.json";
import type { Category, MenuData, MenuItem } from "../data/types";

export const menu = raw as unknown as MenuData;
export const categories: Category[] = [...menu.categories].sort((a, b) => a.order - b.order);
export const categoryIds: string[] = categories.map((c) => c.id);

export const itemsByCategory: Record<string, MenuItem[]> = {};
for (const c of categories) itemsByCategory[c.id] = [];
for (const i of menu.items) itemsByCategory[i.category]?.push(i);
