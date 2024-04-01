import { createContext, useContext, useEffect, useState } from "react";

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
  const { onAddNote } = useContext(NoteContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddNote({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />
      <textarea
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
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  const { onAddNote, clearedNotes } = useContext(NoteContext);

  const [showArchive, setShowArchive] = useState(false);
  const [cleared] = clearedNotes;
  console.log(cleared, "hjaaaaa");
  return (
    <aside>
      <h2>Note archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive notes" : "Show archive notes"}
      </button>

      {showArchive && (
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
