export const repeatArray = <T>(array: T[], times: number) => {
  let result: T[] = [];
  for (let i = 0; i < times; i++) {
    result = result.concat(array);
  }
  return result;
};
