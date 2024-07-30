import { CollectionTable } from "./components";
import React from "react";

const NFTCollections = () => {
  return (
    <div>
      <p className="text-purple-yellow-gradient my-5 animate-gradient px-3 text-3xl font-semibold text-transparent md:px-10">
        NFT Collections
      </p>
      <CollectionTable />
    </div>
  );
};

export default NFTCollections;
