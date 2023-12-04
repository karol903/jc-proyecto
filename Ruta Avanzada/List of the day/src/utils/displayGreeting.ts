/**
 * Devuelve un saludo basado en la hora actual.
 * @returns {string} El saludo adecuado.
 */
export const displayGreeting = (): string => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting: string;
  if (currentHour < 12 && currentHour >= 5) {
    greeting = "Buenos dias☀️";
  } else if (currentHour < 18 && currentHour > 12) {
    greeting = "Buenas Tardes🌂";
  } else {
    greeting = "Buenas Noches🌑";
  }

  return greeting;
};
