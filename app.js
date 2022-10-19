const express = require("express");
const path = require("path")
const sqlite3 = require("sqlite3")
const {open} = require("sqlite") 

const app = express()
const dbPath = path.join(__dirname. "moviesData.db");
app.use(express.json())

let database = null 
const initializeDBAndServer = async() => {
    try {
        database = await open({filename: dbPath, driver: sqlite3.Database});
        app.listen(3000, () => {
            console.log("Server is running http://localhost:3000")
        });
    }
    catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1)
    }
};

initializeDBAndServer() 

const movieObject = (objectItem) => {
    return {
        movieId: objectItme.movie_id,
        directorId: objectItem.direactor_id,
        movieName: objectItem.movie_name,
        learActor: objectItem.lead_actor
    }
}

const DirectorObject = (objectDirectorItem) => {
    return {
        directorId: objectDirectorItem.director_id,
        directorName: objectDirectorItem.director_name
    }
}

/* API 1

 Path: `/movies/`
 Method: `GET`
 Returns a list of all movie names in the movie table */

 app.get("/movies/", async(request, response) => {
     const getMoviesQuery = `select * from movie order by movie_id;`;
     const movieArray = await database.all(getMoviesQuery)
     const movieArrayResult = movieArray.map((eachMovie) => movieObject(eachMovie))


     response.send(movieArrayResult)
 })

/*### API 2

 Path: `/movies/`
 Method: `POST`
Creates a new movie in the movie table. `movie_id` is auto-incremented */

app.post("/movies/", async(request, response) => {
    const {directorId, movieName, leadActor} = request.body;
    const createMovieQuery = `insert into movie(director_id, movie_name, lead_actor) values('${dirrectorId}', ${movieName}, '${leadActor};'`;
    const createMovieResponse = await database.run(createMovieQuery);

    response.send("Movie Successfully Added")
})

/*
API 3

 Path: `/movies/:movieId/`
 Method: `GET`
Returns a movie based on the movie ID */ 

app.get("/movies/:movieId/", async(request, response) => {
    const {movieId} = request.params;
    const getMovieDetailsQuery = `select * from movie where movie_id = ${movieId};`;
    const getMovieDetailsResponse = await database.get(getMovieDetailsQuery);


    response.send(movieObject(getMovieDetailsResponse))
})

/*API 4

 Path: `/movies/:movieId/`
 Method: `PUT`
Updates the details of a movie in the movie table based on the movie ID */

app.put("/movies/:movieId/", (request, response) = {
    const {movieId} = request.params;
    const {directorId, movieName, leadActor} = request.body;
    const updateMovieDetailsQuery = `update movie set director_id = ${directorId}, movie_name = ${movieName}, lead_actor = ${leadActor} where movie_id = ${movieId}`
    const updateMovieDetailsResponse = await database.run(updateMovieDetailsQuery)


    resonse.send("Movie Details Updated")
})

/* API 5

 Path: `/movies/:movieId/`
 Method: `DELETE`
Deletes a movie from the movie table based on the movie ID */ 

app.delete("/movies/:movieId/", async(request, response) = {
    const{movieId} = request.params;
    const deleteMovieQuery = delete from movie where movie_id = ${movieId};
    const deleteMovieResponse = await database.run(deleteMovieQuery)


    response.send("Movie Removed")

})

/* API 6

 Path: `/directors/`
 Method: `GET`
Returns a list of all directors in the director table */ 

app.get("/directors/", async(request, response) => {
    const getDirectorQuery = `select * from director`;
    const getDirectorReponse = await database.all(getDirectorQuery); 
    const getDirectorReponseResult = getDirectorReponse.map((eachDirector) => DirectorObject(eachDirector))


    response.send(getDirectorReponseResult)

})

/* API 7

 Path: `/directors/:directorId/movies/`
 Method: `GET`
Returns a list of all movie names directed by a specific director */ 

app.get("/directors/:directorId/movies/", async(request, response) => {
    const {directorId} = request.params;
    const getDirectorDetailsQuery = `select movie_name from movie where director_id = ${directorId};`;
    const getDirectorDetailsResponse = await database.get(getDirectorDetailsQuery);


    response.send(movieObject(getDirectorDetailsResponse))    
})



module.exports = app