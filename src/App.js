import { createContext, useContext, useEffect, useState } from "react";
import useDate from "./useDate";
// 1. create a context
const NoteContext = createContext();

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);
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

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    // 2. provide value to child components
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
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header />
        <Main notes={searchedNotes} onAddNote={handleAddNote} />
        <Archive onAddNote={handleAddNote} />
      </section>
    </NoteContext.Provider>
  );
}

function Header() {
  const { onClearNotes } = useContext(NoteContext);

  return (
    <header>
      <h1>NoteNest</h1>
      <div>
        <Results />
        <SearchNotes />
        <button onClick={onClearNotes}>Clear notes</button>
      </div>
    </header>
  );
}

function SearchNotes() {
  const { searchQuery, setSearchQuery } = useContext(NoteContext);
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search notes..."
    />
  );
}

function Results() {
  const { notes } = useContext(NoteContext);
  return <p> {notes.length} Notes found</p>;
}

function Main() {
  return (
    <main>
      <FormAddNote />
      <Notes />
    </main>
  );
}

function Notes() {
  const { notes } = useContext(NoteContext);
  return (
    <section>
      <List notes={notes} />
    </section>
  );
}

function FormAddNote() {
  const { currentDate } = useDate();

  const { onAddNote } = useContext(NoteContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddNote({ title, body, time: currentDate });
    setTitle("");
    setBody("");
  }

  useEffect(() => {
    const handleKeyDown = function (e) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />
      <input
        className="bodyinput"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Note body"
      />
      <button>Add note</button>
    </form>
  );
}

function List() {
  const { notes } = useContext(NoteContext);
  return (
    <ul>
      {notes.map((note, i) => (
        <li key={i}>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
          <p className="time"> {note.time}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  const { onAddNote, clearedNotes } = useContext(NoteContext);

  const [showArchive, setShowArchive] = useState(false);
  const [cleared] = clearedNotes;
  return (
    <aside>
      <h2>Note archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive notes" : "Show archive notes"}
      </button>

      {showArchive && cleared && (
        <ul>
          {cleared.map((note, i) => (
            <li key={i}>
              <p>
                <strong>{note.title}:</strong> {note.body}
              </p>
              <button onClick={() => onAddNote(note)}>Add as new note</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default App;
