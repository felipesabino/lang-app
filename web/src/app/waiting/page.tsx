"use client";

export default function Waiting() {
  const styles = {
    container: {
      maskImage:
        "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
      WebkitMaskImage:
        "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
    },
  };

  const sentences = [
    "Ai is thinking about your story",
    "Hiring an virtual writer",
    "Too expensive, rescinding contract",
    "AI decided to write it by themselves",
    "Finding a dictionary to translate text",
    "Fixing grammar",
    "Reading out loud to record audio",
    "Ai is thinking about your story",
  ];

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex items-center text-3xl font-semibold" style={styles.container}>
        <div className="h-12 m-auto overflow-hidden">
          <ul className="p-0 mx-0 my-y2.5 animate-waiting-room">
            {sentences.map((sentence, index) => (
              <li className="flex items-center h-12 list-none text-gray-300" key={`sentence-${index}`}>
                {sentence}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
