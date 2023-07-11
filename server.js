const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

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