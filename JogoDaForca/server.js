const alfabeto = require('./alfebetos').alfabeto;
const alfabetoDefault = require('./alfebetos').alfabetoDefault;
const alfabeto_posicoes = require('./alfebetos').alfabeto_posicoes;

const images = [
    "forca_images/1.png",
    "forca_images/2.png",
    "forca_images/3.png",
    "forca_images/4.png",
    "forca_images/5.png",
    "forca_images/6.png",
    "forca_images/7.png",
    "forca_images/8.png",
    "forca_images/9.png",
    "forca_images/10.png",
    "forca_images/11.png"
];

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 25565;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


server.listen(PORT, function(data) {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use('/', (req, res) => {
    res.render('index.html');
})

var palavra = "paralelepipedo";
var posicoesPalavra = [];
var palavraFinal = [];
var alfabetoClicado = [];
var letrasCorretas = [];
var indexImage = 1;
var image = images[0];


io.on('connection', socket => {
    socket.emit("update-alfabeto", alfabeto);
    socket.emit("update-alfabeto-errado", alfabetoClicado);
    socket.emit("update-game-text", palavraFinal.join(" "));
    socket.emit("update-image", image);


    socket.broadcast.emit("update-image", image);
    socket.broadcast.emit("update-game-text", palavraFinal.join(" "));
    socket.broadcast.emit("update-alfabeto", alfabeto);
    socket.broadcast.emit("update-alfabeto-errado", alfabetoClicado);


    socket.on("letraCLicada", function(letra) {
        if (indexImage < 11 && palavraFinal.indexOf("_") > -1) {
            updateLetra(letra);
        }

        socket.emit("update-alfabeto", alfabeto);
        socket.emit("update-alfabeto-errado", alfabetoClicado);
        socket.emit("update-game-text", palavraFinal.join(" "));
        socket.emit("update-image", image);

        socket.broadcast.emit("update-image", image);
        socket.broadcast.emit("update-game-text", palavraFinal.join(" "));
        socket.broadcast.emit("update-alfabeto", alfabeto);
        socket.broadcast.emit("update-alfabeto-errado", alfabetoClicado);

    });
})


function updateLetra(letra) {
    let index = alfabeto.indexOf(letra);
    let index2 = alfabetoDefault.indexOf(letra);

    trocaDeIndex(index2);

    if (index > -1) {
        alfabeto.splice(index, 1);
    }

    if (palavra.includes(letra.toLowerCase())) {
        letrasCorretas.push(letra);
    } else {
        alfabetoClicado.push(letra);
        addError();
    }
}

function addError() {
    if (indexImage > 10) {

    } else {
        image = images[indexImage];
        indexImage++;
    }
}

function trocaDeIndex(posicao) {
    for (let index = 0; index < posicoesPalavra.length; index++) {
        if (posicoesPalavra[index] == posicao) {
            for (var [key, value] of Object.entries(alfabeto_posicoes)) {
                if (posicao == value) {
                    palavraFinal[index] = key;
                }
            }
        }
    }
}

const getCharPositions = searchChar => palavra.split('').reduce((acc, char, index) => {
    if (char === searchChar) {
        return [...acc, index]
    }
    return acc
}, [])

changeToPosition();

function changeToPosition() {
    for (let index = 0; index < palavra.length; index++) {
        let posi = palavra.substring(index, index + 1).toUpperCase();
        for (var [key, value] of Object.entries(alfabeto_posicoes)) {
            if (posi == key) {
                posicoesPalavra[index] = value;
                palavraFinal[index] = "_";
            }
        }
    }
}