const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DBError:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team
    ORDER BY
    player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  console.log(playersArray);
  response.send(playersArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetail = `
  INSERT INTO
  cricket_team(player_name,jersey_number,role)
  VALUES
  ("Vishal",17,"bowler");`;
  const dbResponse = await db.run(addPlayerDetail);
  console.log(dbResponse);

  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const playerId = 1;
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id=1;`;
  const player = await db.get(getPlayerQuery);

  response.send(player);
});

//API 4
