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
adicionarAoCarrinho("hot rolls");
adicionarAoCarrinho("hot rolls");
adicionarAoCarrinho("hot rolls");
adicionarAosFavoritos("temaki");    
adicionarAosFavoritos("temaki");    
adicionarAosFavoritos("temaki");    



//carrinho
//remover item do carrinho

/** const botoesRemover =  document.querySelectorAll(".remover");
botoesRemover.forEach(botao=>{
    botao.addEventListener("click",()=>{
    const itemCarrinho = botao.closest (".item-carrinho");
    itemCarrinho.remove();
});
});

function atualizarCarrinho(){
    const itens =document.querySelectorAll(".item-carrinho");
    itens.forEach(item=>{
        const botao=item.querySelector("remover");
        botao.addEventListener("click",()=>{
            item.remove();
            //atualizar carrinho
            atualizarCarrinho( );
        })
    })
}
atualizarCarrinho() */