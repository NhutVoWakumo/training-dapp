"use client";

import { useCallback, useState } from "react";

export const useLoadMoreList = <T>() => {
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>();
  const [list, setList] = useState<T[]>([]);

  const resetProps = useCallback(() => {
    setCanLoadMore(true);
    setCursor(undefined);
    setList([]);
  }, []);

  const setProps = useCallback((data: T[], cursor?: string) => {
    setCursor(cursor);
    setCanLoadMore(!!cursor);

    setList((prevList) => [...prevList, ...data]);
  }, []);

  return {
    canLoadMore,
    cursor,
    list,
    resetProps,
    setProps,
    manualSetCanLoadMore: setCanLoadMore,
  };
};
