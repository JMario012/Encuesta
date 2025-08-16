const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let db = new sqlite3.Database('./votes.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos votes.db');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS votos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidatoId INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.post('/api/vote', (req, res) => {
    const { candidatoId } = req.body;
    if (!candidatoId) {
        return res.status(400).json({ error: 'Falta el ID del candidato' });
    }

    const stmt = db.prepare("INSERT INTO votos (candidatoId) VALUES (?)");
    stmt.run(candidatoId, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Voto registrado', votoId: this.lastID });
    });
    stmt.finalize();
});

app.get('/api/results', (req, res) => {
    const query = `
        SELECT candidatoId, COUNT(*) AS count
        FROM votos
        GROUP BY candidatoId
        ORDER BY count DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.delete('/api/votes/reset', (req, res) => {
    db.run("DELETE FROM votos", [], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Votos eliminados: ${this.changes}` });
    });
});

app.listen(port, () => {
    console.log(`Servidor de backend corriendo en http://localhost:${port}`);
});