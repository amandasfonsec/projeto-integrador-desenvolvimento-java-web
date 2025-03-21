let produtosData = []; // Armazena todos os produtos carregados
let imagensProduto = []; // Armazena imagens do produto no modal
let imagemAtual = 0; // Índice da imagem no carrossel
let paginaAtual = 1;
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
    const tbody = document.getElementById("tabelaProdutos");
    tbody.innerHTML = ""; // Limpa o corpo da tabela

    const grupoUsuario = localStorage.getItem("grupo");

    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;

    const produtosPagina = produtosData.slice(inicio, fim);

    produtosPagina.forEach(produto => {
        let btnVisualizar = `<button class="btn-view" onclick="visualizarProduto(${produto.id || produto.codigo})">👁️ Visualizar</button>`;

        let btnInativar = `<button class="btn-status" onclick="alterarStatusProduto(${produto.codigo}, ${produto.ativo})">
    ${produto.ativo ? "❌ Inativar" : "✅ Ativar"}
</button>`;
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

        tbody.innerHTML += row;
    });

    atualizarBotoesPaginacao();
}

function atualizarBotoesPaginacao() {
    const totalPaginas = Math.ceil(produtosData.length / produtosPorPagina);

    document.getElementById("paginaAnterior").disabled = paginaAtual === 1;
    document.getElementById("proximaPagina").disabled = paginaAtual === totalPaginas || totalPaginas === 0;

    document.getElementById("paginacaoInfo").textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

// Botão Próxima Página
document.getElementById("proximaPagina").addEventListener("click", () => {
    const totalPaginas = Math.ceil(produtosData.length / produtosPorPagina);

    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        atualizarTabelaProdutos();
    }
});

// Botão Página Anterior
document.getElementById("paginaAnterior").addEventListener("click", () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        atualizarTabelaProdutos();
    }
});

// Evento inicial de carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});

document.getElementById("buscarProduto").addEventListener("input", function () {
    let termoBusca = this.value.trim().toLowerCase();
    buscarProduto(termoBusca);
});

// 🔍 Buscar produto
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

document.getElementById("cadastrar").addEventListener("click", function () {
    window.location.href = "./cadastroProduto.html";
})


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

        // Atualiza o campo de ID
        document.getElementById("editProdutoId").value = produto.id || produto.codigo;
        document.getElementById("editNome").value = produto.nome;
        document.getElementById("editDescricao").value = produto.descricao;
        document.getElementById("editValor").value = produto.valor;
        document.getElementById("editQtdEstoque").value = produto.qtdEstoque;

        // Exibir a imagem do produto, se existir
        if (produto.imagem) {
            document.getElementById("editProdutoImagem").src = `data:${produto.imagem.tipo};base64,${produto.imagem.dados}`;
        } else {
            document.getElementById("editProdutoImagem").src = "default_image.jpg"; // Imagem padrão caso não exista
        }

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

function fecharModal() {
    document.getElementById("produtoModal").style.display = "none";
}

async function alterarStatusProduto(id, statusAtual) {
    const token = localStorage.getItem("token");

    const novoStatus = !statusAtual; // Inverte o status atual
    console.log(novoStatus); 

    try {
        const response = await fetch(`http://localhost:8080/produtos/${id}/status?status=${novoStatus ? 'true' : 'false'}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao alterar status do produto: ${response.status}`);
        }

        alert(`Produto ${novoStatus ? "ativado" : "inativado"} com sucesso!`);

        // Atualiza a lista de produtos para refletir o novo status
        carregarProdutos();

    } catch (error) {
        console.error("Erro ao alterar status do produto:", error);
        alert("Erro ao alterar status do produto.");
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (confirm("Tem certeza que deseja sair?")) {
            // Remover dados do localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("grupo");
            localStorage.removeItem("nome");
            localStorage.removeItem("userId");

            // Redirecionar para a página de login
            window.location.href = "login.html";
        }
    });
});
