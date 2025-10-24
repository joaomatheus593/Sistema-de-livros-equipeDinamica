class SistemaAutenticacao {
    constructor() {
        this.usuarios = this.carregarUsuarios();
        this.usuarioLogado = this.carregarUsuarioLogado();
        this.inicializarEventos();
        this.verificarUsuariosPreCadastrados();
    }

    carregarUsuarios() {
        let usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios');
        
        if (!usuarios) {
            console.log('Criando usuários pré-cadastrados...');
            // Usuários pré-cadastrados para facilitar os testes
            usuarios = [
                {
                    id: 'admin-001',
                    nome: 'Administrador Sistema',
                    email: 'admin@biblioteca.com',
                    usuario: 'admin',
                    senha: 'Admin123!',
                    tipo: 'admin',
                    dataCadastro: new Date().toISOString(),
                    ativo: true,
                    idade: 35,
                    telefone: '(11) 99999-9999'
                },
                {
                    id: 'user-001',
                    nome: 'João Silva Santos',
                    email: 'joao@email.com',
                    usuario: 'joao',
                    senha: 'Usuario123!',
                    tipo: 'usuario',
                    dataCadastro: new Date().toISOString(),
                    ativo: true,
                    idade: 25,
                    telefone: '(11) 98888-8888'
                },
                {
                    id: 'user-002', 
                    nome: 'Maria Santos Oliveira',
                    email: 'maria@email.com',
                    usuario: 'maria',
                    senha: 'Usuario123!',
                    tipo: 'usuario',
                    dataCadastro: new Date().toISOString(),
                    ativo: true,
                    idade: 28,
                    telefone: '(11) 97777-7777'
                },
                {
                    id: 'user-003',
                    nome: 'Pedro Costa Lima',
                    email: 'pedro@email.com',
                    usuario: 'pedro',
                    senha: 'Usuario123!',
                    tipo: 'usuario',
                    dataCadastro: new Date().toISOString(),
                    ativo: true,
                    idade: 19,
                    telefone: '(11) 96666-6666'
                }
            ];
            ArmazenamentoLocal.salvar('biblioteca_usuarios', usuarios);
        } else {
            console.log('Usuários carregados do localStorage:', usuarios.length);
        }
        
        return usuarios;
    }

    carregarUsuarioLogado() {
        const usuarioSession = sessionStorage.getItem('usuario_logado');
        const usuarioLocal = ArmazenamentoLocal.carregar('usuario_logado');
        
        return usuarioSession ? JSON.parse(usuarioSession) : usuarioLocal;
    }

    inicializarEventos() {
        // Formulário de login
        const formLogin = document.getElementById('formLogin');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarLogin();
            });
        }

        // Formulário de cadastro
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarCadastro();
            });

            // Validação de senha em tempo real
            const senhaInput = document.getElementById('inputSenhaCadastro');
            if (senhaInput) {
                senhaInput.addEventListener('input', (e) => {
                    this.validarForcaSenha(e.target.value);
                });
            }

            const confirmarSenhaInput = document.getElementById('inputConfirmarSenha');
            if (confirmarSenhaInput) {
                confirmarSenhaInput.addEventListener('input', (e) => {
                    this.validarConfirmacaoSenha();
                });
            }
        }

        // Eventos de teclado para login rápido
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                loginRapido('admin');
            } else if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                loginRapido('joao');
            } else if (e.ctrlKey && e.key === '3') {
                e.preventDefault();
                loginRapido('maria');
            }
        });
    }

    validarForcaSenha(senha) {
        const forca = Validacoes.calcularForcaSenha(senha);
        const barraForca = document.getElementById('barraForcaSenha');
        const textoForca = document.getElementById('textoForcaSenha');

        if (barraForca && textoForca) {
            // Remover classes anteriores
            barraForca.className = 'barra-forca-senha';
            
            // Adicionar classe baseada na força
            if (forca <= 1) {
                barraForca.classList.add('senha-fraca');
            } else if (forca <= 3) {
                barraForca.classList.add('senha-media');
            } else if (forca <= 4) {
                barraForca.classList.add('senha-forte');
            } else {
                barraForca.classList.add('senha-muito-forte');
            }

            textoForca.textContent = Validacoes.obterTextoForcaSenha(forca);
        }
    }

    validarConfirmacaoSenha() {
        const senha = document.getElementById('inputSenhaCadastro').value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha').value;
        const confirmarSenhaInput = document.getElementById('inputConfirmarSenha');

        if (confirmarSenhaInput) {
            if (confirmarSenha && senha !== confirmarSenha) {
                confirmarSenhaInput.style.borderColor = 'var(--vermelho)';
                confirmarSenhaInput.title = 'As senhas não coincidem';
            } else {
                confirmarSenhaInput.style.borderColor = 'var(--cinza-claro)';
                confirmarSenhaInput.title = '';
            }
        }
    }

    realizarLogin() {
        const usuarioInput = document.getElementById('inputUsuario').value.trim();
        const senhaInput = document.getElementById('inputSenha').value;
        const lembrarLogin = document.getElementById('lembrarLogin').checked;

        // Validar campos
        if (!usuarioInput || !senhaInput) {
            mensagens.erro('Por favor, preencha todos os campos.');
            return;
        }

        // Buscar usuário
        const usuario = this.usuarios.find(u => 
            (u.usuario === usuarioInput || u.email === usuarioInput) && 
            u.senha === senhaInput && 
            u.ativo
        );

        if (usuario) {
            this.usuarioLogado = usuario;
            
            // Salvar sessão
            if (lembrarLogin) {
                ArmazenamentoLocal.salvar('usuario_logado', usuario);
            } else {
                sessionStorage.setItem('usuario_logado', JSON.stringify(usuario));
            }

            // Adicionar notificação de login
            sistemaNotificacoes.adicionarNotificacao(
                'Login Realizado',
                `Bem-vindo(a) de volta, ${usuario.nome.split(' ')[0]}!`,
                'sucesso'
            );

            mensagens.sucesso(`Bem-vindo(a) de volta, ${usuario.nome.split(' ')[0]}!`);
            this.entrarNoSistema();
        } else {
            mensagens.erro('Usuário ou senha incorretos.');
            
            // Adicionar notificação de tentativa de login falha
            sistemaNotificacoes.adicionarNotificacao(
                'Tentativa de Login',
                `Tentativa de login falhou para: ${usuarioInput}`,
                'erro'
            );
        }
    }

    realizarCadastro() {
        const nome = document.getElementById('inputNomeCompleto').value.trim();
        const email = document.getElementById('inputEmail').value.trim().toLowerCase();
        const usuario = document.getElementById('inputUsuarioCadastro').value.trim();
        const senha = document.getElementById('inputSenhaCadastro').value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha').value;
        const tipo = document.getElementById('selectTipoUsuario').value;
        const termos = document.getElementById('checkTermos').checked;

        // Validações
        if (!nome || !email || !usuario || !senha || !confirmarSenha) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!Validacoes.validarEmail(email)) {
            mensagens.erro('Por favor, insira um e-mail válido.');
            return;
        }

        if (!Validacoes.validarSenha(senha)) {
            mensagens.erro('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
            return;
        }

        if (senha !== confirmarSenha) {
            mensagens.erro('As senhas não coincidem.');
            return;
        }

        if (!termos) {
            mensagens.erro('Você deve aceitar os termos de uso.');
            return;
        }

        // Verificar se usuário ou email já existem
        if (this.usuarios.find(u => u.usuario === usuario)) {
            mensagens.erro('Este nome de usuário já está em uso.');
            return;
        }

        if (this.usuarios.find(u => u.email === email)) {
            mensagens.erro('Este e-mail já está cadastrado.');
            return;
        }

        // Criar novo usuário
        const novoUsuario = {
            id: GeradorID.gerar(),
            nome: nome,
            email: email,
            usuario: usuario,
            senha: senha,
            tipo: tipo,
            dataCadastro: new Date().toISOString(),
            ativo: true,
            idade: null,
            telefone: ''
        };

        this.usuarios.push(novoUsuario);
        ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);

        // Notificação de novo cadastro
        sistemaNotificacoes.adicionarNotificacao(
            'Novo Usuário',
            `${nome} acabou de se cadastrar no sistema`,
            'info'
        );

        mensagens.sucesso('Cadastro realizado com sucesso! Você já pode fazer login.');
        this.fecharModal('modalCadastro');
        this.mostrarLogin();
    }

    entrarNoSistema() {
        document.getElementById('telaInicio').style.display = 'none';
        document.getElementById('sistemaPrincipal').style.display = 'block';
        
        this.atualizarInterfaceUsuario();
        this.fecharModal('modalLogin');

        // Inicializar outros sistemas
        if (typeof sistemaLivros !== 'undefined') {
            sistemaLivros.carregarLivros();
            sistemaLivros.carregarDestaques();
        }

        if (typeof sistemaAdmin !== 'undefined' && this.usuarioLogado.tipo === 'admin') {
            sistemaAdmin.mostrarAreaAdmin();
        }

        // Inicializar sistema de parceria se existir
        if (typeof sistemaParceria !== 'undefined') {
            sistemaParceria.inicializar();
        }
    }

    atualizarInterfaceUsuario() {
        const saudacao = document.getElementById('saudacaoUsuario');
        const areaAdmin = document.getElementById('areaAdministrativa');
        const botaoAdminFixo = document.getElementById('botaoAdminFixo');

        if (saudacao && this.usuarioLogado) {
            const hora = new Date().getHours();
            let cumprimento = 'Boa noite';
            
            if (hora < 12) cumprimento = 'Bom dia';
            else if (hora < 18) cumprimento = 'Boa tarde';

            saudacao.textContent = `${cumprimento}, ${this.usuarioLogado.nome.split(' ')[0]}!`;
            
            // Adicionar badge de tipo de usuário
            if (this.usuarioLogado.tipo === 'admin') {
                saudacao.innerHTML += ` <span class="badge-admin">ADMIN</span>`;
            }
        }

        // Mostrar/ocultar área administrativa e botão fixo
        if (areaAdmin && botaoAdminFixo) {
            if (this.usuarioLogado && this.usuarioLogado.tipo === 'admin') {
                areaAdmin.style.display = 'block';
                botaoAdminFixo.style.display = 'block';
                
                // Carregar dados do admin
                setTimeout(() => {
                    if (typeof sistemaAdmin !== 'undefined') {
                        sistemaAdmin.carregarDadosDashboard();
                    }
                }, 100);
            } else {
                areaAdmin.style.display = 'none';
                botaoAdminFixo.style.display = 'none';
            }
        }
    }

    sair() {
        const usuarioNome = this.usuarioLogado ? this.usuarioLogado.nome.split(' ')[0] : 'Usuário';
        
        this.usuarioLogado = null;
        ArmazenamentoLocal.remover('usuario_logado');
        sessionStorage.removeItem('usuario_logado');

        document.getElementById('sistemaPrincipal').style.display = 'none';
        document.getElementById('telaInicio').style.display = 'flex';

        // Notificação de logout
        sistemaNotificacoes.adicionarNotificacao(
            'Logout',
            `${usuarioNome} saiu do sistema`,
            'info'
        );

        mensagens.info('Você saiu do sistema. Volte sempre!');
    }

    // Métodos para modais
    mostrarLogin() {
        this.abrirModal('modalLogin');
        // Resetar formulário
        const form = document.getElementById('formLogin');
        if (form) form.reset();
    }

    mostrarCadastro() {
        this.abrirModal('modalCadastro');
        // Resetar formulário e indicadores
        const form = document.getElementById('formCadastro');
        if (form) {
            form.reset();
            this.validarForcaSenha('');
            this.validarConfirmacaoSenha();
        }
    }

    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Animação de entrada
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('.modal-conteudo').style.transform = 'scale(1)';
            }, 10);
        }
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('.modal-conteudo').style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    entrarComoConvidado() {
        this.usuarioLogado = {
            id: 'convidado-' + GeradorID.gerar(),
            nome: 'Visitante Convidado',
            tipo: 'convidado',
            dataCadastro: new Date().toISOString()
        };

        // Notificação de acesso convidado
        sistemaNotificacoes.adicionarNotificacao(
            'Acesso Convidado',
            'Um visitante está explorando o sistema como convidado',
            'info'
        );

        mensagens.info('Entrando como convidado. Algumas funcionalidades estarão limitadas.');
        this.entrarNoSistema();
    }

    // Getters
    getUsuarioLogado() {
        return this.usuarioLogado;
    }

    isAdmin() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'admin';
    }

    isConvidado() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'convidado';
    }

    // Verificação e criação de usuários pré-cadastrados
    verificarUsuariosPreCadastrados() {
        console.log('Verificando usuários pré-cadastrados...');
        
        const usuariosEsperados = ['admin', 'joao', 'maria', 'pedro'];
        let usuariosCriados = 0;
        
        usuariosEsperados.forEach(usuario => {
            const encontrado = this.usuarios.find(u => u.usuario === usuario);
            if (!encontrado) {
                console.log(`Criando usuário ${usuario}...`);
                this.criarUsuarioPreCadastrado(usuario);
                usuariosCriados++;
            }
        });
        
        if (usuariosCriados > 0) {
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
            console.log(`${usuariosCriados} usuários pré-cadastrados criados com sucesso!`);
        }
    }

    criarUsuarioPreCadastrado(usuario) {
        const usuariosBase = {
            'admin': {
                nome: 'Administrador Sistema',
                email: 'admin@biblioteca.com',
                senha: 'Admin123!',
                tipo: 'admin',
                idade: 35,
                telefone: '(11) 99999-9999'
            },
            'joao': {
                nome: 'João Silva Santos',
                email: 'joao@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                idade: 25,
                telefone: '(11) 98888-8888'
            },
            'maria': {
                nome: 'Maria Santos Oliveira',
                email: 'maria@email.com', 
                senha: 'Usuario123!',
                tipo: 'usuario',
                idade: 28,
                telefone: '(11) 97777-7777'
            },
            'pedro': {
                nome: 'Pedro Costa Lima',
                email: 'pedro@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                idade: 19,
                telefone: '(11) 96666-6666'
            }
        };

        const dados = usuariosBase[usuario];
        if (dados) {
            const novoUsuario = {
                id: GeradorID.gerar(),
                nome: dados.nome,
                email: dados.email,
                usuario: usuario,
                senha: dados.senha,
                tipo: dados.tipo,
                dataCadastro: new Date().toISOString(),
                ativo: true,
                idade: dados.idade,
                telefone: dados.telefone
            };

            this.usuarios.push(novoUsuario);
            console.log(`Usuário ${usuario} criado:`, novoUsuario);
        }
    }

    // Métodos para gerenciamento de usuários (admin)
    getTodosUsuarios() {
        return this.usuarios.filter(u => u.tipo !== 'convidado');
    }

    ativarUsuario(usuarioId) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            usuario.ativo = true;
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
            return true;
        }
        return false;
    }

    desativarUsuario(usuarioId) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        if (usuario && usuario.id !== this.usuarioLogado?.id) {
            usuario.ativo = false;
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
            return true;
        }
        return false;
    }

    editarUsuario(usuarioId, dadosAtualizados) {
        const usuarioIndex = this.usuarios.findIndex(u => u.id === usuarioId);
        if (usuarioIndex !== -1) {
            this.usuarios[usuarioIndex] = { ...this.usuarios[usuarioIndex], ...dadosAtualizados };
            ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
            return true;
        }
        return false;
    }
}

// Inicializar sistema de autenticação
const sistemaAuth = new SistemaAutenticacao();

// Funções globais para os eventos do HTML
function mostrarLogin() {
    sistemaAuth.mostrarLogin();
}

function mostrarCadastro() {
    sistemaAuth.mostrarCadastro();
}

function fecharModal(modalId) {
    sistemaAuth.fecharModal(modalId);
}

function entrarComoConvidado() {
    sistemaAuth.entrarComoConvidado();
}

function sair() {
    sistemaAuth.sair();
}

function alternarTema() {
    // Esta função será implementada no main.js
    if (typeof sistemaTema !== 'undefined') {
        sistemaTema.alternarTema();
    }
}

function abrirNotificacoes() {
    // Esta função será implementada no main.js
    if (typeof sistemaNotificacoes !== 'undefined') {
        sistemaNotificacoes.abrirPainelNotificacoes();
    }
}

// Sistema de Login Rápido Melhorado
function loginRapido(usuario) {
    console.log('Tentando login rápido para:', usuario);
    
    // Buscar o usuário no sistema de autenticação
    const usuarioEncontrado = sistemaAuth.usuarios.find(u => {
        return u.usuario === usuario && u.ativo;
    });

    console.log('Usuário encontrado:', usuarioEncontrado ? 'SIM' : 'NÃO');

    if (usuarioEncontrado) {
        // Preencher automaticamente o formulário
        document.getElementById('inputUsuario').value = usuarioEncontrado.usuario;
        document.getElementById('inputSenha').value = usuarioEncontrado.senha;
        document.getElementById('lembrarLogin').checked = true;
        
        // Realizar login automaticamente após breve delay
        setTimeout(() => {
            sistemaAuth.realizarLogin();
        }, 500);
        
        return true;
    } else {
        mensagens.erro(`Usuário "${usuario}" não encontrado ou inativo.`);
        return false;
    }
}

// Atalhos de teclado para desenvolvimento
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar informação sobre atalhos no console
    console.log('%c🚀 Atalhos de Desenvolvimento Disponíveis:', 'color: #D4AF37; font-weight: bold; font-size: 14px;');
    console.log('%cCtrl+1 - Login como Admin\nCtrl+2 - Login como João\nCtrl+3 - Login como Maria', 'color: #8B0000;');
    
    // Verificar se está em localhost para mostrar atalhos
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c🔧 Modo Desenvolvimento Ativo', 'color: #28a745; font-weight: bold;');
    }
});

// Garantir que os usuários pré-cadastrados existam
setTimeout(() => {
    sistemaAuth.verificarUsuariosPreCadastrados();
}, 1000);