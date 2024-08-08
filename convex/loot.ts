import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getLoot = mutation({
  args: { rarity: v.string(), chestIndex: v.number() },
  handler: async (ctx, args) => {
    const lootItems = await ctx.db
      .query("loot")
      .withIndex("by_rarity", (q) => q.eq("rarity", args.rarity))
      .filter((q) => q.eq(q.field("used"), false))
      .take(1);
    
    if (lootItems.length > 0) {
      const lootItem = lootItems[0];
      await ctx.db.patch(lootItem._id, { 
        used: true,
        chestIndex: args.chestIndex });
      return lootItem;
    }
    
    return null;
  },
});

export const getLootForChest = query({
  args: { chestIndex: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("loot")
      .filter((q) => q.eq(q.field("chestIndex"), args.chestIndex))
      .first();
  },
});