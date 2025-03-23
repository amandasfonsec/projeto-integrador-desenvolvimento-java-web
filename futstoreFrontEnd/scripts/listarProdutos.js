
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
            btnVisualizar = `<button class="btn-view disabled" disabled style="background-color: gray;">👁️ Visualizar</button>`;
            btnInativar = `<button class="btn-status disabled" disabled style="background-color: gray;">${produto.ativo ? "❌ Inativar" : "✅ Ativar"}</button>`;
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
