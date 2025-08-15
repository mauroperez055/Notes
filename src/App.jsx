import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteServices from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  
  //obtener todas las notas
  //se ejecuta una vez al inicio
  useEffect(() => {
    noteServices
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      })
  }, []);
  console.log('render', notes.length, 'notes');

  //agregar una nueva nota
  //se ejecuta al enviar el formulario
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    
    noteServices
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
  }

  //cambiar la importancia de una nota
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = {...note, important: !note.important};

    noteServices
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already removed from server`
        )
        setNotes(notes.filter(n => n.id !== id));
      })
  }

  //manejar el cambio del input de la nueva nota
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  //filtrar las notas para mostrar solo las importantes o todas
  const notesToShow = showAll 
  ? notes
  : notes.filter(note => note.important === true);
  
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => 
          <Note 
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />  
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}
export default App;