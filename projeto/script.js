console.log(document);
console.log(document.body)
console.log(document.title)

//const meuTitulo=document.querySelector("h1")
//console.log(meuTitulo)

//meuTitulo.textContent="testando com textContent";
//xss
//performace
// textcontent sempre indicado 
// createEçement.append.prePend.before.remove
//append nao exclui os nodes que já axistem ele apenas adiciona em suguida 
//preppend adiciona antes de todo mundo pré

//const meuSpan = document.createElement("span");
//meuSpan.textContent = "text-span"
//meuSpan.id = "span-local"
//console.log(meuSpan);
//meuTitulo.append(meuSpan)
//meuTitulo.prepend(meuSpan)

//meuTitulo.prepend("novo conteudo")

//meuTitulo.after("depois")// ADICIONA COMO IRMAO - fora do h1 literalmente depois/ adiciona fora do elemento que a gente adicionou
//meuTitulo.before("antes")//ADICIONA COMO IRMAO - fora do h1 literalmente antes/ adiciona fora do elemento que a gente adicionou

//meuSpan.after("NOVO CONTEUDO AAAAA")








let carrinho = [];
let favoritos = [];

// Função para atualizar o contador do carrinho
function atualizarContadores() {
    document.getElementById("carrinho-count").textContent = carrinho.length;
    document.getElementById("favoritos-count").textContent = favoritos.length;
}
//adicionar carrinho
function adicionarAoCarrinho(item) {
    carrinho.push(item);
    atualizarContadores();
}
//adicionar favotiros 
function adicionarAosFavoritos(item) {
    favoritos.push(item);
    atualizarContadores();
}
//atualizar ao carregar a página
atualizarContadores();

const inputPesquisa = document.getElementById("pesquisa");
const cards = document.querySelectorAll(".card");

inputPesquisa.addEventListener("input", pesquisar);

function pesquisar() {
    const texto = inputPesquisa.value.toLowerCase();

    cards.forEach(card => {
        const nome = card.querySelector("h3").textContent.toLowerCase();

        if (nome.includes(texto)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

const botoesCategoria = document.querySelectorAll(".categoria-btn");

botoesCategoria.forEach(botao => {
    botao.addEventListener("click", filtrarCategoria);
});

function filtrarCategoria(evento) {

    const categoria = evento.target.dataset.categoria;

    cards.forEach(card => {

      if (
    categoria === "Todos" ||
    card.dataset.categoria.split(",").includes(categoria)
    
) {
    card.style.display = "";
} else {
    card.style.display = "none";
}

    });

}











