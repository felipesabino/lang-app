import { capitalCase, sentenceCase } from "change-case";
import { AudioSpeed, Story } from "@/graphql/types-and-hooks";
import moment from "moment";
import { useTranslation } from "react-i18next";

export interface StoryTextBlockHeaderProps {
  story: Story;
  audioSpeedSelected: AudioSpeed | string;
}

export function StoryTextBlockHeader(props: StoryTextBlockHeaderProps) {
  const { t, i18n } = useTranslation();
  const { story } = props;

  return (
    <div className="text-sm mb-4 grid grid-cols-2 max-sm:grid-cols-1">
      <div className="col-span-2 max-sm:col-span-1">
        <span className="font-bold">{t("story.reading.header.generationDate")}: </span>
        {moment(story.generationRequestDate).format("DD MMM YYYY HH:mm")}
      </div>
      <div>
        <span className="font-bold">{t("story.reading.header.theme")}: </span>
        {t(`common.themes.${story.creationMetadata.theme}`)}
      </div>
      <div>
        <span className="font-bold">{t("story.reading.header.narrationStyle")}: </span>
        {t(`common.narrationStyles.${story.creationMetadata.narrationStyle}`)}
      </div>
      <div>
        <span className="font-bold">{t("story.reading.header.language")}: </span>
        {t(`common.languages.${story.creationMetadata.language.target}`)}
      </div>
      <div>
        <span className="font-bold">{t("story.reading.header.translatedTo")}: </span>
        {t(`common.languages.${story.creationMetadata.language.source}`)}
      </div>
      <div>
        <span className="font-bold">{t("story.reading.header.readingVoice")}: </span>
        {capitalCase(story.creationMetadata.voice)}
      </div>
      {story.creationMetadata.gramarOptions && story.creationMetadata.gramarOptions.length > 0 && (
        <div>
          <span className="font-bold">{t("story.reading.header.grammarOptions")}: </span>
          {story.creationMetadata.gramarOptions?.map((item) => t(`common.grammarOptions.${item}`)).join(", ")}
        </div>
      )}
      {story.creationMetadata.specificWords && story.creationMetadata.specificWords.length > 0 && (
        <div className="col-span-2 max-sm:col-span-1">
          <span className="font-bold">{t("story.reading.header.specificWords")}: </span>
          {story.creationMetadata.specificWords?.map((item) => `"${item}"`).join(", ")}
        </div>
      )}
      <div className="col-span-2 max-sm:col-span-1">
        <span className="font-bold">{t("story.reading.header.readingSpeed")}: </span>
        {t(`common.audioSpeeds.${props.audioSpeedSelected}`)}
      </div>
    </div>
  );
}
