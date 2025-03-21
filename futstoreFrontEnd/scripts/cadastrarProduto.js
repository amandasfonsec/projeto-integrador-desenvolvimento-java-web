document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formCadastroProduto");

    if (!form) {
        console.error("Erro: O formulário não foi encontrado.");
        return;
    }

    // Manipula o preview das imagens no formulário
    const imagensInput = document.getElementById("imagensProduto");
    const previewImagens = document.getElementById("previewImagens");
    const imagemPrincipalSelect = document.getElementById("imagemPrincipal");

    imagensInput.addEventListener("change", function (event) {
        previewImagens.innerHTML = ""; // Limpa as imagens anteriores
        imagemPrincipalSelect.innerHTML = '<option value="">Selecione uma imagem</option>'; // Limpa as opções anteriores

        Array.from(event.target.files).forEach((file, index) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.width = "100px";
                img.style.margin = "5px";
                img.setAttribute("data-index", index);

                previewImagens.appendChild(img);

                // Adiciona opção no select da imagem principal
                const option = document.createElement("option");
                option.value = index;
                option.textContent = `Imagem ${index + 1}`;

                imagemPrincipalSelect.appendChild(option);
            };

            reader.readAsDataURL(file);
        });
    });

    // Envio do formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Você precisa estar logado para realizar essa ação.");
            window.location.href = "./login.html";
            return;
        }

        // Cria o objeto produto com os dados do formulário
        const produto = {
            nome: document.getElementById("nomeProduto").value,
            avaliacao: parseFloat(document.getElementById("avaliacaoProduto").value),
            descricao: document.getElementById("descricaoProduto").value,
            valor: parseFloat(document.getElementById("precoProduto").value),
            qtdEstoque: parseInt(document.getElementById("qtdProduto").value),
            imagemPrincipal: imagemPrincipalSelect.value ? parseInt(imagemPrincipalSelect.value) : null
        };

        // Validações simples
        if (!produto.nome || !produto.descricao || isNaN(produto.valor)) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        // Cria o FormData para enviar no corpo da requisição
        const formData = new FormData();
        formData.append("produto", new Blob([JSON.stringify(produto)], { type: "application/json" }));

        // Adiciona cada imagem selecionada
        Array.from(imagensInput.files).forEach(file => {
            formData.append("imagensProduto", file);
        });

        // Envia a requisição para a API backend
        fetch("http://localhost:8080/produtos", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // NÃO definir Content-Type aqui quando usa FormData!
            },
            body: formData
        })
        .then(response => response.text())  // Captura a resposta como texto
        .then(text => {
            console.log("Resposta do servidor:", text);

            try {
                const data = JSON.parse(text); // Tenta converter para JSON
                console.log("Produto cadastrado com sucesso:", data);
                alert("Produto cadastrado com sucesso!");
                window.location.href = "./listarProdutos.html";
            } catch (e) {
                throw new Error("Resposta não é um JSON válido: " + text);
            }
        })
        .catch(error => {
            console.error("Erro ao cadastrar produto:", error);
            alert("Erro ao cadastrar produto. Verifique os dados e tente novamente.");
        });
    });

    // Botão de cancelar (voltar para a lista de produtos)
    const btnCancelar = document.getElementById("btnCancelarProduto");
    btnCancelar.addEventListener("click", function () {
        window.location.href = "./listarProdutos.html";
    });
});

// Função para lidar com a pré-visualização das imagens

