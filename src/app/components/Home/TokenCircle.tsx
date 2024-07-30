"use client";

import { Avatar, Image } from "@nextui-org/react";

import { SymbolLogo } from "@api3/logos";
import { motion } from "framer-motion";

interface TokenCircleProps {
  circleRadius?: number;
  clockwise?: boolean;
}

const tokenSymbol = [
  "busd",
  "usdt",
  "eth",
  "bnb",
  "link",
  "uni",
  "celo",
  "sushi",
  "gmt",
  "klay",
];

export const TokenCircle = ({
  circleRadius = 200,
  clockwise = true,
}: TokenCircleProps) => {
  return (
    <motion.div
      className="relative mx-auto mt-20 size-64"
      animate={{
        rotate: clockwise ? 360 : -360,
      }}
      transition={{
        repeat: Infinity,
        duration: 20,
        ease: "linear",
      }}
    >
      {tokenSymbol.map((symbol, index) => {
        const angle = (index / tokenSymbol.length) * 360;
        const x = circleRadius * Math.cos((angle * Math.PI) / 180);
        const y = circleRadius * Math.sin((angle * Math.PI) / 180);

        return (
          <motion.div
            key={index}
            initial={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              top: `calc(50% + ${y}px - 20px)`,
              left: `calc(50% + ${x}px - 20px)`,
            }}
            transition={{
              delay: index * 0.1,
              duration: 1,
              ease: "easeOut",
            }}
            className="absolute size-16"
          >
            <Image
              isBlurred
              className="size-16 rounded-full shadow-lg"
              src={(SymbolLogo(symbol) as any).src}
              alt={`token-${index}`}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
