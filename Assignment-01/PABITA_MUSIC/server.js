const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// used to send files
const path = require("path");

// used to automatically access images and css files from the assets/ folder
// without having to write explicit endpoints for each file
app.use(express.static("assets"));

app.use(express.urlencoded({ extended: true }));

// used to send a handlebars template back to the client
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

const music = [
    {songId: "S1", title: "Anti Hero", artist: "Taylor Swift", artistImage: "taylor.jpeg" },
    {songId: "S2", title: "Dynamite", artist: "BTS", artistImage: "bts.webp" },
    {songId: "S3", title: "7 Rings", artist: "Ariana Grande", artistImage: "ariana.webp" },  
    {songId: "S4", title: "Who says", artist: "Selena Gomez", artistImage: "selena.webp" },
]

let playlist = [];

// show all the detail of the songs from music array
app.get("/", (req, res) => {
    res.render("homepage-template", {
        layout: "my-layouts",
        musicList: music,
    })
});

//add song to the playlist array
app.post("/add-song/:songId", (req, res) => {
    if(req.body !== undefined) {
        const songId = req.params.songId;

        for (song of music) {
            if (song.songId === songId) {
                playlist.push({songId: song.songId, title: song.title, artist: song.artist, artistImage: song.artistImage});

                //res.redirect() to navigate the user to another endpoint of the server
                res.redirect("/playlist");
            }
        }      
    } else {
        res.send(`<p style="color: red;">There is a problem</p>`)
    }
    
})

// displays the songs on a user’s playlist
//show the playlist endpoint
app.get("/playlist", (req, res) => {
    res.render("playlist-template", {
        layout: "my-layouts",
        myPlaylist : playlist,
    })
} )

//delete song from the playlist array
app.post("/delete-song/:songId", (req, res) => {
    if(req.body !== undefined) {
        const songId = req.params.songId;

        //remove all the songs having same id
        for (let i=0; i < playlist.length; i++) {
            if (playlist[i].songId === songId) {
                // remove song found at position i from the list and no. of element to remove is 1
                playlist.splice(i,1); 
                i--; // to reset pointer
            }
        }    
        //res.redirect() to navigate the user to another endpoint of the server
        res.redirect("/playlist");  
    } else {
        res.send(`<p style="color: red;">There is a problem</p>`)
    }
    
})

const onHttpStart = () => {
  console.log(`The web server has started at http://localhost:${HTTP_PORT}`);
  console.log("Press Ctrl + C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);
