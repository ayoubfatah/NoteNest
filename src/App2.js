import { useContext, useEffect, useRef, useState } from "react";
import useDate from "./useDate";
import { NoteProvider, useNotes } from "./NoteContext";
// 1. create a context

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    // 2. provide value to child components
    <NoteProvider>
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header />
        <Main />
        <Archive />
      </section>
    </NoteProvider>
  );
}

function Header() {
  const { onClearNotes } = useNotes();

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
  const { searchQuery, setSearchQuery } = useNotes();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search notes..."
    />
  );
}

function Results() {
  const { notes } = useNotes();
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
  const { notes } = useNotes();
  return (
    <section>
      <List notes={notes} />
    </section>
  );
}

function FormAddNote() {
  const ref = useRef();
  const { currentDate } = useDate();

  const { onAddNote } = useNotes();
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
    ref.current.focus();
  }, []);
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
        ref={ref}
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
  const { notes } = useNotes();
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
  const { onAddNote, clearedNotes } = useNotes();

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
