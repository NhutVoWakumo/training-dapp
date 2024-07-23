import { CollectionTable } from "./components";
import React from "react";

const NFTCollections = () => {
  return (
    <div>
      <p className="text-3xl text-transparent font-semibold text-purple-yellow-gradient animate-gradient my-5">
        NFT Collections
      </p>
      <CollectionTable />
    </div>
  );
};

export default NFTCollections;
