import { showNotification } from "../utils/notification.js";
import {
  getNotes,
  getArchivedNotes,
  createNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
} from "../data/api/note-api.js";
import AOS from "aos";

const home = async () => {
  const noteListElement = document.querySelector("note-list");
  const noteFormElement = document.querySelector("note-form");
  const mainLoader = document.getElementById("mainLoader");

  noteFormElement.setAttribute("title-max-length", "100");
  noteFormElement.setAttribute("body-max-length", "1000");

  let activeNotes = [];
  let archivedNotes = [];

  const loadNotes = async () => {
    try {
      mainLoader.showLoading("Memuat note...");

      activeNotes = await getNotes();
      archivedNotes = await getArchivedNotes();

      mainLoader.hideLoading(300).finally(() => {
        updateNotesList();
      });
    } catch (error) {
      mainLoader.hideLoading();
      showNotification(error.message || "Failed to load notes", "error");
    }
  };

  const updateNotesList = () => {
    const isShowingArchived = noteListElement.showArchived;
    noteListElement.notes = isShowingArchived ? archivedNotes : activeNotes;

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  await loadNotes();

  document.addEventListener("add-note", async (event) => {
    try {
      const noteData = event.detail.note;

      mainLoader.showLoading("Menambahkan note anda...");
      const newNote = await createNote(noteData);

      activeNotes.push(newNote);

      mainLoader.hideLoading().finally(() => {
        updateNotesList();
        showNotification("Note Berhasil ditambahkan!");
      });
    } catch (error) {
      mainLoader.hideLoading();
      showNotification(error.message || "Failed to add note", "error");
    }
  });

  document.addEventListener("delete-note", async (event) => {
    try {
      const noteId = event.detail.id;

      mainLoader.showLoading("Menghapus note...");
      await deleteNote(noteId);

      activeNotes = activeNotes.filter((note) => note.id !== noteId);
      archivedNotes = archivedNotes.filter((note) => note.id !== noteId);

      mainLoader.hideLoading().finally(() => {
        updateNotesList();
        showNotification("Note berhasil dihapus!");
      });
    } catch (error) {
      mainLoader.hideLoading();
      showNotification(error.message || "Gagal Menghapus note", "error");
    }
  });

  document.addEventListener("archive-note", async (event) => {
    try {
      const { id, archived } = event.detail;

      mainLoader
        .showLoading(archived ? "Archiving note..." : "Unarchiving note...")
        .setMessage(archived ? "Archiving note..." : "Unarchiving note...");

      if (archived) {
        await archiveNote(id);

        const noteToArchive = activeNotes.find((note) => note.id === id);
        if (noteToArchive) {
          noteToArchive.archived = true;
          archivedNotes.push(noteToArchive);
          activeNotes = activeNotes.filter((note) => note.id !== id);
        }
      } else {
        await unarchiveNote(id);

        const noteToUnarchive = archivedNotes.find((note) => note.id === id);
        if (noteToUnarchive) {
          noteToUnarchive.archived = false;
          activeNotes.push(noteToUnarchive);
          archivedNotes = archivedNotes.filter((note) => note.id !== id);
        }
      }

      mainLoader.hideLoading().finally(() => {
        updateNotesList();
        showNotification(
          `Note berhasil ${archived ? "diarsipkan" : "ditampilkan"}!`,
        );
      });
    } catch (error) {
      mainLoader.hideLoading();
      showNotification(
        error.message || `Failed to ${archived ? "archive" : "unarchive"} note`,
        "error",
      );
    }
  });

  noteListElement.addEventListener("archive-toggle", () => {
    updateNotesList();
  });
};

export default home;
