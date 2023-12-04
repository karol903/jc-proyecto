import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Task, UserProps } from "../types/user";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import { Emoji } from "emoji-picker-react";
import { FileDownload, FileUpload, Info } from "@mui/icons-material";
import { exportTasksToJson } from "../utils";
import { IconButton, Tooltip } from "@mui/material";
import {
  CATEGORY_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TASK_NAME_MAX_LENGTH,
} from "../constants";
import toast from "react-hot-toast";
import { ColorPalette } from "../styles";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

export const ImportExport = ({ user, setUser }: UserProps) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // Matriz de ID de tareas seleccionadas
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useResponsiveDisplay();

  const handleTaskClick = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImport(file);
    console.log(file);
  };
  const handleExport = () => {
    const tasksToExport = user.tasks.filter((task: Task) => selectedTasks.includes(task.id));
    exportTasksToJson(tasksToExport);
    toast(
      (t) => (
        <div>
         Tareas exportadas:{" "}
          <ul>
            {tasksToExport.map((task) => (
              <li key={task.id}>
                <ListContent>
                  <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                  <span>{task.name}</span>
                </ListContent>
              </li>
            ))}
          </ul>
          <Button
            variant="outlined"
            sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
            onClick={() => toast.dismiss(t.id)}
          >Dimitir
          </Button>
        </div>
      )
      // { icon: <FileDownload /> }
    );
  };

  const handleExportAll = () => {
    exportTasksToJson(user.tasks);
    toast.success(`Exported all tasks (${user.tasks.length})`);
  };

  const handleImport = (taskFile: File) => {
    const file = taskFile;

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string) as Task[];

          if (!Array.isArray(importedTasks)) {
            toast.error("Imported file has an invalid structure.");
            return;
          }
          // Compruebe si alguna propiedad de tarea importada excede la longitud máxima

          const invalidTasks = importedTasks.filter((task) => {
            const isInvalid =
              (task.name && task.name.length > TASK_NAME_MAX_LENGTH) ||
              (task.description && task.description.length > DESCRIPTION_MAX_LENGTH) ||
              (task.category &&
                task.category.some((cat) => cat.name.length > CATEGORY_NAME_MAX_LENGTH));

            return isInvalid;
          });

          if (invalidTasks.length > 0) {
            const invalidTaskNames = invalidTasks.map((task) => task.name).join(", ");
            console.error(
              `Estas tareas no se pueden importar debido a que se excede la longitud máxima de caracteres: ${invalidTaskNames}`
            );
            toast.error(`Algunas tareas no se pueden importar debido a que se excede la longitud máxima de caracteres`);
            return;
          }

        // Actualizar user.categories si las categorías importadas no existen
          const updatedCategories = user.categories.slice(); // Crear una copia de las categorías existentes
          importedTasks.forEach((task) => {
            task.category !== undefined &&
              task.category.forEach((importedCat) => {
                const existingCategory = updatedCategories.find((cat) => cat.id === importedCat.id);

                if (!existingCategory) {
                  updatedCategories.push(importedCat);
                } else {
                 // Reemplazar la categoría existente con la importada si el ID coincide
                  Object.assign(existingCategory, importedCat);
                }
              });
          });

          setUser((prevUser) => ({
            ...prevUser,
            categories: updatedCategories,
          }));
         // Proceder a fusionar las tareas importadas como antes
          const mergedTasks = [...user.tasks, ...importedTasks];

          // Remove duplicates based on task IDs (if any)
          // const uniqueTasks = Array.from(new Set(mergedTasks.map((task) => task.id)))
          //   .map((id) => mergedTasks.find((task) => task.id === id))
          //   .filter(Boolean) as Task[]; // Remove any 'undefined' values

          const uniqueTasks = mergedTasks.reduce((acc, task) => {
            const existingTask = acc.find((t) => t.id === task.id);
            if (existingTask) {
              return acc.map((t) => (t.id === task.id ? task : t));
            } else {
              return [...acc, task];
            }
          }, [] as Task[]);

          setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

        // Prepara la lista de nombres de tareas importadas
          const importedTaskNames = importedTasks.map((task) => task.name).join(", ");

         // Muestra la alerta con la lista de nombres de tareas importadas
          console.log(`Imported Tasks: ${importedTaskNames}`);
          toast((t) => (
            <div>
             Tareas importadas correctamente desde <br />
              <i style={{ wordBreak: "break-all" }}>{file.name}</i>
              <ul>
                {importedTasks.map((task) => (
                  <li key={task.id}>
                    <ListContent>
                      <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                      <span>{task.name}</span>
                    </ListContent>
                  </li>
                ))}
              </ul>
              <Button
                variant="outlined"
                sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
                onClick={() => toast.dismiss(t.id)}
              >
                Dimitir
              </Button>
            </div>
          ));
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          console.error(`Error al analizar el archivo importado ${file.name}:`, error);
          // brindis.error(`Error al analizar el archivo importado - ${file.name}`);
          toast.error(
            <div style={{ wordBreak: "break-all" }}>
           Error al analizar el archivo importado: <br /> <i>{file.name}</i>
            </div>
          );
        }
      };

      reader.readAsText(file);
    }
  };

 // borrar la entrada del archivo después de cerrar sesión
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user.createdAt]);

  return (
    <>
      <TopBar title="Importar/Exportar" />
      <h2
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       Seleccione tareas para exportar&nbsp;
        <Tooltip title="Los duplicados se eliminarán durante la importación.">
          <IconButton style={{ color: "#ffffff" }}>
            <Info />
          </IconButton>
        </Tooltip>
      </h2>

      <Container>
        {user.tasks.length > 0 ? (
          user.tasks.map((task: Task) => (
            <TaskContainer
              key={task.id}
              backgroundclr={task.color}
              onClick={() => handleTaskClick(task.id)}
              selected={selectedTasks.includes(task.id)}
            >
              <Checkbox size="medium" checked={selectedTasks.includes(task.id)} />
              <Typography
                variant="body1"
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
                {task.name}
              </Typography>
            </TaskContainer>
          ))
        ) : (
          <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>No tienes ninguna tarea para exportar.</h3>
        )}
      </Container>

      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <StyledButton
          onClick={handleExport}
          disabled={selectedTasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Exportar seleccionado a JSON{" "}
          {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
        </StyledButton>

        <StyledButton
          onClick={handleExportAll}
          disabled={user.tasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Exportar todas las tareas a JSON
        </StyledButton>

        <h2 style={{ textAlign: "center" }}>Importar tareas desde JSON</h2>

        {!isMobile && (
          <div style={{ width: "300px" }}>
            <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
              <FileUpload fontSize="large" color="primary" />
              <p style={{ fontWeight: 500, fontSize: "16px", margin: 0 }}>
               Suelte el archivo JSON aquí para importar tareas{" "}
              </p>
            </DropZone>
          </div>
        )}

        <input
          accept=".json"
          id="import-file"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            file && handleImport(file);
          }}
        />
        <label htmlFor="import-file">
          <Button
            component="span"
            variant="outlined"
            sx={{
              padding: "12px 18px",
              borderRadius: "14px",
              width: "300px",
            }}
          >
            <FileUpload /> &nbsp; Seleccione el archivo JSON
          </Button>
        </label>
      </Box>
    </>
  );
};

const TaskContainer = styled(Box)<{ backgroundclr: string; selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 8px;
  padding: 10px 4px;
  border-radius: 16px;
  background: #19172b94;
  border: 2px solid ${(props) => props.backgroundclr};
  box-shadow: ${(props) => props.selected && `0 0 8px 1px ${props.backgroundclr}`};
  transition: 0.3s all;
  width: 300px;
  cursor: "pointer";
`;

const ListContent = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 6px;
`;

const DropZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  border: 2px dashed ${ColorPalette.purple};
  border-radius: 16px;
  padding: 32px 64px;
  text-align: center;
  max-width: 300px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  max-height: 350px;

  overflow-y: auto;

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #ffffff15;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff30;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #ffffff50;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #ffffff15;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 18px;
  border-radius: 14px;
  width: 300px;

  &:disabled {
    color: #ffffff58;
    border-color: #ffffff58;
  }
`;
