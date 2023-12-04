import { Category, Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { Edit } from "@mui/icons-material";

import { Button, Typography } from "@mui/material";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";

import toast from "react-hot-toast";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Ckeck List";
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`El nombre debe ser menor o igual a ${TASK_NAME_MAX_LENGTH} caracteres`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `La descripción debe ser menor o igual a ${DESCRIPTION_MAX_LENGTH} caracteres`
      );
    } else {
      setDescriptionError("");
    }
  };

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setColor(event.target.value);
  // };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name !== "") {
      if (name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        return; // No agregue la tarea si el nombre o la descripción excede la longitud máxima
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategories ? selectedCategories : [],
      };

      setUser((prevUser) => ({
        ...prevUser,
        tasks: [...prevUser.tasks, newTask],
      }));

      n("/");
      toast.success(() => (
        <div>
         Tarea agregada - <b>{newTask.name}</b>
        </div>
      ));
    }
  };

  return (
    <>
      <TopBar title="Agregar nueva tarea" />
      <Container>
        <CustomEmojiPicker user={user} setEmoji={setEmoji} color={color} />
        <StyledInput
          label="Nombre de la tarea"
          name="Nombre"
          placeholder="Introduzca el nombre de la tarea"
          value={name}
          onChange={handleNameChange}
          focused
          error={nameError !== ""}
          helperText={nameError}
        />
        <StyledInput
          label="Descripción de la tarea (opcional)"
          name="Nombre"
          placeholder="Introduzca la descripción de la tarea"
          value={description}
          onChange={handleDescriptionChange}
          multiline
          rows={4}
          focused
          error={descriptionError !== ""}
          helperText={descriptionError}
        />
        <StyledInput
          label="Fecha límite de la tarea (opcional)"
          name="Nombre"
          placeholder="Introduzca la fecha límite"
          type="fecha-local"
          value={deadline}
          onChange={handleDeadlineChange}
          focused
        />
        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <br />
            <Typography>Categoría(opcional)</Typography>

            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              width="400px"
            />
            <Link to="/categorias">
              <Button
                sx={{
                  margin: "8px 0 24px 0 ",
                  padding: "12px 24px",
                  borderRadius: "12px",
                }}
              >
                <Edit /> &nbsp; Modificar categorías
              </Button>
            </Link>
          </>
        )}
        <Typography>Color</Typography>
        <ColorPicker
          color={color}
          onColorChange={(color) => {
            setColor(color);
          }}
        />

        {/* <Typography>Color</Typography>
        <ColorPicker type="color" value={color} onChange={handleColorChange} /> */}
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH ||
            description.length > DESCRIPTION_MAX_LENGTH ||
            name === ""
          }
        >
         Crear tarea
        </AddTaskButton>
      </Container>
    </>
  );
};
