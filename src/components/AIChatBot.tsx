import React, { useState, useEffect } from "react";

const AIChatBot: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch notes from localStorage
  useEffect(() => {
    const fetchNotes = () => {
      const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      setNotes(storedNotes);
    };

    fetchNotes();
  }, []);

  // Function to handle user question and get response from LLM
  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);
    setResponse(""); // Clear previous response

    // Prepare the prompt for the LLM
    const notesContent = notes
      .map((note: any) => `${note.title}: ${note.content}`)
      .join("\n");
    const prompt = `Here are the notes:\n${notesContent}\n\nUser Question: ${question}`;

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
    <div>
      <h1>AI ChatBot</h1>
      <div>
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
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default AIChatBot;
