import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client"
import './styles/main.css'
import NoteItem from "./components/NoteItem";

const baseURL = "http://127.0.0.1:8000";

const App = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState(null);
  // const [reloadNote, setReloadNote] = useState(0);


  const handleModal = (status) => {
    setModalVisibility(status);
  };

  const saveNote = async (e) => {
    if(e) {
      e.preventDefault();
    }
    handleModal(false);
    try {
      const resp = await fetch(`${baseURL}/notes/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: title, content: content})
      });
      
      if(resp.status === 201) {
        console.log("One Note created successfully");
        // setNotes(oldNotes => oldNotes.filter(note))
        const data = await resp.json();
        setTitle("");
        setContent("");
        setNotes(oldNotes => ([...oldNotes, data]));
      }
      else {
        throw Error("The url seems wrong");
      }
    }
    catch(err) {
      console.log(`POST Error: ${err.message}`);
    }
  };

  const addNote = (e) => {
    if(e) {
      e.preventDefault();
    }
    handleModal(true);
  };

  useEffect(() => {
    const getNotes = async () => {
      try {
        const resp = await fetch(`${baseURL}/notes/`);
        if(resp.status === 200) {
          const data = await resp.json();
          setNotes(data);
          console.log(data);
        }
        else {
          throw Error("The url seems wrong");
        }
      }
      catch(err) {
        console.log(`Get Error: ${err.message}`);
      }
    };

    getNotes();
  }, []);

  const handleNoteClick = async (id) => {
    try {
      const resp = await fetch(`${baseURL}/notes/${id}`, {
        method: "DELETE"
      });
      if(resp.status === 204) {
        setNotes((oldNotes) => oldNotes.filter(note => parseInt(note.id) !== parseInt(id))); 
        console.log(`Del Success`);
      }
      else {
        throw Error("The url seems wrong");
      }
    }
    catch(err) {
      console.log(`Delete Error: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="logo">
          <p className="title">Guest Book</p>
        </div>
        <div className="add-section">
          <a onClick={addNote} href="/" className="add-btn">Add Note</a>
        </div>
      </div>
      
      {notes && notes.length > 0 ?
        <div className="post-list">
          {notes.map((note, index) => <NoteItem 
            title={note.title} 
            content={note.content} 
            noteId={note.id}
            key={index}
            onClick={handleNoteClick}
          />
          )}
        </div>
      :
        <div className="posts">
          <p className="centerText">No Notes</p>
        </div>
      }
      <div className={modalVisibility ? "modal" : "modal-not-visible"}>
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-header-text">Add a Note</p>
            </div>
            <div>
              <button onClick={() => handleModal(false)} className="close-btn">X</button>
            </div>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                name="title"
                id="title" 
                className="form-control" 
                value={title} onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea 
                name="content" 
                id="content" 
                rows="5" 
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <button onClick={saveNote} className="btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.querySelector("#root")).render(<App />);