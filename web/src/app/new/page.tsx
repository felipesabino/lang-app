"use client"

//@ts-ignore
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
import { Form, useFieldAnswer} from "@quillforms/renderer-core";
import "@quillforms/renderer-core/build-style/style.css";
import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import { getFormSteps, FormStepsProps } from "./components/form-steps";

registerCoreBlocks();

const NewStoryForm = () => {

  const [formCompleted, setFormCompleted] = useState(false);
  const shouldStoryBeCustomized= useFieldAnswer("story-customized");

  useEffect(() => {
    if (formCompleted) {
      redirect('/story');
    }
  });

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Form
        formId={1}
        formObj={{
          hiddenFields: {},
          blocks: getFormSteps({
            //@ts-ignore
            shouldStoryBeCustomized: shouldStoryBeCustomized?.includes("Yes"),
          }),
          settings: {
            animationDirection: "horizontal",
            disableWheelSwiping: false,
            disableNavigationArrows: false,
            disableProgressBar: false
          },
          theme: {
            font: "Roboto",
            buttonsBgColor: "#9b51e0",
            logo: {
              src: ""
            },
            questionsColor: "#000",
            answersColor: "#0aa7c2",
            buttonsFontColor: "#fff",
            buttonsBorderRadius: 25,
            errorsFontColor: "#fff",
            errorsBgColor: "#f00",
            progressBarFillColor: "#000",
            progressBarBgColor: "#ccc"
          },
          messages: {
            "block.defaultThankYouScreen.label":
              "Please wait while we generate your story!"
          }
        }}
        applyLogic={false}
        isPreview={false}
        onSubmit={(data, { completeForm, setIsSubmitting }) => {
          setTimeout(() => {
            setIsSubmitting(false);
            completeForm();
            console.log(data);
            setFormCompleted(true);
          }, 500);
        }}
      />
    </div>
  );
};

export default NewStoryForm;
