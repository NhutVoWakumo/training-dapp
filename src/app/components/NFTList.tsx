"use client";

import { Card, Col, Flex, Image, Row, Typography } from "antd";
import React, { useCallback, useState } from "react";

import { NFTData } from "../interfaces";
import { NFTImport } from "./NFTImport";
import { createNFTUrl } from "../utils";

export const NFTList = () => {
  const [nftList, setNFTList] = useState<NFTData[]>([]);

  const onSave = useCallback(
    (nft: NFTData) => {
      const isAdded = nftList.find(
        (item: any) =>
          item?.address?.toString() === nft?.address?.toString() &&
          item?.tokenId?.toString() === nft?.tokenId?.toString()
      );

      if (!isAdded) setNFTList((prevList) => [...prevList, nft]);
    },
    [nftList]
  );

  return (
    <Flex vertical gap={32} style={{ width: "100%" }}>
      <NFTImport onSave={onSave} />
      <Row gutter={[16, 16]}>
        {nftList.map((item: NFTData) => (
          <Col
            key={`${item?.address} - ${item?.tokenId}`}
            sm={24}
            md={12}
            lg={8}
            xl={6}
          >
            <Card
              hoverable
              cover={
                <Image
                  src={createNFTUrl(item?.image ?? "")}
                  alt="NFT image"
                  height={300}
                  style={{
                    objectFit: "fill",
                    minWidth: "250px",
                  }}
                />
              }
            >
              <Card.Meta
                title={item?.name}
                description={
                  <Typography.Paragraph ellipsis={{ rows: 1 }}>
                    {item?.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};
