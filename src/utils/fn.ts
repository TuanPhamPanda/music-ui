export const convertMinutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedTime =
    hours.toString().padStart(2, "0") +
    ":" +
    remainingMinutes.toString().padStart(2, "0");
  return formattedTime;
};

export const removeVietnameseDiacritics = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
