console.log(localStorage.getItem('token'));

class CadastroUsuario {
    constructor() {
        // Referências aos elementos do formulário
        this.formulario = document.getElementById('formCadastro');
        this.Inome = document.querySelector('#nomeCadastro');
        this.Iemail = document.querySelector('#emailCadastro');
        this.Isenha = document.querySelector('#senhaCadastro');
        this.Isenha2 = document.querySelector('#confirmaSenhaCadastro');
        this.Icpf = document.querySelector('#cpfCadastro');
        this.Igrupo = document.querySelector('#selectGrupoCadastro');
        this.token = localStorage.getItem('token');
    }

    
    // Verifica se estamos editando ou cadastrando e chama as funções apropriadas
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        if (usuarioId) {
            this.carregarUsuario(usuarioId);
            this.atualizarTextoModoEdicao();
        }

        this.formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            if (usuarioId) {
                this.editarUsuario(usuarioId);
            } else {
                this.criarUsuario();
            }
        });
    }

    // Atualiza os textos do formulário quando em modo de edição
    atualizarTextoModoEdicao() {
        document.querySelector('h2').textContent = 'Editar Usuário';
        document.getElementById('btnCadastro').textContent = 'Salvar';
    }

    // Função para carregar os dados do usuário
    carregarUsuario(id) {
        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(usuario => {
            this.Inome.value = usuario.nome;
            this.Iemail.value = usuario.email;
            this.Icpf.value = usuario.cpf;
            this.Igrupo.value = usuario.grupo;
            this.Isenha.value = '';
            this.Isenha2.value = '';
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            alert("Não foi possível carregar o usuário para edição.");
            window.location.href = 'listaUsuarios.html';
        });
    }

    // Função para editar o usuário
    editarUsuario(id) {
        const usuario = this.getDadosFormulario();
        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'PUT',
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
            alert('Usuário atualizado com sucesso!');
            window.location.href = 'listaUsuarios.html';
        })
        .catch(error => {
            console.error("Erro ao editar usuário:", error);
            alert("Não foi possível editar o usuário.");
        });
    }

    // Função para criar o usuário
    criarUsuario() {
        const usuario = this.getDadosFormulario();
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
            alert('Usuário criado com sucesso!');
            window.location.href = 'listaUsuarios.html';
        })
        .catch(error => {
            console.error("Erro ao criar usuário:", error);
            alert("Não foi possível criar o usuário.");
        });
    }

    // Função para extrair dados do formulário
    getDadosFormulario() {
        return {
            nome: this.Inome.value,
            email: this.Iemail.value,
            senha: this.Isenha.value,
            cpf: this.Icpf.value,
            grupo: this.Igrupo.value
        };
    }
}

// Instancia e inicializa a classe
const cadastroUsuario = new CadastroUsuario();
cadastroUsuario.init();
