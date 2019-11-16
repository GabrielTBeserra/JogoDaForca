var socket = io('http://200.185.249.90:25565');

// Atualiaza todos as letras que faltam ser jogadas
socket.on("update-alfabeto", function(valor) {
    criarBotoes(valor);
});

// Atualiza todas letras que foram jogadas porem incorretas
socket.on("update-alfabeto-errado", function(valor) {
    createLetrasErrada(valor);
});

// Recebe atualizar do chat
socket.on("update-chat", function(texto) {
    updateChat(texto);
});

// Atualiza as posicoes das letras que foram acertadas
socket.on("update-game-text", function(valor) {
    atualizaForca(valor);
});

// Atualiaza a imagem da forca comforme as letras sao erradas
socket.on("update-image", function(image) {
    atualizaImage(image);
});

// Bloqueia as letras para jogar, e informa o que o jogo terminou por que ja se passaram todas as jogadas
socket.on("block-keyboard-loser", function(loser) {
    //
})

// Bloqueia todas letras e informa quem foi o ganhados
socket.on("block-keyboard-win", function(loser) {
    //
})


function atualizaImage(imageUrl) {
    const image = document.querySelector("#image");


    image.innerHTML = "";

    let img = document.createElement("img");
    img.setAttribute("src", imageUrl);
    img.setAttribute("class", "image-game");

    image.appendChild(img);
}



//
function criarBotoes(alfabeto) {
    const area = document.querySelector("#game-letrasrestantes");

    area.innerHTML = "";

    alfabeto.forEach(element => {
        let botao = document.createElement("button");
        let text = document.createTextNode(element);
        botao.setAttribute("class", "botao-letra");
        botao.setAttribute("onClick", "letraClicada('" + element + "')")
        botao.appendChild(text);


        area.appendChild(botao);
    });
}

// Atualiza o campo de letras incorretas
function createLetrasErrada(alfabeto) {
    const area = document.querySelector("#game-letraesrradas");

    area.innerHTML = "";

    let h1 = document.createElement("h4");
    let texto = document.createTextNode("Letras erradas");
    h1.appendChild(texto);
    area.appendChild(h1);

    alfabeto.forEach(element => {
        let p = document.createElement("p");
        let text = document.createTextNode(element);
        p.setAttribute("class", "letraErrada");
        p.appendChild(text);
        area.appendChild(p);
    });
}

// Atualiza o texto da forca
function atualizaForca(alfabeto) {
    const area = document.querySelector("#palavra");
    area.innerHTML = "";
    let text = document.createTextNode(alfabeto);
    area.appendChild(text);
}


// Envia para o servidor qual letra foi clicada
function letraClicada(letra) {
    socket.emit("letraCLicada", letra);
}

// Atualiza o chat de join players 
function updateChat(texto) {
    const chat = document.querySelector("#game-chat");
    chat.innerHTML = "";
    let p = document.createElement("p");
    let text = document.createTextNode(texto);
    p.appendChild(text);
    chat.appendChild(p);
}