/*** Devuelve un mensaje de finalización de la tarea según el porcentaje de finalización.
 * @param {number} completionPercentage - El porcentaje de finalización de las tareas.
 * @returns {string} Un mensaje de finalización de tarea.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return "Aún no se han completado tareas. ¡Sigue adelante!";
    case completionPercentage === 100:
      return "¡Felicidades! ¡Todas las tareas completadas!";
    case completionPercentage >= 75:
      return "¡Casi llegamos!";
    case completionPercentage >= 50:
      return "¡Estás a mitad de camino! ¡Avanza!";
    case completionPercentage >= 25:
      return "Estás haciendo un buen progreso.";
    default:
      return "Recién estás comenzando.";
  }
};
