// Função para carregar produtos do backend e exibi-los na tabela
async function carregarProdutos() {
    console.log("Função carregarProdutos chamada!");
    try {
        let response = await fetch("http://localhost:8080/produtos");
        let data = await response.json();

        if (!Array.isArray(data)) {
            console.error("Resposta inválida da API", data);
            return;
        }

        let tabela = document.getElementById("tabelaProdutos");
        tabela.innerHTML = "";

        data.forEach(produto => {
            let row = `<tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.qtdEstoque}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                    <button class="btn-edit" onclick="alterarProduto(${produto.id})">✏️ Editar</button>
                    <button class="btn-status" onclick="alternarStatus(${produto.id}, ${produto.ativo})">
                        ${produto.ativo ? "❌ Inativar" : "✅ Ativar"}
                    </button>
                    <button class="btn-view" onclick="visualizarProduto(${produto.id})">👁️ Visualizar</button>
                </td>
            </tr>`;
            tabela.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// Aguarda a página carregar antes de chamar a função
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});

// Função para editar um produto
function alterarProduto(id) {
    console.log("Alterar produto:", id);
    alert("Funcionalidade de edição ainda não implementada.");
}

// Função para ativar/inativar um produto
async function alternarStatus(id, ativo) {
    let novoStatus = !ativo;
    console.log("Alternar status do produto:", id, "Novo status:", novoStatus);

    let response = await fetch(`http://localhost:8080/produtos/${id}/status`, {
        method: "PUT"
    });

    if (response.ok) {
        alert(`Status do produto ${id} atualizado com sucesso.`);
        carregarProdutos(); // Recarrega a lista após a alteração
    } else {
        alert("Erro ao alterar o status do produto.");
    }
}

// Função para visualizar detalhes de um produto
function visualizarProduto(id) {
    console.log("Visualizar produto:", id);
    alert(`Visualizando detalhes do produto ${id}.`);
}

// Função para voltar ao menu principal
function voltarMenu() {
    window.location.href = "principal.html"; // Ajuste conforme o nome correto da sua página inicial
}
