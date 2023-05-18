/* eslint-disable @next/next/no-img-element */
/**
 * QuillForms Depndencies
 */
import { useMessages } from "@quillforms/renderer-core";

/**
 * React Dependencies
 */
import { useEffect, useState } from "react";

let timer: NodeJS.Timeout;
export const MyCustomBlockDisplay = (props: any) => {
  const { id, attributes, setIsValid, setIsAnswered, setValidationErr, isActive, val, setVal, next } = props;

  const { required, items } = attributes;
  const messages = useMessages();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playPreview = (audioUrl: string) => {
    if (audio) {
      audio.pause();
      audio.src = audioUrl;
      audio.play();
    } else {
      const tmp = new Audio(audioUrl);
      tmp.play();
      setAudio(tmp);
    }
  };

  useEffect(() => {
    if (!isActive) {
      clearTimeout(timer);
      audio?.pause();
    }
  }, [isActive, audio]);

  useEffect(() => {
    const checkfieldValidation = (value: any) => {
      if (required === true && (!value || value === "")) {
        setIsValid(false);
        setValidationErr(messages["label.errorAlert.required"]);
      } else {
        setIsValid(true);
        setValidationErr(null);
      }
    };
    checkfieldValidation(val);
    audio?.pause();
  }, [val, audio, required, setIsValid, setValidationErr, messages]);

  return (
    <>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          height: "120px",
          marginTop: "15px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {items.map((item: any, index: number) => {
          return (
            <li
              key={"item-" + index}
              style={{
                listStyle: "none",
                marginRight: "5px",
              }}
            >
              <div
                key={item.value}
                onClick={() => {
                  if (val !== item.value) {
                    setVal(item.value);
                    timer = setTimeout(() => {
                      setIsAnswered(true);
                      next();
                      audio?.pause();
                    }, 500);
                  } else {
                    clearTimeout(timer);
                    setIsAnswered(false);
                    setVal("");
                  }
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.text}
                  style={{
                    height: "85px",
                    width: "85px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    opacity: item.value === val ? "80%" : "100%",
                    filter: item.value === val ? "saturate(300%) contrast(70%)" : "",
                  }}
                />
              </div>
              <a
                href="#"
                onClick={() => {
                  playPreview(item.audioUrl);
                }}
              >
                preview
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};
