import { Task } from "../types/user";

/**
 * Exporta una serie de tareas a un archivo JSON e inicia la descarga.
 * @param {Task[]} selectedTasks - The array of tasks to be exported.
 */
export const exportTasksToJson = (selectedTasks: Task[]): void => {
 //Obtiene la fecha y hora actuales del nombre del archivo
  const timestamp = new Date().toLocaleString().replace(/[/:, ]/g, "_");
  const filename = `Tasks_${timestamp}.json`;

 // Crea un blob JSON
  const dataStr = JSON.stringify(selectedTasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  // Crea una URL para el blob
  const url = window.URL.createObjectURL(blob);

  // Crea un elemento de enlace e inicia la descarga.
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = filename;
  linkElement.click();
  console.log(`Exported tasks to ${filename}`);
 // Limpiar el objeto URL
  window.URL.revokeObjectURL(url);
};
