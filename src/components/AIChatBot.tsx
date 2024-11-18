import React, { useState } from "react";
import "./../styling/centerStyle.css";
import "./../styling/AiChatBot.css";

interface AIChatBotProps {
  entries: { [key: string]: any };  // Accept entries as props
  darkMode: boolean;
}

const Message = ({ text, sender }) => {
  return (
      <div className={`message ${sender}`}>
        <div className="message-bubble">{text}</div>
      </div>
  );
};

// updated chat-like UI AI-assisted
const AIChatBot: React.FC<AIChatBotProps> = ({ entries, darkMode }) => {
  const [messages, setMessages] = useState([{ text: 'Hi there! Ask me a question about your notes.', sender: 'bot' }]); // Keeps track of the conversation
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    // Add user's message to the chat
    const userMessage = { text: question, sender: 'user' };
    setMessages([...messages, userMessage]);

    setLoading(true);

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

    let result = "";

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
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      } else {
        result = "Error: No response stream available.";
      }
    } catch (error) {
      result = "Error occurred while fetching the response.";
    } finally {
      setMessages((prev) => [...prev, { text: result, sender: 'bot' }]); // Append bot's reply
      setQuestion(''); // Clear input field
      setLoading(false);
    }
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <div className="centered-heading">
        <h1>AI ChatBot</h1>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender}/>
        ))}
      </div>
      <div className="chatbot-input">
        <textarea
          id="question"
          rows={4}
          cols={50}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type question here..."
        />
        <button onClick={handleAskQuestion} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>
    </div>
  );
};

export default AIChatBot;
