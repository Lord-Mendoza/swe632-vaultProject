import React, { useState } from "react";
import "./../styling/centerStyle.css";
import "./../styling/AiChatBot.css";

interface AIChatBotProps {
  entries: { [key: string]: any };  // Accept entries as props
  darkMode: boolean;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ entries, darkMode }) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle user question and get response from LLM
  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);
    setResponse(""); // Clear previous response

    // Prepare the prompt for the LLM
    const notesContent = Object.values(entries)
    .map((entry: any) => {
      const sections = entry.sections
        ? entry.sections.map((section: any) => `${section.sectionTitle}: ${section.content}`).join("\n")
        : entry.description; // If `sections` is undefined, fallback to description or other available content
      return `${entry.title} (${entry.insertDate}):\n${sections}`;
    })
    .join("\n\n");
  

    const prompt = `Here are the notes:\n${notesContent}\n\nUser Question: ${question}\n\nKeep responses short, do not include extra information\n`;

    try {
      const responseStream = await fetch(
        "https://ollamabox-secure.shir.one/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral",
            prompt: prompt,
          }),
        }
      );

      const reader = responseStream.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const messages = chunk
            .split("\n")
            .filter((line) => line.trim() !== "");

          for (const message of messages) {
            try {
              const json = JSON.parse(message);
              if (json.response) {
                result += json.response;
                setResponse(result);
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      } else {
        setResponse("Error: No response stream available.");
      }
    } catch (error) {
      setResponse("Error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="centered-heading">AI ChatBot</h1>
      <div className="form-group">
        <label htmlFor="question">Ask a question about your notes:</label>
        <textarea
          id="question"
          rows={4}
          cols={50}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <button onClick={handleAskQuestion} disabled={loading}>
        {loading ? "Loading..." : "Ask Question"}
      </button>
      <div className="response-container">
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default AIChatBot;
