import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import { AppSettings, UserProps } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Settings, WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";

interface SettingsProps extends UserProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose, user, setUser }: SettingsProps) => {
  const [settings, setSettings] = useState<AppSettings>(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);

  const isOnline = useOnlineStatus();

 // Matriz de estilos de emoji disponibles con sus etiquetas
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];
  // Controlador para actualizar opciones de configuración individuales
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedSettings = {
        ...settings,
        [name]: event.target.checked,
      };
      setSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [updatedSettings],
      }));
    };

 // Controlador para actualizar el estilo emoji seleccionado
  const handleEmojiStyleChange = (event: SelectChangeEvent<EmojiStyle>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle;
    setUser((prevUser) => ({
      ...prevUser,
      emojisStyle: selectedEmojiStyle,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Settings />
        &nbsp;Ajustes
      </DialogTitle>
      <Container>
        {/* Seleccione componente para elegir el estilo emoji */}
        <FormGroup>
          <FormControl>
            <FormLabel>Configuración de emojis</FormLabel>
            <Select
              value={user.emojisStyle}
              onChange={handleEmojiStyleChange}
              sx={{
                width: "300px",
                borderRadius: "18px",
                color: "black",
                m: "8px 0",
              }}
            >
              {/* Mostrar un elemento de menú deshabilitado cuando no está conectado, lo que indica que el estilo no se puede cambiar */}
              {!isOnline && (
                <MenuItem
                  disabled
                  style={{
                    opacity: 0.8,
                    display: "flex",
                    gap: "6px",
                    fontWeight: 500,
                  }}
                >
                  <WifiOff /> No puedes cambiar el estilo emoji <br /> cuando no estás conectado
                </MenuItem>
              )}

              {emojiStyles.map((style) => (
                <MenuItem
                  key={style.style}
                  value={style.style}
                  // Deshabilita los estilos no nativos cuando estés sin conexión o si no son el estilo predeterminado o el último estilo seleccionado
                  // Esto evita que los usuarios seleccionen estilos que requieran recuperar recursos externos (emojis) cuando están desconectados,
                  // ya que es posible que esos emojis no se carguen sin una conexión a Internet.
                  disabled={
                    !isOnline &&
                    style.style !== EmojiStyle.NATIVE &&
                    style.style !== defaultUser.emojisStyle &&
                    style.style !== lastStyle
                  }
                  sx={{
                    padding: "12px 20px",
                    borderRadius: "12px",
                    margin: "8px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <Emoji size={24} unified="1f60e" emojiStyle={style.style} />
                  &nbsp;
                  {/* Espacio para emoji nativo */}
                  {style.style === EmojiStyle.NATIVE && "\u00A0"}
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        {/* Cambie de componentes para controlar diferentes configuraciones de la aplicación */}
        <FormGroup>
          <FormLabel>Ajustes de Aplicacion</FormLabel>
          <FormControlLabel
            sx={{ opacity: settings.enableCategories ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableCategories}
                onChange={handleSettingChange("enableCategories")}
              />
            }
            label="Enable Categories"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.enableGlow ? 1 : 0.8 }}
            control={
              <Switch checked={settings.enableGlow} onChange={handleSettingChange("enableGlow")} />
            }
            label="Enable Glow Effect"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.doneToBottom}
                onChange={handleSettingChange("doneToBottom")}
              />
            }
            label="Move Done Tasks To Bottom"
          />
        </FormGroup>
      </Container>
      <DialogActions>
        <DialogBtn onClick={onClose}>Cerrar</DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  user-select: none;
  margin: 0 18px;
  gap: 6px;
`;
