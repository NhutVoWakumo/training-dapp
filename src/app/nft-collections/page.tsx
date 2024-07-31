import { AnimatedGradientText } from "../components";
import { CollectionTable } from "./components";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "NFT Collections",
};

const NFTCollections = () => {
  return (
    <div className="px-3 md:px-10">
      <AnimatedGradientText className="my-5">
        NFT Collections
      </AnimatedGradientText>
      <CollectionTable />
    </div>
  );
};

export default NFTCollections;
