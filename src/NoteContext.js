import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clearedNotes, setClearedNotes] = useState([]);
  const searchedNotes =
    searchQuery.length > 0
      ? notes.filter((note) =>
          `${note.title} ${note.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : notes;

  function handleAddNote(note) {
    setNotes((notes) => [note, ...notes]);
  }

  function handleClearNotes() {
    setClearedNotes((n) => [notes, ...n]);
    setNotes([]);
  }

  return (
    <NoteContext.Provider
      value={{
        notes: searchedNotes,
        onClearNotes: handleClearNotes,
        onAddNote: handleAddNote,
        searchQuery,
        setSearchQuery,
        clearedNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined)
    throw new Error("NoteContexxt was used outside of the NoteProvider");
  return context;
}

export { NoteProvider, useNotes };
