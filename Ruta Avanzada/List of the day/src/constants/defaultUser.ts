import { EmojiStyle } from "emoji-picker-react";
import { User } from "../types/user";

/**
 * Represents a default user object.
 */
export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  profilePicture: null,
  emojisStyle: EmojiStyle.APPLE,
  tasks: [],
  settings: [
    {
      enableCategories: true,
      doneToBottom: false,
      enableGlow: true,
    },
  ],
  categories: [
    { id: 1, name: "Hogar", emoji: "1f3e0", color: "#1fff44" },
    { id: 2, name: "Trabajo", emoji: "1f3e2", color: "#248eff" },
    { id: 3, name: "Personal", emoji: "1f464", color: "#e843fe" },
    { id: 4, name: "Salud y estado fisico", emoji: "1f4aa", color: "#ffdf3d" },
    { id: 5, name: "Educación", emoji: "1f4da", color: "#ff8e24" },
  ],
};
