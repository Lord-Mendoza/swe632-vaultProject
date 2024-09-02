import React, { useEffect } from "react";

const DefaultNoteFile: React.FC = () => {
  const noteKey = "notes"; // The key under which the notes array will be stored in localStorage

  // Function to initialize notes in localStorage if not already present
  const initializeNotes = () => {
    // Retrieve existing notes from localStorage
    const existingNotes = JSON.parse(localStorage.getItem(noteKey) || "[]");

    // If no notes exist, create the initial notes
    if (existingNotes.length === 0) {
      const initialNotes = [
        {
          title: "Hello World",
          content: "Hello World",
          date: new Date().toISOString(),
        },
        {
          title: "Group Members",
          content: "Andy\nTrent\nLord",
          date: new Date().toISOString(),
        },
      ];

      // Store the initial notes in localStorage
      localStorage.setItem(noteKey, JSON.stringify(initialNotes));

      console.log("Initial notes created and stored:", initialNotes);
    } else {
      console.log("Notes already exist:", existingNotes);
    }
  };

  // Initialize the notes when the component is mounted
  useEffect(() => {
    initializeNotes();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Default Note</h1>
      <p>Check your browser's localStorage for the stored notes.</p>
    </div>
  );
};

export default DefaultNoteFile;
