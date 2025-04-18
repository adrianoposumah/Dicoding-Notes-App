import { showNotification } from "../utils/notification.js";
import notesData from "../data/local/notes.js"; // Import the notes data

const home = () => {
  const noteListElement = document.querySelector("note-list");
  const noteFormElement = document.querySelector("note-form");

  noteFormElement.setAttribute("title-max-length", "100");
  noteFormElement.setAttribute("body-max-length", "1000");

  const notes = [...notesData];

  const updateNotesList = () => {
    noteListElement.notes = notes;
  };

  updateNotesList();

  document.addEventListener("add-note", (event) => {
    const newNote = event.detail.note;
    notes.push(newNote);
    updateNotesList();

    showNotification("Note added successfully!");
  });

  document.addEventListener("delete-note", (event) => {
    const noteId = event.detail.id;
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      updateNotesList();
      showNotification("Note deleted successfully!");
    }
  });

  document.addEventListener("archive-note", (event) => {
    const { id, archived } = event.detail;
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex !== -1) {
      notes[noteIndex].archived = archived;
      updateNotesList();
      showNotification(`Note ${archived ? "archived" : "unarchived"} successfully!`);
    }
  });
};

export default home;
