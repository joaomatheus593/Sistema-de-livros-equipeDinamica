// Sistema de Tema Melhorado
class SistemaTema {
    constructor() {
        this.temaAtual = this.carregarTema();
        this.inicializarEventos();
        this.aplicarTema();
    }

    carregarTema() {
        return ArmazenamentoLocal.carregar('tema') || 'claro';
    }

    inicializarEventos() {
        // Observar preferência do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!ArmazenamentoLocal.carregar('tema')) {
                    this.temaAtual = e.matches ? 'escuro' : 'claro';
                    this.aplicarTema();
                }
            });
        }
    }

    aplicarTema() {
        if (this.temaAtual === 'escuro') {
            document.body.classList.add('tema-escuro');
        } else {
            document.body.classList.remove('tema-escuro');
        }
        
        // Atualizar ícone do botão de tema
        this.atualizarIconeTema();
    }

    atualizarIconeTema() {
        const icone = document.querySelector('.botao-icon[onclick*="alternarTema"] i');
        if (icone) {
            icone.className = this.temaAtual === 'claro' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    alternarTema() {
        this.temaAtual = this.temaAtual === 'claro' ? 'escuro' : 'claro';
        this.aplicarTema();
        ArmazenamentoLocal.salvar('tema', this.temaAtual);
        
        mensagens.sucesso(`Tema ${this.temaAtual === 'claro' ? 'claro' : 'escuro'} ativado`);
    }
}

// Sistema de Notificações
class SistemaNotificacoes {
    constructor() {
        this.notificacoes = this.carregarNotificacoes();
        this.container = this.criarContainer();
        this.atualizarContador();
    }

    carregarNotificacoes() {
        return ArmazenamentoLocal.carregar('biblioteca_notificacoes') || [];
    }

    criarContainer() {
        let container = document.getElementById('sistemaNotificacoes');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sistemaNotificacoes';
            container.className = 'sistema-notificacoes';
            document.body.appendChild(container);
        }
        return container;
    }

    adicionar(titulo, mensagem, tipo = 'info', link = null) {
        const notificacao = {
            id: GeradorID.gerar(),
            titulo: titulo,
            mensagem: mensagem,
            tipo: tipo,
            link: link,
            data: new Date().toISOString(),
            lida: false
        };

        this.notificacoes.unshift(notificacao);
        this.salvar();
        this.mostrarNotificacao(notificacao);
        this.atualizarContador();

        // Notificação nativa do navegador
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(titulo, {
                body: mensagem,
                icon: '/favicon.ico'
            });
        }
    }

    mostrarNotificacao(notificacao) {
        const notificacaoElement = document.createElement('div');
        notificacaoElement.className = `notificacao ${notificacao.tipo}`;
        notificacaoElement.innerHTML = `
            <div class="notificacao-icon">
                <i class="fas ${this.obterIcone(notificacao.tipo)}"></i>
            </div>
            <div class="notificacao-conteudo">
                <strong>${notificacao.titulo}</strong>
                <p>${notificacao.mensagem}</p>
            </div>
            <button class="fechar-notificacao" onclick="sistemaNotificacoes.fecharNotificacao('${notificacao.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        if (notificacao.link) {
            notificacaoElement.style.cursor = 'pointer';
            notificacaoElement.addEventListener('click', () => {
                window.location.href = notificacao.link;
            });
        }

        this.container.appendChild(notificacaoElement);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            this.fecharNotificacao(notificacao.id);
        }, 5000);
    }

    obterIcone(tipo) {
        const icones = {
            'sucesso': 'fa-check-circle',
            'erro': 'fa-exclamation-circle',
            'info': 'fa-info-circle',
            'aviso': 'fa-exclamation-triangle'
        };
        return icones[tipo] || 'fa-info-circle';
    }

    fecharNotificacao(notificacaoId) {
        const notificacaoElement = document.querySelector(`[onclick*="${notificacaoId}"]`)?.closest('.notificacao');
        if (notificacaoElement) {
            notificacaoElement.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notificacaoElement.remove();
            }, 300);
        }

        // Marcar como lida
        const notificacao = this.notificacoes.find(n => n.id === notificacaoId);
        if (notificacao) {
            notificacao.lida = true;
            this.salvar();
            this.atualizarContador();
        }
    }

    marcarTodasComoLidas() {
        this.notificacoes.forEach(notificacao => {
            notificacao.lida = true;
        });
        this.salvar();
        this.atualizarContador();
        
        // Limpar notificações da tela
        document.querySelectorAll('.notificacao').forEach(el => el.remove());
    }

    obterNaoLidas() {
        return this.notificacoes.filter(n => !n.lida);
    }

    atualizarContador() {
        const naoLidas = this.obterNaoLidas();
        const contador = document.getElementById('contadorNotificacoes');
        
        if (contador) {
            contador.textContent = naoLidas.length;
            contador.style.display = naoLidas.length > 0 ? 'flex' : 'none';
        }
    }

    salvar() {
        ArmazenamentoLocal.salvar('biblioteca_notificacoes', this.notificacoes);
    }

    // Solicitar permissão para notificações do navegador
    solicitarPermissao() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    mensagens.sucesso('Notificações ativadas!');
                }
            });
        }
    }
}

// Sistema de Parceria com Biblioteca Física
class SistemaBibliotecaFisica {
    constructor() {
        this.agendamentos = this.carregarAgendamentos();
        this.inicializarEventos();
    }

    carregarAgendamentos() {
        return ArmazenamentoLocal.carregar('biblioteca_agendamentos') || [];
    }

    inicializarEventos() {
        // Eventos serão adicionados quando necessário
    }

    agendarRetirada(livroId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        const livro = sistemaLivros.livros.find(l => l.id === livroId);

        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Você precisa estar logado para agendar retiradas.');
            return false;
        }

        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return false;
        }

        // Verificar se já existe agendamento ativo para este livro
        const agendamentoAtivo = this.agendamentos.find(a => 
            a.livroId === livroId && 
            a.usuarioId === usuario.id && 
            a.status === 'agendado'
        );

        if (agendamentoAtivo) {
            mensagens.erro('Você já tem um agendamento ativo para este livro.');
            return false;
        }

        // Criar agendamento
        const novoAgendamento = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            livroTitulo: livro.titulo,
            livroAutor: livro.autor,
            livroImagem: livro.imagem,
            dataAgendamento: new Date().toISOString(),
            dataRetiradaPrevista: UtilitariosData.adicionarDias(new Date(), 2).toISOString(), // 2 dias para retirar
            dataRetirada: null,
            dataDevolucaoPrevista: UtilitariosData.adicionarDias(new Date(), 16).toISOString(), // 14 dias de empréstimo
            status: 'agendado',
            local: 'Biblioteca CESF - Prédio Principal',
            observacoes: 'Livro reservado para retirada física'
        };

        this.agendamentos.push(novoAgendamento);
        this.salvar();

        // Notificação
        sistemaNotificacoes.adicionar(
            'Agendamento Confirmado',
            `Seu agendamento para "${livro.titulo}" foi realizado com sucesso!`,
            'sucesso',
            '#agendamentos'
        );

        mensagens.sucesso(`Agendamento realizado! Retire o livro na biblioteca até ${UtilitariosData.formatarData(novoAgendamento.dataRetiradaPrevista)}.`);
        return true;
    }

    confirmarRetirada(agendamentoId) {
        const agendamento = this.agendamentos.find(a => a.id === agendamentoId);
        if (agendamento) {
            agendamento.status = 'retirado';
            agendamento.dataRetirada = new Date().toISOString();
            this.salvar();

            sistemaNotificacoes.adicionar(
                'Retirada Confirmada',
                `Livro "${agendamento.livroTitulo}" retirado com sucesso.`,
                'sucesso'
            );

            return true;
        }
        return false;
    }

    cancelarAgendamento(agendamentoId) {
        const index = this.agendamentos.findIndex(a => a.id === agendamentoId);
        if (index !== -1) {
            const agendamento = this.agendamentos[index];
            this.agendamentos.splice(index, 1);
            this.salvar();

            sistemaNotificacoes.adicionar(
                'Agendamento Cancelado',
                `Agendamento para "${agendamento.livroTitulo}" foi cancelado.`,
                'info'
            );

            return true;
        }
        return false;
    }

    obterAgendamentosUsuario(usuarioId) {
        return this.agendamentos.filter(a => a.usuarioId === usuarioId);
    }

    obterAgendamentosAtivos() {
        return this.agendamentos.filter(a => a.status === 'agendado');
    }

    salvar() {
        ArmazenamentoLocal.salvar('biblioteca_agendamentos', this.agendamentos);
    }
}

// Funções de Login Rápido Melhoradas
function loginRapido(usuario) {
    console.log('Tentando login rápido para:', usuario);
    
    const usuarioEncontrado = sistemaAuth.usuarios.find(u => u.usuario === usuario);

    if (usuarioEncontrado) {
        // Adicionar animação de loading
        const botao = event.target;
        const originalHTML = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-spinner carregando"></i> Entrando...';
        botao.disabled = true;

        setTimeout(() => {
            sistemaAuth.usuarioLogado = usuarioEncontrado;
            ArmazenamentoLocal.salvar('usuario_logado', usuarioEncontrado);
            
            mensagens.sucesso(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
            sistemaAuth.entrarNoSistema();
            sistemaAuth.fecharModal('modalLogin');
            
            // Restaurar botão
            botao.innerHTML = originalHTML;
            botao.disabled = false;
        }, 1000);

        return true;
    } else {
        mensagens.erro(`Usuário "${usuario}" não encontrado.`);
        event.target.classList.add('erro');
        setTimeout(() => event.target.classList.remove('erro'), 1000);
        return false;
    }
}

// Inicializar todos os sistemas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Biblioteca Cesf Online - Sistema carregado');
    
    // Inicializar sistemas
    window.sistemaTema = new SistemaTema();
    window.sistemaNotificacoes = new SistemaNotificacoes();
    window.sistemaBibliotecaFisica = new SistemaBibliotecaFisica();
    
    // Verificar se há usuário logado
    const usuarioLogado = sistemaAuth.getUsuarioLogado();
    if (usuarioLogado) {
        sistemaAuth.entrarNoSistema();
    }

    // Adicionar estilos dinâmicos
    adicionarEstilosDinamicos();
    
    // Prevenir comportamento padrão de botões
    prevenirScrollBotao();
    
    // Solicitar permissão para notificações
    setTimeout(() => {
        sistemaNotificacoes.solicitarPermissao();
    }, 2000);

    // Adicionar botão admin no header se for admin
    atualizarBotaoAdminHeader();
});

function prevenirScrollBotao() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.botao') || e.target.closest('.item-menu') || 
            e.target.closest('.pagina') || e.target.closest('.botao-tamanho') ||
            e.target.closest('.botao-acao')) {
            e.preventDefault();
        }
    });
}

function alternarTema() {
    sistemaTema.alternarTema();
}

function abrirNotificacoes() {
    sistemaNotificacoes.mostrarModalNotificacoes();
}

function atualizarBotaoAdminHeader() {
    const usuario = sistemaAuth.getUsuarioLogado();
    const acoesNav = document.querySelector('.acoes-nav');
    
    if (usuario && usuario.tipo === 'admin' && acoesNav) {
        // Verificar se o botão já existe
        let botaoAdmin = document.getElementById('botaoAdminHeader');
        if (!botaoAdmin) {
            botaoAdmin = document.createElement('button');
            botaoAdmin.id = 'botaoAdminHeader';
            botaoAdmin.className = 'botao botao-admin-header';
            botaoAdmin.innerHTML = '<i class="fas fa-cog"></i> Admin';
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
    }
}

// Adicionar estilos CSS dinâmicos para elementos específicos
function adicionarEstilosDinamicos() {
    const estilos = `
        .botao-login-rapido {
            transition: all 0.3s ease !important;
        }
        
        .botao-login-rapido.erro {
            animation: shake 0.5s ease-in-out;
            background: var(--vermelho) !important;
        }
        
        .notificacao-icon {
            font-size: 1.2rem;
            width: 24px;
            text-align: center;
        }
        
        .notificacao-conteudo {
            flex: 1;
            min-width: 0;
        }
        
        .notificacao-conteudo strong {
            display: block;
            margin-bottom: 4px;
            color: var(--preto);
        }
        
        .notificacao-conteudo p {
            margin: 0;
            color: var(--cinza-escuro);
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .agendamento-item {
            background: var(--branco);
            padding: 1rem;
            border-radius: var(--raio-borda);
            box-shadow: var(--sombra-suave);
            margin-bottom: 1rem;
            border-left: 4px solid var(--azul);
            transition: var(--transicao-normal);
        }
        
        .agendamento-item:hover {
            transform: translateX(5px);
            box-shadow: var(--sombra-media);
        }
        
        .agendamento-item.vencendo {
            border-left-color: var(--laranja);
            background: var(--amarelo);
        }
        
        .agendamento-item.atrasado {
            border-left-color: var(--vermelho);
            background: var(--vermelho-claro);
        }
        
        .agendamento-cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }
        
        .agendamento-livro {
            font-weight: 600;
            color: var(--vinho-principal);
            font-size: 1.1rem;
        }
        
        .agendamento-status {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .status-agendado {
            background: var(--azul);
            color: var(--branco);
        }
        
        .status-retirado {
            background: var(--verde);
            color: var(--branco);
        }
        
        .status-cancelado {
            background: var(--cinza-medio);
            color: var(--branco);
        }
        
        .agendamento-datas {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin: 0.5rem 0;
        }
        
        .data-item {
            display: flex;
            flex-direction: column;
        }
        
        .data-rotulo {
            font-size: 0.8rem;
            color: var(--cinza-medio);
            font-weight: 600;
        }
        
        .data-valor {
            font-weight: 600;
            color: var(--preto);
        }
        
        .agendamento-acoes {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .modal-agendamentos {
            max-width: 800px !important;
        }
        
        .lista-agendamentos {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .sem-agendamentos {
            text-align: center;
            padding: 2rem;
            color: var(--cinza-medio);
            font-style: italic;
        }
        
        @media (max-width: 768px) {
            .agendamento-cabecalho {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .agendamento-datas {
                grid-template-columns: 1fr;
            }
            
            .agendamento-acoes {
                flex-direction: column;
            }
            
            .agendamento-acoes .botao {
                width: 100%;
                justify-content: center;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = estilos;
    document.head.appendChild(styleSheet);
}

// Funções globais para agendamentos
function agendarRetirada(livroId) {
    return sistemaBibliotecaFisica.agendarRetirada(livroId);
}

function mostrarAgendamentos() {
    const usuario = sistemaAuth.getUsuarioLogado();
    if (!usuario) {
        mensagens.erro('Você precisa estar logado para ver seus agendamentos.');
        return;
    }

    const agendamentos = sistemaBibliotecaFisica.obterAgendamentosUsuario(usuario.id);
    
    let modal = document.getElementById('modalAgendamentos');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalAgendamentos';
        modal.className = 'modal modal-agendamentos';
        modal.innerHTML = `
            <div class="modal-conteudo">
                <div class="modal-cabecalho">
                    <h2>Meus Agendamentos</h2>
                    <button class="fechar-modal" onclick="fecharModal('modalAgendamentos')">&times;</button>
                </div>
                <div class="modal-corpo">
                    <div class="lista-agendamentos" id="listaAgendamentos">
                        ${agendamentos.length > 0 ? 
                            agendamentos.map(agendamento => `
                                <div class="agendamento-item ${agendamento.status}">
                                    <div class="agendamento-cabecalho">
                                        <div>
                                            <div class="agendamento-livro">${agendamento.livroTitulo}</div>
                                            <div class="agendamento-autor">${agendamento.livroAutor}</div>
                                        </div>
                                        <span class="agendamento-status status-${agendamento.status}">
                                            ${agendamento.status === 'agendado' ? 'Agendado' : 
                                              agendamento.status === 'retirado' ? 'Retirado' : 'Cancelado'}
                                        </span>
                                    </div>
                                    <div class="agendamento-datas">
                                        <div class="data-item">
                                            <span class="data-rotulo">Agendado em:</span>
                                            <span class="data-valor">${UtilitariosData.formatarData(agendamento.dataAgendamento)}</span>
                                        </div>
                                        <div class="data-item">
                                            <span class="data-rotulo">Retirar até:</span>
                                            <span class="data-valor">${UtilitariosData.formatarData(agendamento.dataRetiradaPrevista)}</span>
                                        </div>
                                        ${agendamento.dataRetirada ? `
                                        <div class="data-item">
                                            <span class="data-rotulo">Retirado em:</span>
                                            <span class="data-valor">${UtilitariosData.formatarData(agendamento.dataRetirada)}</span>
                                        </div>
                                        ` : ''}
                                        <div class="data-item">
                                            <span class="data-rotulo">Devolver até:</span>
                                            <span class="data-valor">${UtilitariosData.formatarData(agendamento.dataDevolucaoPrevista)}</span>
                                        </div>
                                    </div>
                                    <div class="data-item">
                                        <span class="data-rotulo">Local:</span>
                                        <span class="data-valor">${agendamento.local}</span>
                                    </div>
                                    ${agendamento.status === 'agendado' ? `
                                    <div class="agendamento-acoes">
                                        <button class="botao botao-primario botao-pequeno" onclick="confirmarRetirada('${agendamento.id}')">
                                            <i class="fas fa-check"></i>
                                            Confirmar Retirada
                                        </button>
                                        <button class="botao botao-secundario botao-pequeno" onclick="cancelarAgendamento('${agendamento.id}')">
                                            <i class="fas fa-times"></i>
                                            Cancelar
                                        </button>
                                    </div>
                                    ` : ''}
                                </div>
                            `).join('') 
                            : '<p class="sem-agendamentos">Nenhum agendamento encontrado.</p>'
                        }
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function confirmarRetirada(agendamentoId) {
    if (sistemaBibliotecaFisica.confirmarRetirada(agendamentoId)) {
        mensagens.sucesso('Retirada confirmada com sucesso!');
        fecharModal('modalAgendamentos');
    }
}

function cancelarAgendamento(agendamentoId) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        if (sistemaBibliotecaFisica.cancelarAgendamento(agendamentoId)) {
            mensagens.info('Agendamento cancelado.');
            fecharModal('modalAgendamentos');
        }
    }
}

// Exportar para uso global
window.sistemaNotificacoes = sistemaNotificacoes;
window.sistemaBibliotecaFisica = sistemaBibliotecaFisica;
window.loginRapido = loginRapido;
window.agendarRetirada = agendarRetirada;
window.mostrarAgendamentos = mostrarAgendamentos;
window.confirmarRetirada = confirmarRetirada;
window.cancelarAgendamento = cancelarAgendamento;