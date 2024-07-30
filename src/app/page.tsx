import { ScrollingBanner, TokenCircle } from "./components";

import { repeatArray } from "./utils";
import { supportedChainLogos } from "./constants/supportedChainLogos";
import { useMemo } from "react";

export default function Home() {
  const chainLogos = useMemo(() => {
    return repeatArray(supportedChainLogos, 3);
  }, []);

  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-center gap-10 overflow-hidden p-5">
      <div className="relative mt-64 flex size-full items-center justify-center">
        <TokenCircle circleRadius={400} clockwise={false} />
        <div className="absolute">
          <TokenCircle circleRadius={250} clockwise={true} />
        </div>
        <div className="absolute left-0 top-0 size-full">
          <div className="flex size-full flex-col items-center justify-center gap-3 text-wrap">
            <p className="text-4xl font-semibold text-white">
              Connect and explore
            </p>
            <p className="text-purple-yellow-gradient animate-gradient text-center text-6xl font-semibold text-transparent">
              the Web3 world
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[400px] flex flex-col justify-center gap-5">
        <p className="mb-5 text-center text-2xl italic text-gray-400">
          Supported chains
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-12">
          <ScrollingBanner shouldPauseOnHover duration={100} gap="40px">
            {chainLogos.map(({ key, logo }, index) => (
              <div
                key={`${key}-${index}`}
                className="flex items-center justify-center text-foreground"
              >
                {logo}
              </div>
            ))}
          </ScrollingBanner>
          <ScrollingBanner
            isReverse
            shouldPauseOnHover
            duration={100}
            gap="40px"
          >
            {chainLogos.map(({ key, logo }, index) => (
              <div
                key={`${key}-${index}`}
                className="flex items-center justify-center text-foreground"
              >
                {logo}
              </div>
            ))}
          </ScrollingBanner>
        </div>
      </div>
    </main>
  );
}
