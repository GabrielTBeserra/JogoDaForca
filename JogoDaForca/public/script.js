var socket = io('http://localhost:3000');


socket.on("update-alfabeto", function(valor) {
    criarBotoes(valor);
});

socket.on("update-alfabeto-errado", function(valor) {
    createLetrasErrada(valor);
});

socket.on("update-game-text", function(valor) {
    atualizaForca(valor);
});



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

function atualizaForca(alfabeto) {
    const area = document.querySelector("#palavra");
    area.innerHTML = "";
    let text = document.createTextNode(alfabeto);
    area.appendChild(text);
}



function letraClicada(letra) {
    socket.emit("letraCLicada", letra);
}