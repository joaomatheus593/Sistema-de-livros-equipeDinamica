class SistemaAutenticacao {
    constructor() {
        this.usuarios = this.carregarUsuarios();
        this.usuarioLogado = this.carregarUsuarioLogado();
        this.tentativasLogin = 0;
        this.bloqueioTemporario = false;
        this.inicializarEventos();
        this.verificarUsuariosPreCadastrados();
        console.log('🔐 Sistema de Autenticação inicializado com', this.usuarios.length, 'usuários');
    }

    carregarUsuarios() {
        let usuarios = ArmazenamentoLocal.carregar('biblioteca_usuarios');
        
        if (!usuarios || usuarios.length === 0) {
            console.log('📝 Criando usuários pré-cadastrados...');
            usuarios = this.criarUsuariosPadrao();
            ArmazenamentoLocal.salvar('biblioteca_usuarios', usuarios);
        }
        
        return usuarios;
    }

    criarUsuariosPadrao() {
        const timestamp = new Date().toISOString();
        return [
            {
                id: 'admin-001',
                nome: 'Administrador Principal',
                email: 'admin@bibliotecacesf.com',
                usuario: 'admin',
                senha: 'Admin123!',
                tipo: 'admin',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👑',
                temaPreferido: 'claro',
                notificacoes: true,
                telefone: '(11) 99999-9999',
                endereco: 'Biblioteca CESF - Centro'
            },
            {
                id: 'user-001',
                nome: 'João Silva Santos',
                email: 'joao.silva@email.com',
                usuario: 'joao',
                senha: 'Usuario123!',
                tipo: 'usuario',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👨‍💼',
                temaPreferido: 'claro',
                notificacoes: true,
                telefone: '(11) 88888-8888',
                endereco: 'Rua das Flores, 123'
            },
            {
                id: 'user-002',
                nome: 'Maria Oliveira Costa',
                email: 'maria.costa@email.com',
                usuario: 'maria',
                senha: 'Usuario123!',
                tipo: 'usuario',
                dataCadastro: timestamp,
                ultimoAcesso: null,
                ativo: true,
                avatar: '👩‍🎓',
                temaPreferido: 'claro',
                notificacoes: true,
                telefone: '(11) 77777-7777',
                endereco: 'Av. Principal, 456'
            }
        ];
    }

    carregarUsuarioLogado() {
        const usuarioSession = sessionStorage.getItem('usuario_logado');
        const usuarioLocal = localStorage.getItem('usuario_logado');
        
        if (usuarioSession) {
            return JSON.parse(usuarioSession);
        } else if (usuarioLocal) {
            return JSON.parse(usuarioLocal);
        }
        
        return null;
    }

    inicializarEventos() {
        // Eventos de formulário de login
        const formLogin = document.getElementById('formLogin');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarLogin();
            });
        }

        // Eventos de formulário de cadastro
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.realizarCadastro();
            });

            // Validação em tempo real da senha
            const senhaInput = document.getElementById('inputSenhaCadastro');
            if (senhaInput) {
                senhaInput.addEventListener('input', (e) => {
                    this.validarForcaSenha(e.target.value);
                });
            }

            // Validação de confirmação de senha
            const confirmarSenhaInput = document.getElementById('inputConfirmarSenha');
            if (confirmarSenhaInput) {
                confirmarSenhaInput.addEventListener('input', (e) => {
                    this.validarConfirmacaoSenha();
                });
            }
        }

        // Eventos de teclado para atalhos de desenvolvimento
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && !e.shiftKey) {
                switch(e.key) {
                    case '1': 
                        e.preventDefault(); 
                        this.loginRapido('admin'); 
                        break;
                    case '2': 
                        e.preventDefault(); 
                        this.loginRapido('joao'); 
                        break;
                    case '3': 
                        e.preventDefault(); 
                        this.loginRapido('maria'); 
                        break;
                }
            }
        });

        console.log('✅ Eventos de autenticação inicializados');
    }

    realizarLogin() {
        if (this.bloqueioTemporario) {
            mensagens.erro('Sistema temporariamente bloqueado. Tente novamente em alguns minutos.');
            return;
        }

        const usuarioInput = document.getElementById('inputUsuario');
        const senhaInput = document.getElementById('inputSenha');
        const lembrarLogin = document.getElementById('lembrarLogin');

        if (!usuarioInput || !senhaInput) {
            mensagens.erro('Erro: Campos de login não encontrados.');
            return;
        }

        const credencial = usuarioInput.value.trim();
        const senha = senhaInput.value;
        const lembrar = lembrarLogin ? lembrarLogin.checked : false;

        // Validações básicas
        if (!credencial || !senha) {
            this.animacaoErroLogin();
            mensagens.erro('Por favor, preencha todos os campos.');
            return;
        }

        // Buscar usuário (agora busca por usuário OU email)
        const usuarioEncontrado = this.usuarios.find(u => 
            (u.usuario === credencial || u.email === credencial) && 
            u.senha === senha && 
            u.ativo === true
        );

        if (usuarioEncontrado) {
            // Login bem-sucedido
            this.tentativasLogin = 0;
            this.usuarioLogado = usuarioEncontrado;
            
            // Atualizar último acesso
            usuarioEncontrado.ultimoAcesso = new Date().toISOString();
            this.salvarUsuarios();

            // Salvar sessão
            if (lembrar) {
                localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            } else {
                sessionStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            }

            this.animacaoSucessoLogin();
            mensagens.sucesso(`Bem-vindo(a) de volta, ${usuarioEncontrado.nome.split(' ')[0]}! 🎉`);
            
            setTimeout(() => {
                this.entrarNoSistema();
            }, 1000);

        } else {
            // Login falhou
            this.tentativasLogin++;
            this.animacaoErroLogin();
            
            if (this.tentativasLogin >= 5) {
                this.bloqueioTemporario = true;
                mensagens.erro('Muitas tentativas falhas. Sistema bloqueado por 2 minutos.');
                setTimeout(() => {
                    this.bloqueioTemporario = false;
                    this.tentativasLogin = 0;
                    mensagens.info('Sistema desbloqueado. Você pode tentar novamente.');
                }, 120000);
            } else {
                const tentativasRestantes = 5 - this.tentativasLogin;
                mensagens.erro(`Credenciais inválidas. ${tentativasRestantes} tentativas restantes.`);
            }
        }
    }

    realizarCadastro() {
        const nome = document.getElementById('inputNomeCompleto')?.value.trim();
        const email = document.getElementById('inputEmail')?.value.trim().toLowerCase();
        const usuario = document.getElementById('inputUsuarioCadastro')?.value.trim().toLowerCase();
        const senha = document.getElementById('inputSenhaCadastro')?.value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha')?.value;
        const telefone = document.getElementById('inputTelefone')?.value.trim() || '';
        const endereco = document.getElementById('inputEndereco')?.value.trim() || '';
        const termos = document.getElementById('checkTermos')?.checked;

        console.log('📝 Iniciando cadastro para:', { nome, email, usuario });

        // Validações
        if (!nome || !email || !usuario || !senha || !confirmarSenha) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!this.validarNomeCompleto(nome)) {
            mensagens.erro('Por favor, insira seu nome completo (mínimo 2 palavras com 2 caracteres cada).');
            return;
        }

        if (!Validacoes.validarEmail(email)) {
            mensagens.erro('Por favor, insira um e-mail válido.');
            return;
        }

        if (!this.validarUsuario(usuario)) {
            mensagens.erro('Nome de usuário deve ter entre 3 e 20 caracteres e conter apenas letras, números e underline.');
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
            mensagens.erro('Você deve aceitar os termos de uso e política de privacidade.');
            return;
        }

        // Verificar duplicatas
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
            tipo: 'usuario',
            dataCadastro: new Date().toISOString(),
            ultimoAcesso: null,
            ativo: true,
            avatar: this.gerarAvatarAleatorio(),
            temaPreferido: 'claro',
            notificacoes: true,
            telefone: telefone,
            endereco: endereco,
            livrosFavoritos: [],
            historicoBusca: [],
            emprestimosAtivos: [],
            agendamentosAtivos: []
        };

        this.usuarios.push(novoUsuario);
        this.salvarUsuarios();

        mensagens.sucesso('Cadastro realizado com sucesso! 🎊 Você já pode fazer login.');
        
        // Animação de sucesso
        this.animacaoSucessoCadastro();
        
        setTimeout(() => {
            this.fecharModal('modalCadastro');
            this.mostrarLogin();
        }, 1500);
    }

    validarNomeCompleto(nome) {
        const palavras = nome.split(' ').filter(p => p.length >= 2);
        return palavras.length >= 2 && nome.length >= 5;
    }

    validarUsuario(usuario) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(usuario);
    }

    validarForcaSenha(senha) {
        const forca = Validacoes.calcularForcaSenha(senha);
        const barraForca = document.getElementById('barraForcaSenha');
        const textoForca = document.getElementById('textoForcaSenha');

        if (barraForca && textoForca) {
            // Resetar classes
            barraForca.className = 'barra-forca-senha';
            textoForca.className = 'texto-forca-senha';
            
            // Adicionar classes baseadas na força
            if (forca <= 1) {
                barraForca.classList.add('senha-fraca');
                textoForca.classList.add('senha-fraca');
                textoForca.textContent = 'Senha fraca';
            } else if (forca <= 2) {
                barraForca.classList.add('senha-media');
                textoForca.classList.add('senha-media');
                textoForca.textContent = 'Senha média';
            } else if (forca <= 3) {
                barraForca.classList.add('senha-forte');
                textoForca.classList.add('senha-forte');
                textoForca.textContent = 'Senha forte';
            } else {
                barraForca.classList.add('senha-muito-forte');
                textoForca.classList.add('senha-muito-forte');
                textoForca.textContent = 'Senha muito forte';
            }
        }
    }

    validarConfirmacaoSenha() {
        const senha = document.getElementById('inputSenhaCadastro')?.value;
        const confirmarSenha = document.getElementById('inputConfirmarSenha')?.value;
        const confirmarInput = document.getElementById('inputConfirmarSenha');

        if (confirmarInput) {
            if (confirmarSenha && senha !== confirmarSenha) {
                confirmarInput.classList.add('erro-validacao');
            } else {
                confirmarInput.classList.remove('erro-validacao');
            }
        }
    }

    entrarNoSistema() {
        const telaInicio = document.getElementById('telaInicio');
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        
        if (telaInicio && sistemaPrincipal) {
            // Animação de saída
            telaInicio.style.opacity = '0';
            telaInicio.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                telaInicio.style.display = 'none';
                sistemaPrincipal.style.display = 'block';
                
                // Animação de entrada
                sistemaPrincipal.style.opacity = '0';
                sistemaPrincipal.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    sistemaPrincipal.style.opacity = '1';
                    sistemaPrincipal.style.transform = 'translateY(0)';
                    sistemaPrincipal.style.transition = 'all 0.5s ease';
                    
                    this.atualizarInterfaceUsuario();
                    this.fecharModal('modalLogin');
                    
                    // ✅ GARANTIR QUE OS LIVROS SEJAM CARREGADOS
                    console.log('🔑 Usuário logado - carregando livros...');
                    setTimeout(() => {
                        if (typeof sistemaLivros !== 'undefined') {
                            sistemaLivros.carregarLivrosNaInterface();
                        }
                        if (typeof sistemaAdmin !== 'undefined' && this.isAdmin()) {
                            sistemaAdmin.carregarDadosDashboard();
                        }
                    }, 300);
                    
                }, 50);
            }, 300);
        }
    }

    atualizarInterfaceUsuario() {
        const saudacao = document.getElementById('saudacaoUsuario');
        const areaAdmin = document.getElementById('areaAdministrativa');

        if (saudacao && this.usuarioLogado) {
            const hora = new Date().getHours();
            let cumprimento = 'Boa noite';
            
            if (hora < 12) cumprimento = 'Bom dia';
            else if (hora < 18) cumprimento = 'Boa tarde';

            saudacao.innerHTML = `
                <span class="avatar-usuario">${this.usuarioLogado.avatar}</span>
                <span class="texto-saudacao">${cumprimento}, <strong>${this.usuarioLogado.nome.split(' ')[0]}</strong>!</span>
            `;
        }

        // Controles administrativos
        if (this.isAdmin()) {
            if (areaAdmin) {
                areaAdmin.style.display = 'block';
                // Atualizar botão admin no header
                this.atualizarBotaoAdminHeader();
            }
        } else {
            if (areaAdmin) areaAdmin.style.display = 'none';
        }

        // Aplicar tema preferido do usuário
        if (this.usuarioLogado.temaPreferido && typeof sistemaTema !== 'undefined') {
            sistemaTema.temaAtual = this.usuarioLogado.temaPreferido;
            sistemaTema.aplicarTema();
        }
    }

    atualizarBotaoAdminHeader() {
        const acoesNav = document.querySelector('.acoes-nav');
        if (!acoesNav) return;

        // Remover botão existente se houver
        const botaoExistente = document.getElementById('botaoAdminHeader');
        if (botaoExistente) {
            botaoExistente.remove();
        }

        // Criar novo botão admin
        const botaoAdmin = document.createElement('button');
        botaoAdmin.id = 'botaoAdminHeader';
        botaoAdmin.className = 'botao botao-admin-header';
        botaoAdmin.innerHTML = '<i class="fas fa-cog"></i> Painel Admin';
        botaoAdmin.onclick = () => {
            document.getElementById('areaAdministrativa').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            sistemaAdmin.abrirPainelAdmin('dashboard');
        };

        // Inserir antes do botão de notificações
        const botaoNotificacoes = document.querySelector('.botao-icon[onclick*="abrirNotificacoes"]');
        if (botaoNotificacoes) {
            acoesNav.insertBefore(botaoAdmin, botaoNotificacoes);
        } else {
            acoesNav.appendChild(botaoAdmin);
        }
    }

    sair() {
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        const telaInicio = document.getElementById('telaInicio');
        
        if (sistemaPrincipal && telaInicio) {
            // Animação de saída
            sistemaPrincipal.style.opacity = '0';
            sistemaPrincipal.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                // Limpar dados de sessão
                this.usuarioLogado = null;
                sessionStorage.removeItem('usuario_logado');
                localStorage.removeItem('usuario_logado');
                
                sistemaPrincipal.style.display = 'none';
                telaInicio.style.display = 'flex';
                
                // Animação de entrada
                telaInicio.style.opacity = '0';
                telaInicio.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    telaInicio.style.opacity = '1';
                    telaInicio.style.transform = 'translateY(0)';
                    telaInicio.style.transition = 'all 0.5s ease';
                }, 50);
                
                mensagens.info('Você saiu do sistema. Até logo! 👋');
            }, 300);
        }
    }

    // Sistema de Modais
    mostrarLogin() {
        this.abrirModal('modalLogin');
        setTimeout(() => {
            document.getElementById('inputUsuario')?.focus();
        }, 300);
    }

    mostrarCadastro() {
        this.abrirModal('modalCadastro');
        this.resetarFormularioCadastro();
        setTimeout(() => {
            document.getElementById('inputNomeCompleto')?.focus();
        }, 300);
    }

    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Animação de entrada
            setTimeout(() => {
                modal.classList.add('mostrar');
                const conteudo = modal.querySelector('.modal-conteudo');
                if (conteudo) conteudo.classList.add('mostrar');
            }, 10);
        }
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const conteudo = modal.querySelector('.modal-conteudo');
            if (conteudo) conteudo.classList.remove('mostrar');
            
            modal.classList.remove('mostrar');
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    entrarComoConvidado() {
        this.usuarioLogado = {
            id: 'convidado-' + Date.now(),
            nome: 'Visitante Convidado',
            tipo: 'convidado',
            avatar: '👀',
            dataCadastro: new Date().toISOString()
        };

        mensagens.info('Entrando como convidado. Algumas funcionalidades estarão limitadas.');
        
        setTimeout(() => {
            this.entrarNoSistema();
        }, 1000);
    }

    // Login Rápido para Desenvolvimento
    loginRapido(usuario) {
        console.log(`🔑 Tentando login rápido com: ${usuario}`);
        
        const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.ativo);
        
        if (usuarioEncontrado) {
            console.log(`✅ Usuário encontrado: ${usuarioEncontrado.nome}`);
            
            this.tentativasLogin = 0;
            this.usuarioLogado = usuarioEncontrado;
            
            // Atualizar último acesso
            usuarioEncontrado.ultimoAcesso = new Date().toISOString();
            this.salvarUsuarios();

            // Salvar sessão
            sessionStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));

            this.animacaoSucessoLogin();
            mensagens.sucesso(`Login rápido bem-sucedido! Bem-vindo(a), ${usuarioEncontrado.nome.split(' ')[0]}! 🎉`);
            
            setTimeout(() => {
                this.entrarNoSistema();
            }, 1000);

        } else {
            console.error(`❌ Usuário "${usuario}" não encontrado ou inativo`);
            mensagens.erro(`Usuário "${usuario}" não encontrado.`);
        }
    }

    // Animações
    animacaoSucessoLogin() {
        const modal = document.getElementById('modalLogin');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.animation = 'pulseSuccess 0.5s ease-out';
            setTimeout(() => {
                conteudo.style.animation = '';
            }, 500);
        }
    }

    animacaoErroLogin() {
        const modal = document.getElementById('modalLogin');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.animation = 'shake 0.5s ease-out';
            setTimeout(() => {
                conteudo.style.animation = '';
            }, 500);
        }
    }

    animacaoSucessoCadastro() {
        const modal = document.getElementById('modalCadastro');
        const conteudo = modal?.querySelector('.modal-conteudo');
        
        if (conteudo) {
            conteudo.style.transform = 'scale(1.02)';
            setTimeout(() => {
                conteudo.style.transform = 'scale(1)';
            }, 300);
        }
    }

    resetarFormularioCadastro() {
        const form = document.getElementById('formCadastro');
        if (form) form.reset();
        
        this.validarForcaSenha('');
        this.validarConfirmacaoSenha();
    }

    gerarAvatarAleatorio() {
        const avatares = ['👦', '👧', '👨', '👩', '🧑', '👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼'];
        return avatares[Math.floor(Math.random() * avatares.length)];
    }

    // Getters e verificações
    getUsuarioLogado() {
        return this.usuarioLogado;
    }

    isAdmin() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'admin';
    }

    isConvidado() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'convidado';
    }

    isUsuarioComum() {
        return this.usuarioLogado && this.usuarioLogado.tipo === 'usuario';
    }

    // Métodos de persistência
    salvarUsuarios() {
        ArmazenamentoLocal.salvar('biblioteca_usuarios', this.usuarios);
    }

    // Verificação e criação de usuários pré-cadastrados
    verificarUsuariosPreCadastrados() {
        const usuariosEsperados = ['admin', 'joao', 'maria'];
        let usuariosFaltantes = [];
        
        usuariosEsperados.forEach(usuario => {
            if (!this.usuarios.find(u => u.usuario === usuario)) {
                usuariosFaltantes.push(usuario);
            }
        });
        
        if (usuariosFaltantes.length > 0) {
            console.log('🔧 Criando usuários faltantes:', usuariosFaltantes);
            usuariosFaltantes.forEach(usuario => {
                this.criarUsuarioPreCadastrado(usuario);
            });
            this.salvarUsuarios();
        }
    }

    criarUsuarioPreCadastrado(usuario) {
        const usuariosBase = {
            'admin': {
                nome: 'Administrador Principal',
                email: 'admin@bibliotecacesf.com',
                senha: 'Admin123!',
                tipo: 'admin',
                avatar: '👑',
                telefone: '(11) 99999-9999',
                endereco: 'Biblioteca CESF - Centro'
            },
            'joao': {
                nome: 'João Silva Santos',
                email: 'joao.silva@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                avatar: '👨‍💼',
                telefone: '(11) 88888-8888',
                endereco: 'Rua das Flores, 123'
            },
            'maria': {
                nome: 'Maria Oliveira Costa',
                email: 'maria.costa@email.com',
                senha: 'Usuario123!',
                tipo: 'usuario',
                avatar: '👩‍🎓',
                telefone: '(11) 77777-7777',
                endereco: 'Av. Principal, 456'
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
                ultimoAcesso: null,
                ativo: true,
                avatar: dados.avatar,
                temaPreferido: 'claro',
                notificacoes: true,
                telefone: dados.telefone,
                endereco: dados.endereco,
                livrosFavoritos: [],
                historicoBusca: [],
                emprestimosAtivos: [],
                agendamentosAtivos: []
            };

            this.usuarios.push(novoUsuario);
            console.log(`✅ Usuário ${usuario} criado com sucesso`);
        }
    }

    // Métodos para administração
    obterUsuarioPorId(usuarioId) {
        return this.usuarios.find(u => u.id === usuarioId);
    }

    obterTodosUsuarios() {
        return this.usuarios.filter(u => u.tipo !== 'convidado');
    }

    atualizarUsuario(usuarioId, dadosAtualizados) {
        const index = this.usuarios.findIndex(u => u.id === usuarioId);
        if (index !== -1) {
            this.usuarios[index] = { ...this.usuarios[index], ...dadosAtualizados };
            this.salvarUsuarios();
            return true;
        }
        return false;
    }

    alternarStatusUsuario(usuarioId) {
        const usuario = this.obterUsuarioPorId(usuarioId);
        if (usuario) {
            usuario.ativo = !usuario.ativo;
            this.salvarUsuarios();
            return usuario.ativo;
        }
        return false;
    }
}

// ========== INICIALIZAÇÃO DO SISTEMA ==========
const sistemaAuth = new SistemaAutenticacao();

// ========== FUNÇÕES GLOBAIS PARA HTML ==========
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

function loginRapido(usuario) {
    sistemaAuth.loginRapido(usuario);
}

// ========== INICIALIZAÇÃO E CONFIGURAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Autenticação carregado com sucesso!');
    
    // Verificar se há usuário logado ao carregar a página
    if (sistemaAuth.getUsuarioLogado()) {
        sistemaAuth.entrarNoSistema();
    }
});

// ========== CONSOLE HELPER ==========
console.log('%c🔐 Sistema de Autenticação Pronto!', 'color: #8B0000; font-weight: bold; font-size: 16px;');
console.log('%cAtalhos de Desenvolvimento (Ctrl+Alt+):', 'color: #D4AF37; font-weight: bold;');
console.log('%c1 - Admin | 2 - João | 3 - Maria', 'color: #8B0000;');
console.log('%cContas criadas:', 'color: #28a745; font-weight: bold;');
sistemaAuth.usuarios.forEach(usuario => {
    console.log(`%c👤 ${usuario.usuario} (${usuario.tipo}) - Senha: ${usuario.senha}`, 'color: #6c757d;');
});