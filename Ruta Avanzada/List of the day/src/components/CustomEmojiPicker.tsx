import { useState, useEffect, Dispatch, SetStateAction, CSSProperties } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import { AddReaction, Edit, RemoveCircleOutline } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle, SuggestionMode } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { ColorPalette } from "../styles";
import { User } from "../types/user";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | undefined>>;
  // onEmojiChange: (emojiData: EmojiClickData) => void;
  user: User;
  color?: string;
  width?: CSSProperties["width"];
}

export const CustomEmojiPicker = ({ emoji, setEmoji, user, color, width }: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(emoji || undefined);

  // const [emojiData, setEmojiData] = useState<EmojiClickData>();

// Cuando el estado actual de Emoji cambia, actualiza el estado de emoji del componente principal
  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji]);

  // Cuando el accesorio emoji cambia a una cadena vacía, establece el estado actual del Emoji en indefinido
  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(undefined);
    }
  }, [emoji]);

// Función para alternar la visibilidad del EmojiPicker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

 // Función de controlador para cuando se hace clic en un emoji en EmojiPicker
  const handleEmojiClick = (e: EmojiClickData) => {
    toggleEmojiPicker();
    setCurrentEmoji(e.unified);
   // setEmojiData(e);
    console.log(e);
   // console.log(e.getImageUrl(user.emojisStyle));
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setCurrentEmoji(undefined);
  };

// Función para renderizar el contenido del Avatar en función de si se selecciona un emoji o no
  const renderAvatarContent = () => {
    if (currentEmoji) {
    // Determinar el tamaño del emoji según la preferencia de estilo de emoji del usuario
      const emojiSize = user.emojisStyle === EmojiStyle.NATIVE ? 48 : 64;
      return (
        <div>
          <Emoji size={emojiSize} emojiStyle={user.emojisStyle} unified={currentEmoji} />
        </div>
      );
    } else {
      // Si no se selecciona ningún emoji, muestra el ícono AddReaction con el color especificado o el morado predeterminado
      const fontColor = color ? getFontColorFromHex(color) : ColorPalette.fontLight;
      return (
        <AddReaction
          sx={{
            fontSize: "52px",
            color: fontColor,
            transition: ".3s all",
          }}
        />
      );
    }
  };

  return (
    <>
      <EmojiContainer>
        <Tooltip
          title={
            showEmojiPicker
              ? "Close Emoji Picker"
              : currentEmoji
              ? "Change Emoji"
              : "Choose an Emoji"
          }
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={toggleEmojiPicker}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={toggleEmojiPicker}
              sx={{
                width: "96px",
                height: "96px",
                background: color || ColorPalette.purple,
                transition: ".3s all",
                cursor: "pointer",
              }}
            >
              {renderAvatarContent()}
            </Avatar>
          </Badge>
        </Tooltip>
      </EmojiContainer>
      {/* {emojiData && <EmojiName>{emojiData.names[0]}</EmojiName>} */}
      {showEmojiPicker && (
        <>
          <EmojiPickerContainer>
            <EmojiPicker
              width={width || "350px"}
              height="500px"
              emojiStyle={user.emojisStyle}
              suggestedEmojisMode={SuggestionMode.RECENT}
              autoFocusSearch={false}
              lazyLoadEmojis
              onEmojiClick={handleEmojiClick}
              searchPlaceHolder="Search emoji"
              previewConfig={{
                defaultEmoji: "1f4dd",
                defaultCaption: "Choose the perfect emoji for your task",
              }}
            />
          </EmojiPickerContainer>
          {currentEmoji && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveEmoji}
                sx={{ p: "8px 20px", borderRadius: "14px" }}
              >
                <RemoveCircleOutline /> &nbsp; Quitar emojis
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`;

// const EmojiName = styled.h5`
//   text-align: center;
//   margin: 0;
//   opacity: 0.8;
//   text-transform: capitalize;
// `;

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;
