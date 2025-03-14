let produtosData = []; // Armazena os produtos carregados
let imagensProduto = []; // Armazena imagens do produto no modal
let imagemAtual = 0; // Índice da imagem no carrossel

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

        atualizarTabelaProdutos(produtosData);

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(error.message);
    }
}

// 🔄 Atualiza a tabela com os produtos recebidos
function atualizarTabelaProdutos(produtos) {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = "";

    produtos.forEach(produto => {
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

        atualizarTabelaProdutos(data);

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
        document.getElementById("modalPreco").textContent = produto.valor.toFixed(2);

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
                document.getElementById("modalImagem").src = `data:${imagensProduto[0].tipoArquivo};base64,${imagensProduto[0].dados}`;
            } else {
                document.getElementById("modalImagem").src = "placeholder.jpg";
            }
        }

        abrirModal(); // Exibe o modal

    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        alert("Erro ao carregar detalhes do produto.");
    }
}

// 📌 Função para abrir o modal corretamente
function abrirModal() {
    const modal = document.getElementById("produtoModal");
    const overlay = document.getElementById("modalOverlay");

    modal.style.display = "block";
    overlay.style.display = "block"; // Exibe fundo escuro

    // Centraliza o modal na tela
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
}

// ❌ Função para fechar o modal
function fecharModal() {
    document.getElementById("produtoModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

// 🏆 Funções do carrossel
document.getElementById("prevBtn").addEventListener("click", () => {
    if (imagensProduto.length > 0) {
        imagemAtual = (imagemAtual - 1 + imagensProduto.length) % imagensProduto.length;
        document.getElementById("modalImagem").src = `data:${imagensProduto[imagemAtual].tipoArquivo};base64,${imagensProduto[imagemAtual].dados}`;
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (imagensProduto.length > 0) {
        imagemAtual = (imagemAtual + 1) % imagensProduto.length;
        document.getElementById("modalImagem").src = `data:${imagensProduto[imagemAtual].tipoArquivo};base64,${imagensProduto[imagemAtual].dados}`;
    }
});

// 🛑 Fechar ao clicar no botão de fechar ou fora do modal
document.querySelector(".close").addEventListener("click", fecharModal);
document.getElementById("modalOverlay").addEventListener("click", fecharModal);

// 🔥 Evento de carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});
