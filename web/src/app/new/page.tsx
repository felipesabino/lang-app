"use client";

//@ts-ignore
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
import { Form, useFieldAnswer } from "@quillforms/renderer-core";
import "@quillforms/renderer-core/build-style/style.css";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getFormSteps } from "./components/form-steps";
import { TVoices } from "@/graphql/voices";
import { useApolloClient, FetchResult } from "@apollo/client";
import {
  CreateStoryDocument,
  CreateStoryMutation,
  CreateStoryMutationVariables,
  SupportedLanguages,
  StoryTheme,
} from "@/graphql/types-and-hooks";
import "./components/cutom-block-voices";

registerCoreBlocks();

const NewStoryForm = () => {
  const [newStoryId, setNewStoryId] = useState<string | null>(null);
  const shouldStoryBeCustomized = useFieldAnswer("story-customized");
  const currentTargetLanguage = useFieldAnswer("language");

  useEffect(() => {
    if (newStoryId) {
      redirect(`/waiting/${newStoryId}`);
    }
  });

  const client = useApolloClient();

  const createStory = async (data: any) => {
    const { answers } = data;
    const isCustomized = answers["story-customized"].value[0] === "Yes";

    const storyId = await client
      .mutate({
        mutation: CreateStoryDocument,
        variables: {
          voice: answers.voice.value as TVoices,
          target: answers.language.value[0] as SupportedLanguages,
          source: SupportedLanguages.En,
          theme: isCustomized ? answers.theme.value[0] : StoryTheme.Random,
          narrationStyle: isCustomized ? answers["narration-style"].value[0] : "",
          specificWords: isCustomized ? answers["specific-words"].value : "",
          gramarOptions: isCustomized ? answers["grammar-options"].value : "",
        } satisfies CreateStoryMutationVariables,
      })
      .then((result: FetchResult<CreateStoryMutation>): string => {
        return result.data!.createStory.storyId;
      });
    console.log(storyId);
    setNewStoryId(storyId);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Form
        formId={1}
        formObj={{
          hiddenFields: {},
          blocks: getFormSteps({
            //@ts-ignore
            shouldStoryBeCustomized: shouldStoryBeCustomized?.includes("Yes"),
            currentTargetLanguage: currentTargetLanguage ? (currentTargetLanguage as any[])[0].toString() : "",
          }),
          settings: {
            animationDirection: "horizontal",
            disableWheelSwiping: false,
            disableNavigationArrows: false,
            disableProgressBar: false,
            showQuestionsNumbers: false,
            showLettersOnAnswers: false,
          },
          theme: {
            font: "Roboto",
            buttonsBgColor: "#9b51e0",
            logo: {
              src: "",
            },
            questionsColor: "#000",
            answersColor: "#0aa7c2",
            buttonsFontColor: "#fff",
            buttonsBorderRadius: 25,
            errorsFontColor: "#fff",
            errorsBgColor: "#f00",
            progressBarFillColor: "#000",
            progressBarBgColor: "#ccc",
          },
          messages: {
            "block.defaultThankYouScreen.label": "Please wait while we generate your story!",
          },
        }}
        applyLogic={false}
        isPreview={false}
        onSubmit={async (data, { completeForm, setIsSubmitting, setSubmissionErr }) => {
          console.log(data);
          try {
            await createStory(data);
            setIsSubmitting(false);
            completeForm();
          } catch (e) {
            console.log(e);
            setSubmissionErr("Error creating your story, please try again.");
          }
        }}
      />
    </div>
  );
};

export default NewStoryForm;
