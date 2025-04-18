const BASE_URL = "https://notes-api.dicoding.dev/v2";

const getNotes = () => {
  return fetch(`${BASE_URL}/notes`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        return data.data;
      }
      throw new Error(data.message || "An error occurred");
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

const getArchivedNotes = () => {
  return fetch(`${BASE_URL}/notes/archived`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        return data.data;
      }
      throw new Error(data.message || "An error occurred");
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

const createNote = (note) => {
  return fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: note.title,
      body: note.body,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        return data.data;
      }
      throw new Error(data.message || "An error occurred");
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

const archiveNote = (id) => {
  return fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.message || "An error occurred");
      }
      return data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

const unarchiveNote = (id) => {
  return fetch(`${BASE_URL}/notes/${id}/unarchive`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.message || "An error occurred");
      }
      return data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

const deleteNote = (id) => {
  return fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.message || "An error occurred");
      }
      return data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};

export {
  getNotes,
  getArchivedNotes,
  createNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
};
