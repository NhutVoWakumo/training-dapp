import React from "react";
import { Snippet } from "@nextui-org/react";
import { formatAddress } from "@/app/utils";

const CollectionDetail = ({
  params,
}: {
  params: { collectionAddress: string };
}) => {
  return (
    <div>
      <p className="text-3xl text-transparent font-semibold text-purple-yellow-gradient animate-gradient my-5 flex items-baseline gap-3">
        Collection
        <Snippet
          size="sm"
          className="text-gray-700 text-sm bg-transparent relative bottom-1"
          codeString={params.collectionAddress}
          symbol=""
        >
          {formatAddress(params.collectionAddress)}
        </Snippet>
      </p>
    </div>
  );
};

export default CollectionDetail;
