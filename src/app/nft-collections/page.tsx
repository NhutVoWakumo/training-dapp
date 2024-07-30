import { CollectionTable } from "./components";
import React from "react";

const NFTCollections = () => {
  return (
    <div className="px-3 md:px-10">
      <p className="text-purple-yellow-gradient my-5 animate-gradient text-3xl font-semibold text-transparent">
        NFT Collections
      </p>
      <CollectionTable />
    </div>
  );
};

export default NFTCollections;
