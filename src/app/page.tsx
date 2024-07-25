import { TokenCircle } from "./components";

export default function Home() {
  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-center gap-10 overflow-hidden p-5">
      <div className="relative size-full">
        <TokenCircle circleRadius={300} clockwise={false} />
        <div className="absolute top-0 size-full">
          <div className="flex size-full flex-col items-center justify-center gap-3 text-wrap">
            <p className="text-4xl font-semibold text-white">
              Connect and explore
            </p>
            <p className="text-purple-yellow-gradient animate-gradient text-6xl font-semibold text-transparent">
              the Web3 world
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
