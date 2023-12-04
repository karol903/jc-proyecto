/**
 * Calcula la diferencia entre una fecha determinada y la fecha actual.
 * @param {Date} date - La fecha objetivo.
 * @returns {string} - Una cadena que indica la diferencia de fechas.
 */
export const calculateDateDifference = (date: Date): string => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const targetDay = date.getDate();
  const difference = date.getTime() - currentDate.getTime();
  const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  if (date < currentDate) {
    return "Tarea no completada a tiempo";
  } else if (targetDay === currentDay) {
    return "Hoy";
  } else if (targetDay === currentDay + 1) {
    return "Mañana";
  } else if (differenceDays <= 7) {
    // "en-US"
    const dayOfWeek = date.toLocaleString(navigator.language, {
      weekday: "long",
    });
    return `On ${dayOfWeek} (${differenceDays} day${
      differenceDays !== 1 ? "s" : ""
    })`;
  } else {
    return `In ${differenceDays} days`;
  }
};
