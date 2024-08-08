'use client'
import { api } from "@/convex/_generated/api";
import { BITS_IN_PARTITION } from "@/convex/chests";
import { useMutation, useQuery } from "convex/react";
import { FixedSizeGrid as Grid } from "react-window";
import { useMeasure } from "react-use";
import { determineLoot } from "@/constants";
import { useState } from "react";
import { LootItem } from "@/types";

const NUMBER_OF_CHESTS = 1_000_000;
const ROW_HEIGHT = 100;
const COLUMN_WIDTH = 100;
const LEFT_PADDING = 10; // New constant for left padding
const RIGHT_PADDING = 1; // New constant for right padding

function Chest({ rowIndex,
  columnIndex,
  style,
  data, }: {
    rowIndex: number;
    columnIndex: number;
    style: React.CSSProperties;
    data: {
      columnCount: number;
    };
  }) {
  const index = rowIndex * data.columnCount + columnIndex;
  const openChest = useMutation(api.chests.openChest);
  const getLoot = useMutation(api.loot.getLoot);
  const [loot, setLoot] = useState<LootItem | null>(null);
  const chestPartition = useQuery(api.chests.getChestPartition, {
    partition: Math.floor(index / BITS_IN_PARTITION),
  });

  const bit = 1 << index % BITS_IN_PARTITION;
  const isOpen = chestPartition ? (chestPartition.bitset & bit) !== 0 : false;

  const handleOpenChest = async () => {
    const lootRarity = determineLoot(index);
    if (lootRarity) {
      const lootItem = await getLoot({ rarity: lootRarity, chestIndex: index });
      await openChest({ index });
      setLoot(lootItem);
    } else {
      await openChest({ index });
    }
  };

  if (index >= NUMBER_OF_CHESTS) {
    return null;
  }

  return (
    <div style={style}><button
    key={index}
    disabled={isOpen}
    className="btn w-24 h-24 flex items-center justify-center"
    onClick={handleOpenChest}
  >
    {isOpen ? (
      loot ? (
        <div className="text-xs">
          {loot.rarity}: {loot.name}
        </div>
      ) : (
        <img src="/chest-empty.png" alt="Empty chest" />
      )
    ) : (
      <img src="/chest.png" alt="Closed chest" />
    )}
  </button>
  </div>
  );
}

export default function Home() {
  const openBoxSum = useQuery(api.sums.getOpenBoxSum) ?? 0;
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <main className="flex min-h-screen flex-col items-center h-full">
      <h1 className="text-4xl mb-4">One Million Treasure Chests</h1>
      <p className="text-2xl mb-4">{openBoxSum} of 1,000,000 chests opened</p>
      <div ref={ref} className="w-full h-screen" style={{ paddingLeft: LEFT_PADDING, paddingRight: RIGHT_PADDING }}>
        {width && height ? (
          <Grid
            columnCount={Math.floor((width - LEFT_PADDING - RIGHT_PADDING) / COLUMN_WIDTH)}
            columnWidth={COLUMN_WIDTH}
            height={height}
            width={width - LEFT_PADDING - RIGHT_PADDING}
            rowCount={Math.ceil(NUMBER_OF_CHESTS / Math.floor((width - LEFT_PADDING - RIGHT_PADDING) / COLUMN_WIDTH))}
            rowHeight={ROW_HEIGHT}
            itemData={{
              columnCount: Math.floor((width - LEFT_PADDING - RIGHT_PADDING) / COLUMN_WIDTH),
            }}
          >
            {Chest}
          </Grid>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  );
}
