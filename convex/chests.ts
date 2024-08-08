import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const BITS_IN_PARTITION = 32;

export const openChest = mutation({
  args: {
    index: v.number(),
  },
  async handler(ctx, args) {
    const partition = Math.floor(args.index / BITS_IN_PARTITION);

    const chestPartition = await ctx.db
      .query("chests")
      .withIndex("by_partition", (q) => q.eq("partition", partition))
      .first();

    if (!chestPartition) {
      await ctx.db.insert("chests", {
        partition,
        bitset: 1 << args.index % BITS_IN_PARTITION,
      });
    } else {
      chestPartition.bitset |= 1 << args.index % BITS_IN_PARTITION;
      await ctx.db.patch(chestPartition._id, {
        bitset: chestPartition.bitset,
      });
    }
    // Update the sum
    const sumRecord = await ctx.db.query("sums").first();
    if (sumRecord) {
      await ctx.db.patch(sumRecord._id, { value: sumRecord.value + 1 });
    }

  }
});

export const getChestPartition = query({
  args: {
    partition: v.number(),
  },
  async handler(ctx, args) {
    const chestPartition = await ctx.db
      .query("chests")
      .withIndex("by_partition", (q) => q.eq("partition", args.partition))
      .first();
    if (!chestPartition) {
      return null;
    }
    return chestPartition;
  },
});