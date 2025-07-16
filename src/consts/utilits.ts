export const formatTimeShedule = (timeString: string): string => {
  try {
    const date = new Date(`2000-01-01T${timeString.replace("Z", "")}Z`);
    date.setHours(date.getUTCHours() + 6);

    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Ошибка времени";
  }
};

export const formatTimeRangeShedule = (startTime: string, endTime: string): string => {
  return `${formatTimeShedule(startTime)} - ${formatTimeShedule(endTime)}`;
};

export const getTimeInMinutes = (timeString: string): number => {
  try {
    const normalizedTime = timeString.includes("T")
      ? timeString
      : `2000-01-01T${timeString}`;

    const date = new Date(normalizedTime);

    if (isNaN(date.getTime())) {
      return 0;
    }

    return date.getHours() * 60 + date.getMinutes();
  } catch {
    return 0;
  }
};