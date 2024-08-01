"use client";

import {
  Pagination as NextUIPagination,
  PaginationProps,
} from "@nextui-org/react";
import React, { useMemo } from "react";

interface CustomPaginationProps extends Omit<PaginationProps, "total"> {
  dataLength: number;
  rowsPerPage?: number;
}

export const CustomPagination = ({
  dataLength,
  rowsPerPage = 4,
  ...props
}: CustomPaginationProps) => {
  const pages = useMemo(
    () => Math.ceil(dataLength / rowsPerPage),
    [dataLength, rowsPerPage],
  );

  return (
    <NextUIPagination
      isCompact
      showControls
      showShadow
      color="secondary"
      {...props}
      total={pages}
    />
  );
};
