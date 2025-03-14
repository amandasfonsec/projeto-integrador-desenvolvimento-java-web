async function carregarProdutos() {
    console.log("Carregando produtos...");

    const token = localStorage.getItem("token"); // Obtém o token armazenado

    try {
        let response = await fetch("http://localhost:8080/produtos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Envia o token de autenticação
                "Content-Type": "application/json"
            }
        });

        if (response.status === 403) {
            throw new Error("Acesso negado! Verifique suas permissões.");
        }

        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }

        let text = await response.text();
        console.log("Resposta do servidor:", text);

        let data = JSON.parse(text);
        console.log("Produtos recebidos:", data);

        let tabela = document.getElementById("tabelaProdutos");
        tabela.innerHTML = "";

        data.forEach(produto => {
            let row = `<tr>
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.qtdEstoque}</td>
                <td>R$ ${produto.valor.toFixed(2)}</td>
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
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
});

document.getElementById('cadastrar').addEventListener('click', () => {
    window.location.href = './cadastroProduto.html';
});
