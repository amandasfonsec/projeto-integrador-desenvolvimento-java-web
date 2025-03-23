
const grupo = localStorage.getItem('grupo');
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');
class CadastroUsuario {
    constructor() {
        this.formulario = document.getElementById('formCadastro');
        this.Inome = document.querySelector('#nomeCadastro');
        this.Iemail = document.querySelector('#emailCadastro');
        this.Isenha = document.querySelector('#senhaCadastro');
        this.Isenha2 = document.querySelector('#confirmaSenhaCadastro');
        this.Icpf = document.querySelector('#cpfCadastro');
        this.Igrupo = document.querySelector('#selectGrupoCadastro');
        this.token = localStorage.getItem('token'); 
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');
        console.log(grupo);
        console.log(token);
        console.log(id);

        if (usuarioId) {

            if(usuarioId === id){
                document.getElementById('selectGrupoCadastro').style.cursor = "not-allowed";
                document.getElementById('selectGrupoCadastro').title = "Você não pode alterar seu próprio grupo";
                document.getElementById('selectGrupoCadastro').disabled = true;
            }

            document.getElementById('emailCadastro').style.cursor = "not-allowed";
            document.getElementById('emailCadastro').disabled = true;
            document.getElementById('emailCadastro').title = "Não é permitido alterar o e-mail";
            document.getElementById('emailCadastro').readOnly = true;

            this.carregarUsuario(usuarioId);
            this.atualizarTextoModoEdicao();
        }

        

        this.formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuarioId = new URLSearchParams(window.location.search).get('id');

            if (usuarioId) {
                this.editarUsuario(usuarioId);
            } else {
                await this.validarCadastro();
            }
        });
    }

    atualizarTextoModoEdicao() {
        document.querySelector('h2').textContent = 'Editar Usuário';
        document.getElementById('btnCadastro').textContent = 'Salvar';
    }

    carregarUsuario(id) {
        if (!this.token) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        console.log("Buscando usuário ID:", id);

        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 403) {
                throw new Error("Acesso negado: você não tem permissão para visualizar este usuário.");
            }
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(usuario => {
            console.log("Usuário carregado:", usuario);

            this.Inome.value = usuario.nome;
            this.Iemail.value = usuario.email;
            this.Icpf.value = usuario.cpf;
            this.Igrupo.value = usuario.grupo;
            this.Isenha.value = '';  
            this.Isenha2.value = ''; 
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            alert(error.message);
            window.location.href = 'listaUsuarios.html';
        });
    }

    editarUsuario(id) {
        if (!this.token) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        const usuarioAtualizado = this.getDadosFormulario();

        console.log("Editando usuário ID:", id, usuarioAtualizado);

        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(usuarioAtualizado)
        })
        .then(response => {
           // if (response.status === 403) {
            //    throw new Error("Você não tem permissão para editar este usuário.");
            //}
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Usuário atualizado com sucesso:", data);
            alert('Usuário atualizado com sucesso!');
            window.location.href = 'listaUsuarios.html';
        })
        .catch(error => {
            console.error("Erro ao editar usuário:", error);
            alert("Erro ao editar usuário: " + error.message);
        });
    }

    async validarCadastro() {
        const email = this.Iemail.value;
        const cpf = this.Icpf.value;

        if (!this.token) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/usuarios/verificar?email=${email}&cpf=${cpf}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.emailExistente) {
                alert("Já existe um usuário cadastrado com este e-mail.");
                return;
            }

            if (data.cpfExistente) {
                alert("Já existe um usuário cadastrado com este CPF.");
                return;
            }

            this.criarUsuario();

        } catch (error) {
            console.error("Erro ao validar usuário:", error);
            alert("Erro ao verificar se o usuário já existe.");
        }
    }

    criarUsuario() {
        if (!this.token) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        const usuario = this.getDadosFormulario();
        console.log("Enviando dados do usuário:", usuario);

        fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Usuário cadastrado com sucesso:", data);
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'listaUsuarios.html';
        })
        .catch(error => {
            console.error("Erro ao criar usuário:", error);
            alert("Erro ao criar usuário: " + error.message);
        });
    }

    getDadosFormulario() {
        return {
            nome: this.Inome.value.trim(),
            email: this.Iemail.value.trim(),
            senha: this.Isenha.value.trim(),
            cpf: this.Icpf.value.trim(),
            grupo: this.Igrupo.value
        };
    }
}

// Instancia e inicializa a classe
const cadastroUsuario = new CadastroUsuario();
cadastroUsuario.init();
