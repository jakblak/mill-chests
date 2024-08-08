import { Id } from "@/convex/_generated/dataModel";

export interface LootItem {
  _id: Id<"loot">;
  rarity: string;
  name: string;
  used: boolean;
  chestIndex: number;
}