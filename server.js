// Dependencies for application
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

// GET Notes - Callback
const getNotesFromFile = (callback) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      const notes = JSON.parse(data);
      callback(notes);
    }
  });
};

// SAVE Notes - Callback
const saveNotesToFile = (notes, callback) => {
  fs.writeFile(notesFilePath, JSON.stringify(notes), (err) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

// GET /api/notes - Fetches all notes
app.get('/api/notes', (req, res) => {
  getNotesFromFile((notes) => {
    res.json(notes);
  });
});

// POST /api/notes - Creates new note
app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  getNotesFromFile((notes) => {
    notes.push(newNote);
    saveNotesToFile(notes, (err) => {
      if (err) {
        res.status(500).json({ error: 'Server error' });
      } else {
        res.status(201).json({ success: true });
      }
    });
  });
});

// DELETE /api/notes/:id - Deletes specific note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  getNotesFromFile((notes) => {
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      notes.splice(noteIndex, 1);

      saveNotesToFile(notes, (err) => {
        if (err) {
          res.status(500).json({ error: 'Server error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// GET /notes - Returns notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// GET * - Returns index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});