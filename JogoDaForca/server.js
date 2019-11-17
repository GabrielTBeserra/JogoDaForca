// Import das bubliotecas
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// import dos alfabetos
const alfabeto = require('./alfebetos').alfabeto;
const alfabetoDefault = require('./alfebetos').alfabetoDefault;
const alfabeto_posicoes = require('./alfebetos').alfabeto_posicoes;

// import do array de imagens
const images = require("./forca_images").images;

// declaracao da porta ultilizada
const PORT = require("./config").port;

// Configuracao da palavra escolhida
const PALAVRA = require("./config").PALAVRA.toLowerCase();

// Configuracao do path publico do ejs e do express
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Configuracao da port do servidor e mensagem de inicializacao
server.listen(PORT, function(data) {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Retorna o index no path /
app.use('/', (req, res) => {
    res.render('index.html');
})

// Guarda as respectivas posicoes das letras no alfabeto
var alfabetoPosicoes = [];

// Array enviado para o front com a substituicao das letras em seus devidos lugares
var palavraEnvioJogo = [];

// Lista das letras que nao estao incorretas
var alfabetoIncorreto = [];

// index da quantidade de erros relacionada a image
var indexImage = 1;

// array de imagens, iniciado com 0 que e apenas o desenho padrao
var image = images[0];


io.on('connection', socket => {

    emit(socket, "update-alfabeto", alfabeto);
    emit(socket, "update-alfabeto-errado", alfabetoIncorreto);
    emit(socket, "update-game-text", palavraEnvioJogo.join(" "));
    emit(socket, "update-image", image);
    emit(socket, "update-chat", socket.id);


    broadcast(socket, "update-chat", socket.id);

    //socket.broadcast.emit("update-chat", socket.id);
    broadcast(socket, "update-image", image);
    broadcast(socket, "update-game-text", palavraEnvioJogo.join(" "));
    broadcast(socket, "update-alfabeto", alfabeto);
    broadcast(socket, "update-alfabeto-errado", alfabetoIncorreto);


    socket.on("letraCLicada", function(letra) {
        // Verifica se o jogo ja foi encerrado por derrota ou vitoria, em caso de sim ele nao deixa atualizar mais os eventos
        if (indexImage < 11 && palavraEnvioJogo.indexOf("_") > -1) {
            atualizarAlfabetos(letra);
        }

        emit(socket, "update-alfabeto", alfabeto);
        emit(socket, "update-alfabeto-errado", alfabetoIncorreto);
        emit(socket, "update-game-text", palavraEnvioJogo.join(" "));
        emit(socket, "update-image", image);

        broadcast(socket, "update-image", image);
        broadcast(socket, "update-game-text", palavraEnvioJogo.join(" "));
        broadcast(socket, "update-alfabeto", alfabeto);
        broadcast(socket, "update-alfabeto-errado", alfabetoIncorreto);

    });
})

// Encurtador de funcao de broadcast
function broadcast(socket, evento, valor) {
    socket.broadcast.emit(evento, valor);
}

// Encurtador de funcao de emit
function emit(socket, evento, valor) {
    socket.emit(evento, valor);
}

function atualizarAlfabetos(letra) {
    // Retira alfabeto normal
    let index = alfabeto.indexOf(letra);

    // Compara posicao da letra submitada com o alfabeto fixo
    let indexFixo = alfabetoDefault.indexOf(letra);

    // Troca as posicoes do array alfabetoPosicoes pelas letras devidas, e atualiza o array qeu vai para o front
    subistituicaoDeIndexPorLetra(indexFixo);

    if (index > -1) {
        alfabeto.splice(index, 1);
    }

    if (!(PALAVRA.includes(letra.toLowerCase()))) {
        alfabetoIncorreto.push(letra);
        atualizarImagem();
    }
}


// Verifica as posicoes do alfabeto fixo e compara com a posicao da letra selecionada, assim substituindo em seus devidos lugares
function subistituicaoDeIndexPorLetra(posicao) {
    for (let index = 0; index < alfabetoPosicoes.length; index++) {
        if (alfabetoPosicoes[index] == posicao) {
            for (var [key, value] of Object.entries(alfabeto_posicoes)) {
                if (posicao == value) {
                    palavraEnvioJogo[index] = key;
                }
            }
        }
    }
}



/* 
 * Inicializar o array alfabetoPosicoes com as posicoes das letras do alfabeto correspondente ao da palavra
 * Inicializar o array palavraEnvioJogo com "_" em todas posicoes para ser substituida em breve
 */
function carregarArray() {
    for (let index = 0; index < PALAVRA.length; index++) {
        let posi = PALAVRA.substring(index, index + 1).toUpperCase();
        for (var [key, value] of Object.entries(alfabeto_posicoes)) {
            if (posi == key) {
                alfabetoPosicoes[index] = value;
                palavraEnvioJogo[index] = "_";
            }
        }
    }
}


// Atualiza a imagem do jogo em caso de erro
function atualizarImagem() {
    if (indexImage > 10) {

    } else {
        image = images[indexImage];
        indexImage++;
    }
}


carregarArray();