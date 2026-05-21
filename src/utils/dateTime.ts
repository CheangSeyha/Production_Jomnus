const pad = (value: number) => String(value).padStart(2, "0");

export const toDateTimeLocalValue = (dateInput?: string | Date | null) => {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

export const toDateTimeLocalISOString = (dateString: string) => {
  const date = new Date(dateString);
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = pad(Math.floor(absOffset / 60));
  const minutes = pad(absOffset % 60);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`;
};
