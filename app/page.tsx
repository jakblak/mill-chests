'use client'
import { api } from "@/convex/_generated/api";
import { BITS_IN_PARTITION } from "@/convex/chests";
import { useMutation, useQuery } from "convex/react";
import { FixedSizeGrid as Grid } from "react-window";
import { useMeasure } from "react-use";

const NUMBER_OF_CHESTS = 10000;
const ROW_HEIGHT = 100;
const COLUMN_WIDTH = 100;

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
  const chestPartition = useQuery(api.chests.getChestPartition, {
    partition: Math.floor(index / BITS_IN_PARTITION),
  });

  const bit = 1 << index % BITS_IN_PARTITION;
  const isOpen = chestPartition ? (chestPartition.bitset & bit) !== 0 : false;

  if (index >= NUMBER_OF_CHESTS) {
    return null;
  }

  return (
    <div style={style}><button
    key={index}
    disabled={isOpen}
    className="btn w-24 h-24 flex items-center justify-center"
    onClick={() => {
      openChest({ index });
    }}
  >
    {isOpen ? <img src="/chest-empty.png" /> : <img src="/chest.png" />}
  </button>
  </div>
    
  );
}

export default function Home() {
  const openBoxSum = useQuery(api.sums.getOpenBoxSum) ?? 0;
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  console.log(height);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <h1 className="text-4xl mb-4">One Million Treasure Chests</h1>
      <p className="text-2xl mb-4">{openBoxSum} of 1,000,000 chests opened</p>
      <div ref={ref} className="w-full h-screen">
        <Grid
          columnCount={Math.floor(width / COLUMN_WIDTH)}
          columnWidth={COLUMN_WIDTH}
          height={height}
          width={width}
          rowCount={NUMBER_OF_CHESTS / Math.ceil(width / COLUMN_WIDTH)}
          rowHeight={ROW_HEIGHT}
          itemData={{
            columnCount: Math.ceil(width / COLUMN_WIDTH),
          }}
        >
          {Chest}
        </Grid>
      </div>
    </main>
  );
}
