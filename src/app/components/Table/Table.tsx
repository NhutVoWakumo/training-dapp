import {
  Table as NextUITable,
  Spinner,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableColumn,
  TableColumnProps,
  TableHeader,
  TableHeaderProps,
  TableProps,
  TableRow,
  TableRowProps,
} from "@nextui-org/react";
import React, { ReactNode } from "react";

import { GiOpenTreasureChest } from "react-icons/gi";

interface TableColumn {
  key: React.Key;
  name: ReactNode;
}

interface CustomTableProps<T extends Record<string, any>> {
  data: T[];
  renderCell: (item: T, columnKey: string) => ReactNode;
  tableProps?: TableProps;
  tableHeaderProps?: Omit<TableHeaderProps<T>, "columns" | "children">;
  tableBodyProps?: Omit<TableBodyProps<T>, "children">;
  tableRowProps?: Omit<TableRowProps, "children">;
  tableColumnProps?: Omit<TableColumnProps<T>, "children">;
  tableCellProps?: Omit<TableCellProps, "children">;
  columns: TableColumn[];
}

export const CustomTable = <T extends Record<string, any>>({
  tableBodyProps,
  tableCellProps,
  tableHeaderProps,
  tableColumnProps,
  tableRowProps,
  tableProps,
  renderCell,
  columns,
  data,
}: CustomTableProps<T>) => {
  return (
    <NextUITable {...tableProps}>
      <TableHeader {...tableHeaderProps} columns={columns}>
        {(column) => (
          <TableColumn {...tableColumnProps} key={column.key}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        loadingContent={<Spinner color="warning" label="Finding treasure..." />}
        emptyContent={
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <GiOpenTreasureChest size={70} />
            <p className="text-gray text-lg font-medium">
              Let&apos;s make your treasure full
            </p>
          </div>
        }
        {...tableBodyProps}
      >
        {data.map((item, index) => (
          <TableRow key={index} {...tableRowProps}>
            {(columnKey) => (
              <TableCell {...tableCellProps}>
                {renderCell(item, columnKey as string)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </NextUITable>
  );
};
