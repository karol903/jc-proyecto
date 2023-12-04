/**
 * Devuelve un mensaje de saludo aleatorio para inspirar productividad.
 * @returns {string} Un mensaje de saludo aleatorio.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours();

  const greetingsText: string[] = [
    "¡Hagamos que hoy cuente!",
    "¡Haz las cosas y conquista el día!",
    "¡Abraza el poder de la productividad!",
    "Establece tus objetivos, aplástalos, repite.",
    "Hoy es una nueva oportunidad para ser productivo!",
    "Haz que cada momento cuente.",
    "Mantente organizado, mantente adelante.",
    "¡Hazte cargo de tu día!",
    "Una tarea a la vez, ¡lo tienes!",
    "La productividad es la clave del éxito.",
    "¡Convirtamos los planes en logros!",
    "Comienza pequeño, logra grande.",
    "Sé eficiente, sé productivo.",
    "¡Aproveche el poder de la productividad!",
    "¡Prepárate para hacer que las cosas sucedan!",
    "¡Es hora de marcar esas tareas!",
    "Comienza tu día con un plan!",
    "Mantente concentrado, mantente productivo.",
    "Libere su potencial de productividad.",
    "Convierte tu lista de tareas pendientes en una lista de tareas pendientes!",

    `Tener un maravilloso  ${new Date().toLocaleDateString("en", {
      weekday: "long",
    })}!`,
    `Feliz ${new Date().toLocaleDateString("en", {
      month: "long",
    })}! Un gran mes para la productividad!`,
    hoursLeft > 4
      ? `${hoursLeft} horas que quedan en el día. ¡Utilízalos sabiamente!`
      : `Only ${hoursLeft} hours left in the day`,

    // <TextWithEmoji emojiStyle={emojiStyle} unificado="1f5d3-fe0f">
    // ¡Empieza tu día con un plan!
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unificado="1f3af">
    // Mantente enfocado, mantente productivo.
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unificado="1f513">
    // Libere su potencial de productividad.
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unificado="2705">
    // ¡Convierte tu lista de tareas pendientes en una lista de tareas pendientes!
    // </TextWithEmoji>,
  ];

  const randomIndex = Math.floor(Math.random() * greetingsText.length);
  return greetingsText[randomIndex];
};

// interfaz EmojiTextProps {
// niños: ReactNode;
// emojiStyle: EmojiStyle;
// unificado: cadena;
// }

// const TextWithEmoji = ({ niños, emojiStyle, unificado }: EmojiTextProps) => {
//   devolver (
// <span style={{ display: "flex", alignItems: "center" }}>
// {niños}&nbsp;
// <Emoji emojiStyle={emojiStyle} unificado={unificado} tamaño={20} />
// </span>
// );
// };
