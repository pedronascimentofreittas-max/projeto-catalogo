// ===========================================
// ESTADO GLOBAL (carrinho + favoritos)
// ===========================================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const TAXA_ENTREGA = 6.90;

// ===========================================
// ELEMENTOS COMUNS A TODAS AS PÁGINAS
// ===========================================

function atualizarContadores() {
    const carrinhoCount = document.getElementById("carrinho-count");
    const favoritosCount = document.getElementById("favoritos-count");

    if (carrinhoCount) {
        carrinhoCount.textContent = carrinho.reduce((total, item) => total + item.quantidade, 0);
    }
    if (favoritosCount) favoritosCount.textContent = favoritos.length;
}

atualizarContadores();

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ===========================================
// ELEMENTOS ESPECÍFICOS DO CATÁLOGO (index.html)
// ===========================================

const inputPesquisa = document.getElementById("pesquisa");

if (inputPesquisa) {
    inputPesquisa.addEventListener("input", pesquisar);
}

function pesquisar() {
    const texto = inputPesquisa.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {
        const nome = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = nome.includes(texto) ? "" : "none";
    });
}

const botoesCategoria = document.querySelectorAll(".categoria-btn");

botoesCategoria.forEach(botao => {
    botao.addEventListener("click", filtrarCategoria);
});

function filtrarCategoria(evento) {
    const categoria = evento.currentTarget.dataset.categoria;

    botoesCategoria.forEach(botao => botao.classList.remove("ativo"));
    evento.currentTarget.classList.add("ativo");

    document.querySelectorAll(".card").forEach(card => {
        const pertence =
            categoria === "Todos" ||
            card.dataset.categoria.split(",").includes(categoria);

        card.style.display = pertence ? "" : "none";
    });
}

const selectOrdenar = document.getElementById("ordenar");
const catalogo = document.querySelector(".catalogo");

if (selectOrdenar) {
    selectOrdenar.addEventListener("change", ordenarProdutos);
}

function ordenarProdutos() {
    const cards = Array.from(document.querySelectorAll(".card"));

    switch (selectOrdenar.value) {
        case "nome":
            cards.sort((a, b) => {
                const nomeA = a.querySelector("h3").textContent;
                const nomeB = b.querySelector("h3").textContent;
                return nomeA.localeCompare(nomeB);
            });
            break;

        case "preco-menor":
            cards.sort((a, b) => Number(a.dataset.preco) - Number(b.dataset.preco));
            break;

        case "preco-maior":
            cards.sort((a, b) => Number(b.dataset.preco) - Number(a.dataset.preco));
            break;

        default:
            return;
    }

    cards.forEach(card => catalogo.appendChild(card));
}

// ===========================================
// FAVORITAR / COMPRAR / QUANTIDADE / REMOVER
// ===========================================

document.addEventListener("click", (event) => {
    const botaoFavoritar = event.target.closest(".favoritar");
    const botaoComprar = event.target.closest(".comprar");
    const botaoAumentar = event.target.closest(".aumentar");
    const botaoDiminuir = event.target.closest(".diminuir");
    const botaoRemover = event.target.closest(".remover");

    if (botaoFavoritar) favoritar(botaoFavoritar);
    if (botaoComprar) comprar(botaoComprar);
    if (botaoAumentar) alterarQuantidade(botaoAumentar, 1);
    if (botaoDiminuir) alterarQuantidade(botaoDiminuir, -1);
    if (botaoRemover) removerDoCarrinho(botaoRemover);
});

function favoritar(botao) {
    const card = botao.closest(".card");
    const id = card.dataset.id;

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(item => item !== id);
    } else {
        favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    atualizarFavoritos();
    atualizarContadores();

    if (document.getElementById("card-template")) {
        renderizarFavoritos();
    }
}

function atualizarFavoritos() {
    document.querySelectorAll(".card").forEach(card => {
        const id = card.dataset.id;
        const botao = card.querySelector(".favoritar");
        if (!botao) return;

        const icone = botao.querySelector("i");

        if (favoritos.includes(id)) {
            icone.classList.remove("fa-regular");
            icone.classList.add("fa-solid");
            botao.classList.add("selecionado");
        } else {
            icone.classList.remove("fa-solid");
            icone.classList.add("fa-regular");
            botao.classList.remove("selecionado");
        }
    });
}

function comprar(botao) {
    const card = botao.closest(".card");
    const id = card.dataset.id;
    const qtd = Number(card.querySelector(".qtd").textContent);

    const produto = produtos.find(p => p.id == id);
    if (!produto) return;

    adicionarAoCarrinho({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria,
        emoji: produto.emoji,
        descricao: produto.descricao,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: qtd
    });
}

function adicionarAoCarrinho(item) {
    const existente = carrinho.find(produto => produto.id == item.id);

    if (existente) {
        existente.quantidade += item.quantidade;
    } else {
        carrinho.push(item);
    }

    salvarCarrinho();
    atualizarContadores();

    if (document.querySelector(".resumo-pedido")) {
        renderizarCarrinho();
    }
}

function alterarQuantidade(botao, delta) {
    const card = botao.closest(".card");
    const span = card.querySelector(".qtd");
    const novaQtd = Number(span.textContent) + delta;

    if (novaQtd < 1) return;

    span.textContent = novaQtd;

    if (document.querySelector(".resumo-pedido")) {
        const id = card.dataset.id;
        const item = carrinho.find(produto => produto.id == id);
        if (item) {
            item.quantidade = novaQtd;
            salvarCarrinho();
            atualizarContadores();
            atualizarResumoPedido();
        }
    }
}

function removerDoCarrinho(botao) {
    const card = botao.closest(".card");
    const id = card.dataset.id;

    carrinho = carrinho.filter(produto => produto.id != id);
    salvarCarrinho();
    atualizarContadores();
    renderizarCarrinho();
}

// ===========================================
// RENDERIZAÇÃO DA PÁGINA DE FAVORITOS
// ===========================================

function renderizarFavoritos() {
    const template = document.getElementById("card-template");

    if (!template || !catalogo) return;

    catalogo.textContent = "";

    const itensFavoritados = produtos.filter(p => favoritos.includes(p.id));

    if (itensFavoritados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.classList.add("mensagem-vazio");
        mensagem.textContent = "Você ainda não favoritou nenhum item. :/";
        catalogo.appendChild(mensagem);
        return;
    }

    itensFavoritados.forEach(produto => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".card");

        card.dataset.id = produto.id;
        card.dataset.categoria = produto.categoria;
        card.dataset.preco = produto.preco;

        card.querySelector(".card-img").src = produto.imagem;
        card.querySelector(".card-img").alt = produto.nome;
        card.querySelector(".card-nome").textContent = produto.nome;
        card.querySelector(".card-categoria").textContent = `${produto.emoji} ${produto.categoria}`;
        card.querySelector(".card-descricao").textContent = produto.descricao;
        card.querySelector(".card-preco").textContent =
            `R$ ${produto.preco.toFixed(2).replace(".", ",")}`;

        const icone = card.querySelector(".favoritar i");
        icone.classList.remove("fa-regular");
        icone.classList.add("fa-solid");
        card.querySelector(".favoritar").classList.add("selecionado");

        catalogo.appendChild(clone);
    });
}

// ===========================================
// RENDERIZAÇÃO DA PÁGINA DO CARRINHO
// ===========================================

function renderizarCarrinho() {
    const template = document.getElementById("card-template");
    const listaCarrinho = document.querySelector("section.carrinho");

    if (!template || !listaCarrinho) return;

    listaCarrinho.querySelectorAll(".card, .mensagem-vazio").forEach(el => el.remove());

    if (carrinho.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.classList.add("mensagem-vazio");
        mensagem.textContent = "Seu carrinho está vazio. :/";
        listaCarrinho.appendChild(mensagem);
        atualizarResumoPedido();
        return;
    }

    carrinho.forEach(item => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".card");

        card.dataset.id = item.id;
        card.dataset.categoria = item.categoria;
        card.dataset.preco = item.preco;

        card.querySelector(".card-img").src = item.imagem;
        card.querySelector(".card-img").alt = item.nome;
        card.querySelector(".card-nome").textContent = item.nome;
        card.querySelector(".card-categoria").textContent = `${item.emoji} ${item.categoria}`;
        card.querySelector(".card-descricao").textContent = item.descricao;
        card.querySelector(".card-preco").textContent =
            `R$ ${item.preco.toFixed(2).replace(".", ",")}`;
        card.querySelector(".qtd").textContent = item.quantidade;

        listaCarrinho.appendChild(clone);
    });

    atualizarFavoritos();
    atualizarResumoPedido();
}

function atualizarResumoPedido() {
    const subtotalEl = document.getElementById("subtotal-valor");
    const entregaEl = document.getElementById("entrega-valor");
    const totalEl = document.getElementById("total-valor");

    if (!subtotalEl) return;

    const subtotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    const entrega = carrinho.length > 0 ? TAXA_ENTREGA : 0;
    const total = subtotal + entrega;

    subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
    entregaEl.textContent = entrega > 0 ? `R$ ${entrega.toFixed(2).replace(".", ",")}` : "Grátis";
    totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

const botaoFinalizar = document.querySelector(".btn-finalizar");
if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", finalizarCompra);
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    alert("Compra finalizada com sucesso! Obrigado pela preferência 🍣");
    carrinho = [];
    salvarCarrinho();
    atualizarContadores();
    renderizarCarrinho();
}

// ===========================================
// INICIALIZAÇÃO
// ===========================================

atualizarFavoritos();
renderizarFavoritos();
renderizarCarrinho();