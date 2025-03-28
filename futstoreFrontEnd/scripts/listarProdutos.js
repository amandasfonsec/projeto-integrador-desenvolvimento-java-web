
// Função utilitária para pegar token sem prefixo duplicado
function getToken() {
    let token = localStorage.getItem("token") || '';
    return token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;
}

let produtosData = [];
let imagensProduto = [];
let imagemAtual = 0;
let paginaAtual = 1;
let produtosExibidos = 0;
const produtosPorPagina = 10;

async function carregarProdutos() {
    console.log("Carregando produtos...");

    try {
        let response = await fetch("http://localhost:8080/produtos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }

        let data = await response.json();
        console.log("Produtos recebidos:", data);
        produtosData = data.sort((a, b) => b.codigo - a.codigo);
        produtosExibidos = 0;
        atualizarTabelaProdutos();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(error.message);
    }
}

function atualizarTabelaProdutos() {
    const tbody = document.getElementById("tabelaProdutos");
    tbody.innerHTML = "";

    const grupoUsuario = localStorage.getItem("grupo");
    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;

    const produtosPagina = produtosData.slice(inicio, fim);

    produtosPagina.forEach(produto => {
        let btnVisualizar = `<button class="btn-view" onclick="visualizarProduto(${produto.codigo})">👁️ Visualizar</button>`;
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

document.getElementById("proximaPagina").addEventListener("click", () => {
    const totalPaginas = Math.ceil(produtosData.length / produtosPorPagina);
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        atualizarTabelaProdutos();
    }
});

document.getElementById("paginaAnterior").addEventListener("click", () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        atualizarTabelaProdutos();
    }
});

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
                // Procura pela imagem principal
            for (let i = 0; i < imagensProduto.length; i++) {
                const imagem = imagensProduto[i];

                if (imagem.principal === "true") {
                    imagemAtual = i; // Achou a principal
                    break; // Para o loop
                } else {
                    imagemAtual = 0;
                }
            }

                
                atualizarCarrossel();
            } else {
                document.getElementById("modalImagem").src = imagem.imagem;
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
    const imagem = imagensProduto[imagemAtual];

    if (!imagem || !imagem.imagem) {
        console.warn("Imagem inválida no carrossel:", imagem);
        document.getElementById("modalImagem").src = "placeholder.jpg"; // cuidado com esse 404, vou falar disso já já!
        return;
    }

    document.getElementById("modalImagem").src = imagem.imagem;
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
    const grupoUsuario = localStorage.getItem("grupo");

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

        // Atualiza os campos do produto
        document.getElementById("editProdutoId").value = produto.id || produto.codigo;
        document.getElementById("editNome").value = produto.nome;
        document.getElementById("editDescricao").value = produto.descricao;
        document.getElementById("editValor").value = produto.valor;
        document.getElementById("editQtdEstoque").value = produto.qtdEstoque;

        // Carregar as imagens do produto
        buscarImagensProduto(id);

        // Se o grupo do usuário for "ESTOQUISTA", desabilite todos os campos, exceto a quantidade de estoque
        if (grupoUsuario === "ESTOQUISTA") {
            document.getElementById("editNome").disabled = true;
            document.getElementById("editDescricao").disabled = true;
            document.getElementById("editValor").disabled = true;
            document.getElementById("editQtdEstoque").disabled = false;
            document.getElementById("editImagemProduto").disabled = true;

            document.getElementById("editNome").style.cursor = "not-allowed";
            document.getElementById("editDescricao").style.cursor = "not-allowed";
            document.getElementById("editValor").style.cursor = "not-allowed";
            document.getElementById("editQtdEstoque").style.cursor = "default";
            document.getElementById("editImagemProduto").style.cursor = "not-allowed";
        } else {
            // Se não for "ESTOQUISTA", todos os campos ficam editáveis
            document.getElementById("editNome").disabled = false;
            document.getElementById("editDescricao").disabled = false;
            document.getElementById("editValor").disabled = false;
            document.getElementById("editQtdEstoque").disabled = false;
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
    const novoStatus = !statusAtual;

    if (confirm(`Tem certeza que deseja ${novoStatus ? "ativar" : "inativar"} este produto?`)) {
        try {
            const response = await fetch(`http://localhost:8080/produtos/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Erro ao alterar status:", errorMessage);
                throw new Error(`Erro ao alterar status do produto: ${response.status}`);
            }

            alert(`Produto ${novoStatus ? "ativado" : "inativado"} com sucesso!`);
            carregarProdutos();

        } catch (error) {
            console.error("Erro ao alterar status do produto:", error);
            alert("Erro ao alterar status do produto.");
        }
    }
}

async function buscarImagensProduto(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/produtos/${id}/imagens`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar imagens do produto");
        }

        const imagens = await response.json();

        if (imagens && imagens.length > 0) {
            // Limpa as imagens antigas
            const imagemContainer = document.getElementById("editProdutoImagemContainer");
            imagemContainer.innerHTML = '';

            // Itera sobre as imagens e as adiciona ao container
            imagens.forEach(imagem => {
                const imgElement = document.createElement("img");
                imgElement.src = imagem.imagem;
                imgElement.alt = "Imagem do produto";
                imgElement.classList.add("produto-imagem");

                // Adiciona a imagem ao container
                imagemContainer.appendChild(imgElement);
            });
        } else {
            document.getElementById("editProdutoImagemContainer").innerHTML = "<p>Sem imagens para exibir</p>";
        }

    } catch (error) {
        console.error("Erro ao carregar imagens:", error);
        document.getElementById("editProdutoImagemContainer").innerHTML = "<p>Erro ao carregar imagens</p>";
    }
}




document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (confirm("Tem certeza que deseja sair?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("grupo");
            localStorage.removeItem("nome");
            localStorage.removeItem("userId");
            window.location.href = "login.html";
        }
    });
});
