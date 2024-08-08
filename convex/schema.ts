import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chests: defineTable({
    partition: v.number(),
    bitset: v.number(),
  }).index("by_partition", ["partition"]),
  sums: defineTable({
    value: v.number(),
  }),
  loot: defineTable({
    rarity: v.string(),
    name: v.string(),
    used: v.boolean(),
    chestIndex: v.number(),
  }).index("by_rarity", ["rarity"])
    .index("by_used", ["used"])
});