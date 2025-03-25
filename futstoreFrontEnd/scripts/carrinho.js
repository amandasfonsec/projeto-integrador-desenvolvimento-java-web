
function getCarrinho() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarContadorCarrinho() {
    let carrinho = getCarrinho();
    let total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    let carrinhoBtn = document.getElementById('carrinhoBtn');
    if (carrinhoBtn) {
        carrinhoBtn.innerHTML = `<i class="fa fa-shopping-cart"></i> | Carrinho (${total})`;
    }
}

function listarCarrinho() {
    let carrinho = getCarrinho();
    let itensDiv = document.getElementById('itensCarrinho');
    let totalCarrinho = 0;
    
    // Impede erro em páginas que não tem carrinho
    if (!itensDiv) return;

    itensDiv.innerHTML = '';

    if (carrinho.length === 0) {
        itensDiv.innerHTML = '<p>O carrinho está vazio.</p>';
        document.getElementById('totalCarrinho').textContent = '0,00';
        return;
    }

    carrinho.forEach(item => {
        let subtotal = item.quantidade * item.valor;
        totalCarrinho += subtotal;

        itensDiv.innerHTML += `
            <div class="itemCarrinho">
                <img src="${item.imagemPrincipal || './assets/logotipoFundo.png'}" alt="${item.nome}" class="imagemProduto">
                <div class="detalhesProduto">
                    <h3>${item.nome}</h3>
                    <p>Preço: R$ ${item.valor}</p>
                    <div class="quantidade-controls">
                        <button onclick="alterarQuantidade(${item.codigo}, -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${item.codigo}, 1)">+</button>
                    </div>
                    <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
                    <button onclick="removerItem(${item.codigo})" class="remover-btn">Remover</button>
                </div>
            </div>
        `;
    });

    document.getElementById('totalCarrinho').textContent = totalCarrinho.toFixed(2);
}

function alterarQuantidade(codigo, delta) {
    let carrinho = getCarrinho();
    let item = carrinho.find(p => p.codigo === codigo);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(p => p.codigo !== codigo);
        }
        salvarCarrinho(carrinho);
        listarCarrinho();
        atualizarContadorCarrinho();
    }
}

function removerItem(codigo) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(p => p.codigo !== codigo);
    salvarCarrinho(carrinho);
    listarCarrinho();
    atualizarContadorCarrinho();
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
    listarCarrinho();

    const continuarBtn = document.getElementById('continuarComprando');
    const finalizarBtn = document.getElementById('finalizarCompra');

    if (continuarBtn) {
        continuarBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', () => {
            alert('Próximos sprints');
        });
    }


    
});



window.adicionarAoCarrinho = function(produto) {
    let carrinho = getCarrinho();
    
    let itemExistente = carrinho.find(item => item.codigo === produto.codigo);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        produto.quantidade = 1;

        // Se o produto não tem imagemPrincipal definida, recuperamos a correta
        if (!produto.imagemPrincipal) {
            produto.imagemPrincipal = produto.imagem ? produto.imagem : './assets/logotipoFundo.png';
        }

        carrinho.push(produto);
    }

    salvarCarrinho(carrinho);
    atualizarContadorCarrinho();
}