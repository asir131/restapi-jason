import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
	// State Lifting
	// states
	const [noteTitle, setNoteTitle] = useState("");
	const [notes, setNotes] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [editableNote, setEditableNote] = useState(null);

	const submitHandler = (event) => {
		if (!noteTitle) {
			return alert(`Please provide a valid note title`);
		}
		event.preventDefault();
		editMode ? updateHandler() : createHandler();

		// notes.push(note);
	};

	const getAllNotes = () => {
		fetch(`http://localhost:8000/notes`)
			.then((res) => res.json())
			.then((data) => {
				setNotes(data);
			});
	};

	const createHandler = () => {
		console.log(noteTitle);

		const note = {
			id: Date.now() + "",
			title: noteTitle,
		};

		fetch(`http://localhost:8000/notes`, {
			method: "POST",
			body: JSON.stringify(note),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(() => {
			getAllNotes();
		});

		setNoteTitle("");
	};

	const removeHandler = (noteId) => {
		fetch(`http://localhost:8000/notes/${noteId}`, {
			method: "DELETE",
		}).then(() => {
			getAllNotes();
		});
		// noteId = 2
		// notes.splice()
		// const updatedNotes = notes.filter((note) => note.id !== noteId);
		// // 								()		=> 1 !== 2
		// //								()      => 2 !== 2

		// setNotes(updatedNotes);
		// notes = updatedNotes
	};

	const editHandler = (note) => {
		setEditMode(true);
		//editMode = true
		setEditableNote(note);
		// editableNote = note
		setNoteTitle(note.title);
	};

	const updateHandler = () => {
		const updatedNotes = notes.map((note) => {
      if (note.id === editableNote.id) {
          const updatedNote = {
              id: note.id,
              title: noteTitle,
          };

          fetch(`http://localhost:8000/notes/${note.id}`, {
              method: "PUT", 
              body: JSON.stringify(updatedNote),
              headers: {
                  "Content-Type": "application/json",
              },
          })
              .then(() => {
                  getAllNotes();
              })
              

           
      }

      return note;
  });
    

		console.log(updatedNotes);
		setNotes(updatedNotes);
		setEditMode(false);
		setEditableNote(null);
		setNoteTitle("");
	};

	useEffect(() => {
		getAllNotes();
	}, []);
	return (
		<div className="App">
			<form onSubmit={submitHandler}>
				<input
					type="text"
					value={noteTitle}
					onChange={(event) => setNoteTitle(event.target.value)}
				/>
				<button type="submit">
					{editMode ? "Update Note" : "Add Note"}
				</button>
			</form>
			<div className="notes">
				<h2>All Notes</h2>
				<ul className="note-list">
					{notes.map((note) => (
						<li key={note.id}>
							<span>{note.title}</span>
							<button onClick={() => editHandler(note)}>
								Edit
							</button>
							<button onClick={() => removeHandler(note.id)}>
								Remove
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default App;