
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

    if (!itensDiv) return;

    itensDiv.innerHTML = '';

    if (carrinho.length === 0) {
        itensDiv.innerHTML = '<p>O carrinho está vazio.</p>';
        document.getElementById('totalCarrinho').textContent = '0,00';
        atualizarResumoCompra(); // Atualiza o total corretamente mesmo com o carrinho vazio
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

    document.getElementById('totalCarrinho').textContent = totalCarrinho.toFixed(2).replace(".", ",");

    atualizarResumoCompra(); // Atualiza o total da compra sempre que o carrinho mudar
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

function atualizarResumoCompra() {
    let totalCarrinho = parseFloat(document.getElementById("totalCarrinho").textContent.replace(",", ".")) || 0;
    let totalFrete = 0;
    let totalFreteSpan = document.getElementById("totalfrete");
    let totalCompraSpan = document.getElementById("totalCompra");

    // Verifica se há um frete salvo no localStorage
    let freteSalvo = JSON.parse(localStorage.getItem("freteSelecionado"));
    if (freteSalvo) {
        totalFrete = parseFloat(freteSalvo.valor.replace(",", ".")) || 0;
        totalFreteSpan.textContent = freteSalvo.valor;
    } else {
        totalFreteSpan.textContent = "0,00";
    }

    let totalCompra = totalCarrinho + totalFrete;
    totalCompraSpan.textContent = totalCompra.toFixed(2).replace(".", ",");
}

// Atualiza o total da compra sempre que a página carregar
document.addEventListener("DOMContentLoaded", () => {
    atualizarResumoCompra();
});

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

//Parte do frete
document.addEventListener("DOMContentLoaded", () => {
    const inputCEP = document.querySelector(".inputFrete input");
    const calcularFreteBtn = document.querySelector(".inputFrete button");
    const resultadoFrete = document.getElementById("resultadoFrete");
    const botoesFrete = resultadoFrete.querySelectorAll("button");
    const totalFreteSpan = document.getElementById("totalfrete");
    const totalCompraSpan = document.getElementById("totalCompra");
    const totalCarrinhoSpan = document.getElementById("totalCarrinho");

    
    if (localStorage.getItem("cepSalvo")) {
        inputCEP.value = localStorage.getItem("cepSalvo");
    }

    // Restaurar visibilidade dos botões de frete se já foram calculados
    if (localStorage.getItem("freteCalculado") === "true") {
        botoesFrete.forEach(botao => botao.style.display = "inline-block");
    }

    // Formatação do CEP e salvamento
    inputCEP.addEventListener("input", () => {
        let cep = inputCEP.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (cep.length > 5) {
            cep = cep.substring(0, 5) + "-" + cep.substring(5, 8);
        }
        inputCEP.value = cep;

        // Salva o CEP no localStorage
        localStorage.setItem("cepSalvo", cep);
    });

    calcularFreteBtn.addEventListener("click", () => {
        const cep = inputCEP.value;
        const cepRegex = /^\d{5}-\d{3}$/;

        if (!cepRegex.test(cep)) {
            alert("Por favor, insira um CEP válido.");
            return;
        }

        // Define os preços dos fretes
        document.getElementById("precoPadrao").textContent = "10,00";
        document.getElementById("precoRegistrada").textContent = "15,00";
        document.getElementById("precoSedex").textContent = "25,00";

        // Exibe os botões e salva no localStorage que o frete foi calculado
        botoesFrete.forEach(botao => botao.style.display = "inline-block");
        localStorage.setItem("freteCalculado", "true");

        // Se já houver um frete salvo, reaplica
        restaurarFreteSelecionado();
    });

    function atualizarResumoCompra(frete, botaoSelecionado, tipoFrete) {
        let totalCarrinho = parseFloat(totalCarrinhoSpan.textContent.replace(",", ".")) || 0;
        let totalFrete = parseFloat(frete.replace(",", ".")) || 0;
        let totalCompra = totalCarrinho + totalFrete;

        totalFreteSpan.textContent = frete;
        totalCompraSpan.textContent = totalCompra.toFixed(2).replace(".", ",");

        // Atualiza estilos dos botões
        botoesFrete.forEach(botao => {
            botao.style.opacity = "0.5";
            botao.textContent = "Selecionar";
        });

        botaoSelecionado.style.opacity = "1";
        botaoSelecionado.textContent = "Selecionado";

        // Salva o frete no localStorage
        salvarFrete(tipoFrete, frete);
    }

    function salvarFrete(tipoFrete, valor) {
        localStorage.setItem("freteSelecionado", JSON.stringify({ tipo: tipoFrete, valor: valor }));
    }

    function restaurarFreteSelecionado() {
        let freteSalvo = JSON.parse(localStorage.getItem("freteSelecionado"));

        if (freteSalvo) {
            let botaoSelecionado = document.getElementById(`btn${freteSalvo.tipo}`);
            if (botaoSelecionado) {
                atualizarResumoCompra(freteSalvo.valor, botaoSelecionado, freteSalvo.tipo);
            }
        }
    }

    // Aplica o frete salvo ao carregar a página
    restaurarFreteSelecionado();

    document.getElementById("btnPadrao").addEventListener("click", function () {
        atualizarResumoCompra("10,00", this, "Padrao");
    });

    document.getElementById("btnRegistrada").addEventListener("click", function () {
        atualizarResumoCompra("15,00", this, "Registrada");
    });

    document.getElementById("btnSedex").addEventListener("click", function () {
        atualizarResumoCompra("25,00", this, "Sedex");
    });
});



window.adicionarAoCarrinho = function (produto) {
    let carrinho = getCarrinho();

    let itemExistente = carrinho.find(item => item.codigo === produto.codigo);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        produto.quantidade = 1;

        if (!produto.imagemPrincipal) {
            produto.imagemPrincipal = produto.imagem ? produto.imagem : './assets/logotipoFundo.png';
        }

        carrinho.push(produto);
    }

    salvarCarrinho(carrinho);
    atualizarContadorCarrinho();
}