let produtosData = []; // Lista de produtos carregados
let imagensProduto = []; // Lista de imagens do produto no modal
let imagemAtual = 0; // Índice da imagem exibida

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

        // Ordena produtos por código (decrescente)
        produtosData = data.sort((a, b) => b.codigo - a.codigo);

        // Atualiza a tabela de produtos
        atualizarTabelaProdutos();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(error.message);
    }
}

// 🔄 Atualiza a tabela com os produtos
function atualizarTabelaProdutos() {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = ""; // Limpa a tabela antes de preencher

    produtosData.forEach(produto => {
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
    });
}

// 🔍 Filtro de produtos em tempo real
document.getElementById("buscarProduto").addEventListener("input", function () {
    let termoBusca = this.value.trim().toLowerCase();
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = ""; // Limpa a tabela

    let produtosFiltrados = produtosData.filter(produto =>
        produto.nome.toLowerCase().includes(termoBusca)
    );

    produtosFiltrados.forEach(produto => {
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
    });

    // Se o campo estiver vazio, exibe todos os produtos novamente
    if (termoBusca === "") {
        atualizarTabelaProdutos();
    }
});

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

// ❌ Fechar o modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("produtoModal").style.display = "none";
});

// 🔥 Evento de carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});
