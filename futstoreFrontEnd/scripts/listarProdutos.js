let produtosData = []; // Armazena todos os produtos carregados
let imagensProduto = []; // Armazena imagens do produto no modal
let imagemAtual = 0; // Índice da imagem no carrossel
let produtosExibidos = 0; // Contador de produtos já exibidos
const produtosPorPagina = 10; // Quantidade de produtos por página

// 🔄 Carregar produtos da API
async function carregarProdutos() {
    console.log("Carregando produtos...");

    const token = localStorage.getItem("token");

    try {
        let response = await fetch("http://localhost:8080/produtos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }

        let data = await response.json();
        console.log("Produtos recebidos:", data);

        // Ordena os produtos por código de forma decrescente
        produtosData = data.sort((a, b) => b.codigo - a.codigo);
        
        // Reinicia a exibição
        produtosExibidos = 0;
        atualizarTabelaProdutos();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(error.message);
    }
}

// 🔄 Atualiza a tabela com os produtos exibindo de forma paginada
function atualizarTabelaProdutos() {
    let tabela = document.getElementById("tabelaProdutos");

    for (let i = produtosExibidos; i < produtosExibidos + produtosPorPagina && i < produtosData.length; i++) {
        let produto = produtosData[i];

        let row = `<tr>
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.qtdEstoque}</td>
            <td>R$ ${produto.valor.toFixed(2)}</td>
            <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
            <td class="acoes">
                <button class="btn-edit">✏️ Editar</button>
                <button class="btn-status">${produto.ativo ? "❌ Inativar" : "✅ Ativar"}</button>
                <button class="btn-view" onclick="visualizarProduto(${produto.codigo})">👁️ Visualizar</button>
            </td>
        </tr>`;
        tabela.innerHTML += row;
    }

    produtosExibidos += produtosPorPagina;

    // Exibir ou ocultar botão "Ver Mais"
    document.getElementById("verMais").style.display = produtosExibidos < produtosData.length ? "block" : "none";
}

// 🔍 Buscar produto
async function buscarProduto() {
    const termoBusca = document.getElementById("buscarProduto").value.trim();
    if (!termoBusca) {
        carregarProdutos(); // Se o campo estiver vazio, recarrega todos os produtos
        return;
    }

    console.log(`Buscando produtos com nome: ${termoBusca}`);

    const token = localStorage.getItem("token");

    try {
        let response = await fetch(`http://localhost:8080/produtos/buscar?nome=${encodeURIComponent(termoBusca)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }

        let data = await response.json();
        console.log("Produtos encontrados:", data);

        // Atualiza tabela apenas com resultados da busca
        produtosData = data;
        produtosExibidos = 0;
        document.getElementById("tabelaProdutos").innerHTML = "";
        atualizarTabelaProdutos();

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert(error.message);
    }
}

// 🔎 Exibir detalhes do produto no modal
async function visualizarProduto(id) {
    const token = localStorage.getItem("token");

    try {
        let response = await fetch(`http://localhost:8080/produtos/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do produto: ${response.status}`);
        }

        let produto = await response.json();
        console.log("Detalhes do produto:", produto);

        // Atualiza os elementos do modal
        document.getElementById("modalNome").textContent = produto.nome;
        document.getElementById("modalAvaliacao").textContent = produto.avaliacao;
        document.getElementById("modalDescricao").textContent = produto.descricao;
        document.getElementById("modalPreco").textContent = `R$ ${produto.valor.toFixed(2)}`;

        // Obtém imagens do produto
        let imgResponse = await fetch(`http://localhost:8080/produtos/${id}/imagens`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (imgResponse.ok) {
            imagensProduto = await imgResponse.json();
            if (imagensProduto.length > 0) {
                imagemAtual = 0;
                atualizarCarrossel();
            } else {
                document.getElementById("modalImagem").src = "placeholder.jpg";
            }
        }

        // Exibe o modal
        document.getElementById("produtoModal").style.display = "flex";

    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        alert("Erro ao carregar detalhes do produto.");
    }
}

// 🔄 Atualiza a imagem no carrossel
function atualizarCarrossel() {
    document.getElementById("modalImagem").src = `data:${imagensProduto[imagemAtual].tipoArquivo};base64,${imagensProduto[imagemAtual].dados}`;
}

// 🏆 Funções do carrossel
document.getElementById("prevBtn").addEventListener("click", () => {
    if (imagensProduto.length > 0) {
        imagemAtual = (imagemAtual - 1 + imagensProduto.length) % imagensProduto.length;
        atualizarCarrossel();
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (imagensProduto.length > 0) {
        imagemAtual = (imagemAtual + 1) % imagensProduto.length;
        atualizarCarrossel();
    }
});

// ❌ Fechar o modal
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("produtoModal").style.display = "none";
});

// 🔥 Evento de carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});

// 📌 "Ver mais" - Exibir mais produtos
function carregarMaisProdutos() {
    atualizarTabelaProdutos();
}

document.getElementById("cadastrar").addEventListener("click", function(){
    window.location.href = "./cadastroProduto.html";
})



