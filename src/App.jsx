import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteServices from './services/notes';
import './index.css';

const Footer = () => {
  const footerStyle = {//estilo en linea
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Departament of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const Notification = ({ message }) => {//componente para mostrar mensajes de error
  if (message === null) {
    return null;
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null); 
  
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
    const note = notes.find(n => n.id === id); //buscar la nota por id
    const changedNote = {...note, important: !note.important};//crear una copia de la nota con la importancia cambiada

    noteServices
      .update(id, changedNote)//actualizar la nota en el servidor
      .then(returnedNote => {// si la actualización es exitosa, actualizar el estado de las notas 
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
      })
      .catch(error => {// maneja el error si la nota no existe en el servidor
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null);// limpiar el mensaje de error después de 5 segundos
        }, 5000)
        setNotes(notes.filter(n => n.id !== id));// eliminar la nota del estado local
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
      <Notification message={(errorMessage)} />
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
      <Footer />
    </div>
  )
}
export default App;