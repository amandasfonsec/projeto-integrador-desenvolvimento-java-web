let produtosData = []; // Armazena todos os produtos carregados
let paginaAtual = 0; // Página atual da listagem
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

        // Ordena produtos por código (decrescente)
        produtosData = data.sort((a, b) => b.codigo - a.codigo);
        
        // Inicia na primeira página
        paginaAtual = 0;
        atualizarTabelaProdutos();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(error.message);
    }
}

// 🔄 Atualiza a tabela com os produtos exibindo apenas a página atual
function atualizarTabelaProdutos() {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = ""; // Limpa a tabela antes de atualizar

    const grupoUsuario = localStorage.getItem("grupo");

    let inicio = paginaAtual * produtosPorPagina;
    let fim = inicio + produtosPorPagina;
    let produtosPagina = produtosData.slice(inicio, fim);

    produtosPagina.forEach(produto => {
        let btnVisualizar = `<button class="btn-view" onclick="visualizarProduto(${produto.id || produto.codigo})">👁️ Visualizar</button>`;

        let btnInativar = `<button class="btn-status">${produto.ativo ? "❌ Inativar" : "✅ Ativar"}</button>`;
        let btnEditar = `<button class="btn-edit" onclick="editarProduto(${produto.codigo})">✏️ Editar</button>`;

        if (grupoUsuario === "ESTOQUISTA") {
            btnVisualizar = `<button class="btn-view disabled" disabled style="background-color: gray; cursor: not-allowed;">👁️ Visualizar</button>`;
            btnInativar = `<button class="btn-status disabled" disabled style="background-color: gray; cursor: not-allowed;">${produto.ativo ? "❌ Inativar" : "✅ Ativar"}</button>`;
        }

        let row = `<tr>
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.qtdEstoque}</td>
            <td>R$ ${produto.valor.toFixed(2)}</td>
            <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
            <td class="acoes">
                ${btnEditar}
                ${btnInativar}
                ${btnVisualizar}
            </td>
        </tr>`;

        tabela.innerHTML += row;
    });

    document.getElementById("paginaAnterior").style.display = paginaAtual > 0 ? "inline-block" : "none";
    document.getElementById("proximaPagina").style.display = fim < produtosData.length ? "inline-block" : "none";
}


// 🔄 Função para avançar para a próxima página
function proximaPagina() {
    if ((paginaAtual + 1) * produtosPorPagina < produtosData.length) {
        paginaAtual++;
        atualizarTabelaProdutos();
    }
}

// 🔄 Função para voltar para a página anterior
function paginaAnterior() {
    if (paginaAtual > 0) {
        paginaAtual--;
        atualizarTabelaProdutos();
    }
}

// 🔥 Evento de carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});

// 📌 Redirecionamento para cadastrar produto
document.getElementById("cadastrar").addEventListener("click", function(){
    window.location.href = "./cadastroProduto.html";
});

// 🔍 Filtro de produtos em tempo real
document.getElementById("buscarProduto").addEventListener("input", function () {
    let termoBusca = this.value.trim().toLowerCase();
    buscarProduto(termoBusca);
});

// 🔍 Função para buscar produtos (tanto pelo input quanto pelo botão)
function buscarProduto(termoBusca = null) {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = ""; // Limpa a tabela

    if (termoBusca === null) {
        termoBusca = document.getElementById("buscarProduto").value.trim().toLowerCase();
    }

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
}

// 🔄 Evento para o botão de busca
document.getElementById("buscarBtn").addEventListener("click", function () {
    buscarProduto();
});

async function editarProduto(id) {
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
            throw new Error(`Erro ao buscar produto para edição: ${response.status}`);
        }

        let produto = await response.json();
        console.log("Editando produto:", produto);

        // ✅ Garante que o ID do produto é salvo corretamente
        document.getElementById("editProdutoId").value = produto.id || produto.codigo;

        document.getElementById("editNome").value = produto.nome;
        document.getElementById("editDescricao").value = produto.descricao;
        document.getElementById("editValor").value = produto.valor;
        document.getElementById("editQtdEstoque").value = produto.qtdEstoque;

        // Exibir o modal de edição
        document.getElementById("modalEditarProduto").style.display = "flex";

    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        alert("Erro ao carregar produto para edição.");
    }
}



async function salvarEdicaoProduto() {
    const token = localStorage.getItem("token");

    let produtoId = document.getElementById("editProdutoId").value;

    if (!produtoId) {
        alert("Erro: ID do produto não encontrado.");
        return;
    }

    let produtoAtualizado = {
        nome: document.getElementById("editNome").value,
        descricao: document.getElementById("editDescricao").value,
        valor: parseFloat(document.getElementById("editValor").value),
        qtdEstoque: parseInt(document.getElementById("editQtdEstoque").value)
    };

    let formData = new FormData();
    formData.append("produto", new Blob([JSON.stringify(produtoAtualizado)], { type: "application/json" }));

    let imagemInput = document.getElementById("editImagemProduto");
    if (imagemInput.files.length > 0) {
        formData.append("imagensProduto", imagemInput.files[0]);
    }

    try {
        let response = await fetch(`http://localhost:8080/produtos/${produtoId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro ao editar produto: ${response.status}`);
        }

        alert("Produto atualizado com sucesso!");
        document.getElementById("modalEditarProduto").style.display = "none";
        carregarProdutos(); // Recarregar lista de produtos

    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto.");
    }
};

async function visualizarProduto(id) {
    const token = localStorage.getItem("token");

    // 🔴 Verificar se o ID está correto antes da requisição
    if (!id) {
        console.error("Erro: ID do produto não foi passado corretamente.");
        alert("Erro: Produto inválido.");
        return;
    }

    console.log("Visualizando produto ID:", id);

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

        // Atualizar os dados no modal de visualização
        document.getElementById("modalNome").textContent = produto.nome;
        document.getElementById("modalAvaliacao").textContent = produto.avaliacao || "N/A";
        document.getElementById("modalDescricao").textContent = produto.descricao;
        document.getElementById("modalPreco").textContent = `R$ ${produto.valor.toFixed(2)}`;

        // Buscar imagem do produto
        let imgResponse = await fetch(`http://localhost:8080/produtos/${id}/imagens`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (imgResponse.ok) {
            let imagensProduto = await imgResponse.json();
            if (imagensProduto.length > 0) {
                document.getElementById("modalImagem").src = `data:${imagensProduto[0].tipoArquivo};base64,${imagensProduto[0].dados}`;
            } else {
                document.getElementById("modalImagem").src = "placeholder.jpg";
            }
        }

        // Exibir o modal de visualização
        document.getElementById("produtoModal").style.display = "flex";

    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        alert("Erro ao carregar detalhes do produto.");
    }
}

function fecharModal() {
    document.getElementById("produtoModal").style.display = "none";
}

