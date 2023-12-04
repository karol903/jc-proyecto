import { EmojiStyle } from "emoji-picker-react";

/**
 * Representa a un usuario en la aplicación.
 */
export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | URL | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  categories: Category[];
  // colors: string[];
  settings: AppSettings[];
}

/**
 * Representa una tarea en la aplicación.
 */
export interface Task {
  id: number;
  done: boolean;
  pinned: boolean;
  name: string;
  description?: string;
  emoji?: string;
  color: string;
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
}

// export type Emoji = Omit<
//   EmojiClickData,
//   "activeSkinTone" | "names" | "unifiedWithoutSkinTone" | "getImageUrl"
// > & {
//   name: string;
// };

// tipo de exportación Emoji = Pick<EmojiClickData, "unificado" | "emojis" | "nombres">;

/**
 * Represents a category in the application.
 */
export interface Category {
  id: number;
  name: string;
  emoji?: string;
  color: string;
}

/**
 * Representa la configuración de la aplicación para el usuario.
 */
export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
}

/**
 * RRepresenta los accesorios para un componente que requiere datos relacionados con el usuario.
 */
export interface UserProps {
  user: User; // Datos del usuario
  setUser: React.Dispatch<React.SetStateAction<User>>; // Función para actualizar los datos del usuario.
}
