import Image from "next/image";

const NUMBER_OF_CHESTS = 100;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <h1 className="text-4xl mb-4">One Million Treasure Chests</h1>
      <p className="text-2xl mb-4">{1} of 1,000,000 chests opened</p>
      <div className="flex flex-wrap gap-1">
        {new Array(NUMBER_OF_CHESTS).fill(null).map((_, index) => (
          <button 
            key={index} 
            className="btn w-24 h-24 flex items-center justify-center">
            <img src="/chest.png" />
          </button>
        ))}
      </div>
    </main>
  );
}
