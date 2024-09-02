// EditNotes.tsx
import React, { useState, useEffect } from "react";
import "./../styling/centerStyle.css";

const EditNotes: React.FC = () => {
  const noteKey = "notes"; // The key under which the notes array is stored in localStorage

  const [notes, setNotes] = useState<any[]>([]); // To store notes from localStorage
  const [selectedNote, setSelectedNote] = useState<string | null>(null); // To track the selected note
  const [noteContent, setNoteContent] = useState<string>(""); // To hold the content of the selected note

  // Fetch notes from localStorage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem(noteKey) || "[]");
    setNotes(storedNotes);
  }, []);

  // Handle note selection
  const handleNoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const noteId = event.target.value;

    const note = notes.find((n: any) => n.title === noteId);
    if (note) {
      setSelectedNote(noteId);
      setNoteContent(note.content);
    } else {
      setSelectedNote(null);
      setNoteContent("");
    }
  };

  // Handle content change in the textbox
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNoteContent(event.target.value);
  };

  // Save the updated note to localStorage
  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note: any) =>
        note.title === selectedNote ? { ...note, content: noteContent } : note
      );
      localStorage.setItem(noteKey, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      alert("Note updated successfully");
    }
  };

  return (
    <div>
      <h1 className="centerStyle">Edit Notes</h1>
      <div>
        <label htmlFor="noteSelect">Select Note:</label>
        <select
          id="noteSelect"
          value={selectedNote || ""}
          onChange={handleNoteChange}
        >
          <option value="">-- Select a Note --</option>
          {notes.map((note: any) => (
            <option key={note.title} value={note.title}>
              {note.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="noteContent">Note Content:</label>
        <textarea
          id="noteContent"
          rows={10}
          cols={50}
          value={noteContent}
          onChange={handleContentChange}
        />
      </div>
      <button onClick={saveNote}>Save Note</button>
    </div>
  );
};

export default EditNotes;
