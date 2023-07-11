// Dependencies for application
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

// Get Notes - Callback
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

// Save Notes - Callback
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