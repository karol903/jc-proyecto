import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { Category, Task, User } from "../types/user";
import styled from "@emotion/styled";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { DialogBtn } from "../styles";
import { CategorySelect, ColorPicker, CustomEmojiPicker } from ".";
import toast from "react-hot-toast";

interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
  user: User;
}

export const EditTask = ({ open, task, onClose, onSave, user }: EditTaskProps) => {
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  // Gancho de efecto para actualizar la tarea editada con el emoji seleccionado.
  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      emoji: emoji,
    }));
  }, [emoji]);

  // useEffect(() => {
  //   setSelectedCategories(
  //     editedTask?.category !== undefined
  //       ? (editedTask.category as Category[])
  //       : []
  //   );
  // }, []);

  // Effect hook to update the editedTask when the task prop changes.
  useEffect(() => {
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  }, [task]);

  // Manejador de eventos para cambios de entrada en los campos del formulario.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // El estado de error de actualización del nombre de la longitud del nombre excede el máximo permitido.

    if (name === "name" && value.length > TASK_NAME_MAX_LENGTH) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    // Actualice el estado de error de la descripción si la longitud de la descripción excede el máximo permitido.
    if (name === "description" && value.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }
    // Actualice el estado de la tarea editada con el valor modificado.
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };
  // Controlador de eventos para guardar la tarea editada.
  const handleSave = () => {
    document.body.style.overflow = "auto";
    if (editedTask && !nameError && !descriptionError) {
      onSave(editedTask);
      toast.success(
        <div>
          Task <b>{editedTask.name}</b> updated.
        </div>
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
    // brindis("Tarea de edición cancelada.");
  };

  // Event handler for category change in the Select dropdown.
  // const handleCategoryChange = (event: SelectChangeEvent<unknown>) => {
  //   const categoryId = event.target.value as number;
  //   const selectedCategory = user.categories.find(
  //     (category) => category.id === categoryId
  //   );

  //   setEditedTask((prevTask) => ({
  //     ...(prevTask as Task),
  //     category: selectedCategory ? [selectedCategory] : undefined,
  //   }));
  // };

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      category: (selectedCategories as Category[]) || undefined,
    }));
  }, [selectedCategories]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setEditedTask(task);
        setSelectedCategories(task?.category as Category[]);
      }}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Edit Task</span>
        {editedTask?.lastSave && (
          <LastEdit>
            Last Edited: {new Date(editedTask?.lastSave).toLocaleDateString()}
            {" • "}
            {new Date(editedTask?.lastSave).toLocaleTimeString()}
          </LastEdit>
        )}
      </DialogTitle>
      <DialogContent>
        <CustomEmojiPicker
          user={user}
          emoji={editedTask?.emoji || undefined}
          setEmoji={setEmoji}
          color={editedTask?.color}
          width="400px"
        />
        <StyledInput
          label="Name"
          name="name"
          value={editedTask?.name || ""}
          onChange={handleInputChange}
          fullWidth
          error={nameError || editedTask?.name === ""}
          helperText={
            editedTask?.name === ""
              ? "Se requiere el nombre"
              : nameError
              ? `El nombre debe ser menor o igual a ${TASK_NAME_MAX_LENGTH} caracteres`
              : undefined
          }
        />
        <StyledInput
          label="Description"
          name="description"
          value={editedTask?.description || ""}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={
            descriptionError &&
            `La descripción es demasiado larga (máximo ${DESCRIPTION_MAX_LENGTH} caracteres)`
          }
        />

        {/* FIXME: default date doesnt work (new amazing chrome update) */}
        <StyledInput
          label="Deadline date"
          name="deadline"
          type="datetime-local"
          value={editedTask?.deadline}
          onChange={handleInputChange}
          focused
          fullWidth
        />

        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <Label>Categoria❤️‍🔥</Label>
            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            {/* {editedTask?.category &&
                editedTask.category.length > 0 &&
                !user.categories.some(
                  (category) =>
                    editedTask.category &&
                    editedTask.category[0] &&
                    category.id === editedTask.category[0].id
                ) && (
                  <div style={{ margin: "8px 0" }}>
                    <span>
                      Category <b>{editedTask.category[0]?.name}</b> has been
                      deleted
                      <br />
                      <Button
                        sx={{
                          padding: "8px 12px",
                          margin: "8px 0",
                          borderRadius: "12px",
                        }}
                        onClick={() => {
                          if (editedTask.category && editedTask.category[0]) {
                            const updatedCategories = [
                              ...user.categories,
                              editedTask.category[0],
                            ];

                            setUser((prevUser) => ({
                              ...prevUser,
                              categories: updatedCategories,
                            }));
                          }
                        }}
                      >
                        <Restore /> &nbsp; restore category
                      </Button>
                    </span>
                  </div>
                )} */}
          </>
        )}
        <Label>Color</Label>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ColorPicker
            width={"100%"}
            color={editedTask?.color || "#000000"}
            onColorChange={(color) => {
              setEditedTask((prevTask) => ({
                ...(prevTask as Task),
                color: color,
              }));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={handleCancel}>Cancelar</DialogBtn>
        <DialogBtn
          onClick={handleSave}
          color="primary"
          disabled={nameError || editedTask?.name === ""}
        >
          Ahorrar
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const StyledInput = styled(TextField)`
  margin: 14px 0;
  & .MuiInputBase-root {
    border-radius: 16px;
  }
`;

const Label = styled(Typography)`
  margin-left: 8px;
  font-weight: 500;
  font-size: 16px;
`;

// const StyledSelect = styled(Select)`
//   border-radius: 16px;
//   transition: 0.3s all;

//   margin: 8px 0;
// `;

const LastEdit = styled.span`
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
`;
