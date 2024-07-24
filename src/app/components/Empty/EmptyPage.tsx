"use client";

import { GiBlackHoleBolas } from "react-icons/gi";
import React from "react";
import { motion } from "framer-motion";

export const EmptyPage = () => {
  return (
    <div className="flex h-[80vh]">
      <div className="m-auto flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          <GiBlackHoleBolas size={80} />
        </motion.div>

        <p className="animate-typing overflow-hidden whitespace-nowrap text-gray-400">
          The data is thrown to the black hole......
        </p>
      </div>
    </div>
  );
};
