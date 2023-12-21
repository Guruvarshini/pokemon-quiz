import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "***",
    port: 5433,
  });

  db.connect();
let quiz=[];
  db.query("SELECT * FROM pokemon", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      quiz = res.rows;
    }
    db.end();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};
let totalCorrect=0;
app.get("/", async (req, res) => {
    totalCorrect = 0;
    await nextQuestion();
    res.render("index.ejs", { question: currentQuestion });
  });

  app.post("/submit", (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if ((currentQuestion.names.split(" "))[0].toLowerCase() === answer.toLowerCase()) {
      totalCorrect++;
      isCorrect = true;
    }
  
    nextQuestion();
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect,
    });
  });

async function nextQuestion() {
    const randomPokemon = quiz[Math.floor(Math.random() * quiz.length)];
  
    currentQuestion = randomPokemon;
    console.log((currentQuestion.names.split(" "))[0].toLowerCase());
}

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
