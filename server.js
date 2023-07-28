const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


const PORT = process.env.PORT || 3001;
// Route to serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to read existing notes from the JSON file
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});
// Route to handle new note creation
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required" });
  }

  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }

    const notes = JSON.parse(data);
    const newNote = { title, text, id: notes.length + 1 };
    notes.push(newNote);

    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(notes),
      "utf8",
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to save note" });
        }
        res.json(newNote);
      }
    );
  });
});

// Route to handle note deletion
app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);

  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes" });
    }

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(notes),
      "utf8",
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to delete note" });
        }
        res.json({ message: "Note deleted successfully" });
      }
    );
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
