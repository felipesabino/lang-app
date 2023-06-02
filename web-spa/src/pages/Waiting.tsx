import { useParams } from "react-router-dom";
export const Waiting = () => {
  let { lng, storyId } = useParams();

  return (
    <h1 className="text-4xl font-bold underline text-green-500">
      Waiting for {lng} {storyId} to be translated
    </h1>
  );
};
