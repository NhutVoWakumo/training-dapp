import { Metadata } from "next";
import React from "react";
import { TokenTable } from "./components";

export const metadata: Metadata = {
  title: "Tokens",
};

const Tokens = () => {
  return (
    <div className="flex size-full flex-col px-3 md:px-10">
      <TokenTable />
    </div>
  );
};

export default Tokens;
