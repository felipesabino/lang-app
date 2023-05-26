"use client";
import { useTranslation } from "react-i18next";

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
import { normalizeLanguageTranslation } from "@/app/i18n/normalization";

registerCoreBlocks();

const NewStoryForm = () => {
  const { t, i18n } = useTranslation();

  const [newStoryId, setNewStoryId] = useState<string | null>(null);
  const shouldStoryBeCustomized = useFieldAnswer("story-customized");
  const currentTargetLanguage = useFieldAnswer("language");

  useEffect(() => {
    if (newStoryId) {
      redirect(`${i18n.language}/waiting/${newStoryId}`);
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
          source: normalizeLanguageTranslation(i18n.language),
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
            "label.button.ok": t("story.new.form.label.button.ok") + "",
            "label.hintText.enter": t("story.new.form.label.hintText.enter") + "",
            "label.hintText.multipleSelection": t("story.new.form.label.hintText.multipleSelection") + "",
            "block.dropdown.placeholder": t("story.new.form.block.dropdown.placeholder") + "",
            "block.dropdown.noSuggestions": t("story.new.form.block.dropdown.noSuggestions") + "",
            "block.shortText.placeholder": t("story.new.form.block.shortText.placeholder") + "",
            "block.longText.placeholder": t("story.new.form.block.longText.placeholder") + "",
            "block.longText.hint": t("story.new.form.block.longText.hint") + "",
            "block.number.placeholder": t("story.new.form.block.number.placeholder") + "",
            "block.email.placeholder": t("story.new.form.block.email.placeholder") + "",
            "block.defaultThankYouScreen.label": t("story.new.form.block.defaultThankYouScreen.label") + "",
            "label.hintText.key": t("story.new.form.label.hintText.key") + "",
            "label.progress.percent": t("story.new.form.label.progress.percent") + "",
            "label.errorAlert.required": t("story.new.form.label.errorAlert.required") + "",
            "label.errorAlert.date": t("story.new.form.label.errorAlert.date") + "",
            "label.errorAlert.number": t("story.new.form.label.errorAlert.number") + "",
            "label.errorAlert.selectionRequired": t("story.new.form.label.errorAlert.selectionRequired") + "",
            "label.errorAlert.email": t("story.new.form.label.errorAlert.email") + "",
            "label.errorAlert.url": t("story.new.form.label.errorAlert.url") + "",
            "label.errorAlert.range": t("story.new.form.label.errorAlert.range") + "",
            "label.errorAlert.minNum": t("story.new.form.label.errorAlert.minNum") + "",
            "label.errorAlert.maxNum": t("story.new.form.label.errorAlert.maxNum") + "",
            "label.errorAlert.maxCharacters": t("story.new.form.label.errorAlert.maxCharacters") + "",
            "label.submitBtn": t("story.new.form.label.submitBtn") + "",
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
            setSubmissionErr(t("story.new.error"));
          }
        }}
      />
    </div>
  );
};

export default NewStoryForm;
