export const formatNumber = (num: number): string => {
  return num % 1 === 0
    ? num.toLocaleString("ru-RU")
    : num.toLocaleString("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};
