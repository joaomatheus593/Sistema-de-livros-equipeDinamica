class SistemaComentarios {
    constructor() {
        this.comentarios = this.carregarComentarios();
        this.inicializarEventos();
        console.log('💬 Sistema de Comentários inicializado com', this.comentarios.length, 'comentários');
    }

    carregarComentarios() {
        let comentarios = ArmazenamentoLocal.carregar('biblioteca_comentarios');
        
        if (!comentarios) {
            console.log('📝 Criando comentários de exemplo...');
            comentarios = this.criarComentariosExemplo();
            ArmazenamentoLocal.salvar('biblioteca_comentarios', comentarios);
        }
        
        return comentarios;
    }

    criarComentariosExemplo() {
        const livros = ArmazenamentoLocal.carregar('biblioteca_livros') || [];
        if (livros.length === 0) return [];

        const comentariosExemplo = [
            {
                id: GeradorID.gerar(),
                livroId: livros[0].id,
                usuarioId: 'admin-001',
                usuarioNome: 'Administrador',
                usuarioAvatar: '👑',
                avaliacao: 5,
                comentario: 'Excelente livro! Uma obra prima da literatura brasileira que todos deveriam ler. A narrativa é envolvente e os personagens são muito bem construídos.',
                data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                aprovado: true,
                likes: 12,
                reportado: false
            },
            {
                id: GeradorID.gerar(),
                livroId: livros[0].id,
                usuarioId: 'user-001',
                usuarioNome: 'João Silva',
                usuarioAvatar: '👨‍💼',
                avaliacao: 4,
                comentario: 'Muito bom, mas a linguagem é um pouco difícil para quem não está acostumado com clássicos. Recomendo para leitores experientes.',
                data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                aprovado: true,
                likes: 8,
                reportado: false
            },
            {
                id: GeradorID.gerar(),
                livroId: livros[1].id,
                usuarioId: 'user-002',
                usuarioNome: 'Maria Oliveira',
                usuarioAvatar: '👩‍🎓',
                avaliacao: 5,
                comentario: 'Adorei este livro! A história é emocionante e me fez refletir sobre muitos aspectos da vida. Leitura obrigatória!',
                data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                aprovado: true,
                likes: 15,
                reportado: false
            },
            {
                id: GeradorID.gerar(),
                livroId: livros[1].id,
                usuarioId: 'user-003',
                usuarioNome: 'Carlos Santos',
                usuarioAvatar: '👨‍🔬',
                avaliacao: 3,
                comentario: 'O livro é interessante, mas achei um pouco longo demais. Poderia ser mais conciso em alguns capítulos.',
                data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                aprovado: false, // Pendente de aprovação
                likes: 2,
                reportado: false
            }
        ];

        return comentariosExemplo;
    }

    inicializarEventos() {
        // Observar quando o modal de detalhes do livro é aberto
        this.inicializarObservadorModal();
        
        // Eventos de formulário serão adicionados dinamicamente
        console.log('✅ Eventos de comentários inicializados');
    }

    inicializarObservadorModal() {
        const modal = document.getElementById('modalDetalhesLivro');
        if (!modal) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const displayStyle = modal.style.display;
                    if (displayStyle !== 'none') {
                        // O modal foi aberto, inicializar eventos do formulário
                        setTimeout(() => {
                            this.inicializarEventosFormulario();
                        }, 500);
                    }
                }
            });
        });

        observer.observe(modal, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }

    inicializarEventosFormulario() {
        const formComentario = document.getElementById('formComentario');
        if (formComentario) {
            // Remover event listener anterior para evitar duplicação
            formComentario.removeEventListener('submit', this.manipularEnvioComentario);
            formComentario.addEventListener('submit', this.manipularEnvioComentario.bind(this));
        }

        // Inicializar sistema de estrelas
        this.inicializarSistemaEstrelas();
    }

    inicializarSistemaEstrelas() {
        const containerEstrelas = document.querySelector('.estrelas-avaliacao');
        if (!containerEstrelas) return;

        // Limpar estrelas existentes
        containerEstrelas.innerHTML = '';

        // Criar 5 estrelas
        for (let i = 1; i <= 5; i++) {
            const estrela = document.createElement('span');
            estrela.className = 'estrela-avaliacao';
            estrela.innerHTML = '★';
            estrela.dataset.valor = i;
            estrela.style.cursor = 'pointer';
            estrela.style.fontSize = '24px';
            estrela.style.color = '#ccc';
            estrela.style.marginRight = '5px';
            estrela.style.transition = 'color 0.2s ease';

            estrela.addEventListener('click', () => {
                this.selecionarAvaliacao(i);
            });

            estrela.addEventListener('mouseover', () => {
                this.highlightEstrelas(i);
            });

            containerEstrelas.appendChild(estrela);
        }

        // Resetar highlight quando o mouse sair
        containerEstrelas.addEventListener('mouseleave', () => {
            const avaliacaoAtual = parseInt(document.getElementById('avaliacaoInput').value) || 0;
            this.highlightEstrelas(avaliacaoAtual);
        });

        // Definir avaliação padrão como 5
        this.selecionarAvaliacao(5);
    }

    highlightEstrelas(numero) {
        const estrelas = document.querySelectorAll('.estrela-avaliacao');
        estrelas.forEach((estrela, index) => {
            if (index < numero) {
                estrela.style.color = '#FFD700'; // Dourado
            } else {
                estrela.style.color = '#ccc'; // Cinza
            }
        });
    }

    selecionarAvaliacao(rating) {
        document.getElementById('avaliacaoInput').value = rating;
        this.highlightEstrelas(rating);
    }

    manipularEnvioComentario(event) {
        event.preventDefault();
        
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Você precisa estar logado para comentar.');
            sistemaAuth.mostrarLogin();
            return;
        }

        // Obter livroId do modal atual
        const modalDetalhes = document.getElementById('modalDetalhesLivro');
        const livroId = modalDetalhes?.dataset.livroId;
        
        if (!livroId) {
            mensagens.erro('Erro: Livro não identificado.');
            return;
        }

        const avaliacao = parseInt(document.getElementById('avaliacaoInput').value);
        const comentarioTexto = document.getElementById('textoComentario').value.trim();

        // Validações
        if (!comentarioTexto) {
            mensagens.erro('Por favor, escreva um comentário.');
            return;
        }

        if (avaliacao < 1 || avaliacao > 5) {
            mensagens.erro('Por favor, selecione uma avaliação.');
            return;
        }

        if (comentarioTexto.length < 10) {
            mensagens.erro('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }

        if (comentarioTexto.length > 500) {
            mensagens.erro('O comentário não pode ter mais de 500 caracteres.');
            return;
        }

        // Verificar se o usuário já comentou neste livro
        const comentarioExistente = this.comentarios.find(c => 
            c.livroId === livroId && 
            c.usuarioId === usuario.id && 
            c.aprovado !== false
        );

        if (comentarioExistente) {
            mensagens.erro('Você já tem um comentário aprovado para este livro.');
            return;
        }

        // Criar novo comentário
        const novoComentario = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            usuarioAvatar: usuario.avatar || '👤',
            avaliacao: avaliacao,
            comentario: Validacoes.sanitizarHTML(comentarioTexto),
            data: new Date().toISOString(),
            aprovado: usuario.tipo === 'admin', // Aprovação automática para admins
            likes: 0,
            reportado: false,
            respostas: []
        };

        this.comentarios.unshift(novoComentario);
        this.salvarComentarios();

        // Limpar formulário
        document.getElementById('textoComentario').value = '';
        this.selecionarAvaliacao(5);

        // Feedback para o usuário
        if (usuario.tipo === 'admin') {
            mensagens.sucesso('Comentário publicado com sucesso!');
            this.carregarComentariosLivro(livroId);
        } else {
            mensagens.info('Comentário enviado para aprovação. Obrigado pela contribuição!');
            
            // Recarregar comentários (mostrar apenas os aprovados)
            this.carregarComentariosLivro(livroId);
        }

        // Atualizar média de avaliações do livro
        this.atualizarAvaliacaoLivro(livroId);

        // Notificação para administradores
        if (usuario.tipo !== 'admin') {
            this.notificarNovoComentario(novoComentario);
        }

        console.log('✅ Novo comentário adicionado:', novoComentario);
    }

    carregarComentariosLivro(livroId) {
        const container = document.getElementById('listaComentarios');
        if (!container) {
            console.error('❌ Container de comentários não encontrado');
            return;
        }

        const comentariosLivro = this.obterComentariosAprovados(livroId);
        const usuario = sistemaAuth.getUsuarioLogado();

        if (comentariosLivro.length === 0) {
            container.innerHTML = `
                <div class="sem-comentarios">
                    <div class="icone-sem-comentarios">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h4>Nenhum comentário ainda</h4>
                    <p>Seja o primeiro a compartilhar sua opinião sobre este livro!</p>
                    ${usuario && usuario.tipo !== 'convidado' ? `
                        <button class="botao botao-primario" onclick="document.getElementById('textoComentario').focus()">
                            <i class="fas fa-edit"></i>
                            Escrever Primeiro Comentário
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        // Calcular estatísticas
        const estatisticas = this.calcularEstatisticasComentarios(comentariosLivro);

        container.innerHTML = `
            <div class="cabecalho-comentarios">
                <div class="estatisticas-comentarios">
                    <div class="estatistica">
                        <span class="numero">${comentariosLivro.length}</span>
                        <span class="rotulo">Comentários</span>
                    </div>
                    <div class="estatistica">
                        <span class="numero">${estatisticas.mediaAvaliacao}</span>
                        <span class="rotulo">Avaliação Média</span>
                    </div>
                    <div class="estatistica">
                        <span class="numero">${estatisticas.distribuicao[5] || 0}</span>
                        <span class="rotulo">⭐ 5 estrelas</span>
                    </div>
                </div>
            </div>

            <div class="lista-comentarios">
                ${comentariosLivro.map(comentario => this.criarItemComentario(comentario, usuario)).join('')}
            </div>
        `;

        // Adicionar eventos de interação
        this.adicionarEventosInteracao();
    }

    obterComentariosAprovados(livroId) {
        return this.comentarios
            .filter(c => c.livroId === livroId && c.aprovado)
            .sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    calcularEstatisticasComentarios(comentarios) {
        if (comentarios.length === 0) {
            return {
                mediaAvaliacao: '0.0',
                distribuicao: {1:0, 2:0, 3:0, 4:0, 5:0}
            };
        }

        const somaAvaliacoes = comentarios.reduce((soma, c) => soma + c.avaliacao, 0);
        const mediaAvaliacao = (somaAvaliacoes / comentarios.length).toFixed(1);

        const distribuicao = {1:0, 2:0, 3:0, 4:0, 5:0};
        comentarios.forEach(c => {
            distribuicao[c.avaliacao]++;
        });

        return {
            mediaAvaliacao,
            distribuicao
        };
    }

    criarItemComentario(comentario, usuarioLogado) {
        const isProprioComentario = usuarioLogado && comentario.usuarioId === usuarioLogado.id;
        const jaCurtiu = comentario.likes && comentario.likes.includes(usuarioLogado?.id);
        
        return `
            <div class="comentario-item" data-comentario-id="${comentario.id}">
                <div class="comentario-cabecalho">
                    <div class="comentario-usuario-info">
                        <div class="avatar-usuario">${comentario.usuarioAvatar}</div>
                        <div class="info-usuario">
                            <strong class="nome-usuario">${comentario.usuarioNome}</strong>
                            <div class="comentario-metadata">
                                <span class="comentario-data">${UtilitariosData.formatarTempoDecorrido(comentario.data)}</span>
                                ${isProprioComentario ? '<span class="badge-proprio">Seu comentário</span>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="comentario-avaliacao">
                        <div class="estrelas-comentario">
                            ${this.gerarEstrelas(comentario.avaliacao)}
                        </div>
                    </div>
                </div>

                <div class="comentario-texto">
                    ${comentario.comentario}
                </div>

                <div class="comentario-acoes">
                    <button class="botao-acao-comentario ${jaCurtiu ? 'curtido' : ''}" 
                            onclick="sistemaComentarios.curtirComentario('${comentario.id}')"
                            ${!usuarioLogado ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-up"></i>
                        <span class="contador-likes">${comentario.likes || 0}</span>
                    </button>

                    ${usuarioLogado && !isProprioComentario ? `
                        <button class="botao-acao-comentario" onclick="sistemaComentarios.reportarComentario('${comentario.id}')">
                            <i class="fas fa-flag"></i>
                            Reportar
                        </button>
                    ` : ''}

                    ${isProprioComentario ? `
                        <button class="botao-acao-comentario" onclick="sistemaComentarios.editarComentario('${comentario.id}')">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="botao-acao-comentario" onclick="sistemaComentarios.excluirComentario('${comentario.id}')">
                            <i class="fas fa-trash"></i>
                            Excluir
                        </button>
                    ` : ''}

                    ${sistemaAuth.isAdmin() && !isProprioComentario ? `
                        <button class="botao-acao-comentario admin" onclick="sistemaComentarios.reprovarComentario('${comentario.id}')">
                            <i class="fas fa-times"></i>
                            Reprovar
                        </button>
                    ` : ''}
                </div>

                ${comentario.respostas && comentario.respostas.length > 0 ? `
                    <div class="respostas-comentario">
                        ${comentario.respostas.map(resposta => this.criarItemResposta(resposta)).join('')}
                    </div>
                ` : ''}

                ${usuarioLogado && sistemaAuth.isAdmin() && !isProprioComentario ? `
                    <div class="comentario-resposta">
                        <textarea class="input-resposta" placeholder="Digite uma resposta..." rows="2"></textarea>
                        <button class="botao botao-pequeno" onclick="sistemaComentarios.enviarResposta('${comentario.id}')">
                            <i class="fas fa-reply"></i>
                            Responder
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    criarItemResposta(resposta) {
        return `
            <div class="resposta-item">
                <div class="resposta-cabecalho">
                    <div class="avatar-usuario pequeno">${resposta.usuarioAvatar}</div>
                    <strong class="nome-usuario">${resposta.usuarioNome}</strong>
                    <span class="resposta-data">${UtilitariosData.formatarTempoDecorrido(resposta.data)}</span>
                </div>
                <div class="resposta-texto">${resposta.texto}</div>
            </div>
        `;
    }

    gerarEstrelas(avaliacao) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= avaliacao) {
                html += '<i class="fas fa-star estrela-cheia"></i>';
            } else {
                html += '<i class="far fa-star estrela-vazia"></i>';
            }
        }
        return html;
    }

    adicionarEventosInteracao() {
        // Eventos serão adicionados quando necessário
    }

    // ========== SISTEMA DE INTERAÇÕES ==========

    curtirComentario(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Você precisa estar logado para curtir comentários.');
            return;
        }

        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        // Inicializar array de likes se não existir
        if (!comentario.likes) {
            comentario.likes = [];
        }

        const jaCurtiu = comentario.likes.includes(usuario.id);

        if (jaCurtiu) {
            // Remover like
            comentario.likes = comentario.likes.filter(id => id !== usuario.id);
        } else {
            // Adicionar like
            comentario.likes.push(usuario.id);
        }

        this.salvarComentarios();
        this.atualizarInterfaceComentario(comentarioId);

        mensagens.info(jaCurtiu ? 'Like removido!' : 'Comentário curtido!');
    }

    reportarComentario(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Você precisa estar logado para reportar comentários.');
            return;
        }

        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        const motivo = prompt('Por favor, digite o motivo do reporte:');
        if (!motivo) return;

        comentario.reportado = true;
        comentario.motivoReporte = motivo;
        comentario.usuarioReporte = usuario.id;
        comentario.dataReporte = new Date().toISOString();

        this.salvarComentarios();

        // Notificar administradores
        this.notificarComentarioReportado(comentario);

        mensagens.info('Comentário reportado. Os administradores irão analisar.');
    }

    editarComentario(comentarioId) {
        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        const novoComentario = prompt('Edite seu comentário:', comentario.comentario);
        if (!novoComentario || novoComentario === comentario.comentario) return;

        if (novoComentario.length < 10) {
            mensagens.erro('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }

        comentario.comentario = Validacoes.sanitizarHTML(novoComentario);
        comentario.editado = true;
        comentario.dataEdicao = new Date().toISOString();

        this.salvarComentarios();
        this.atualizarInterfaceComentario(comentarioId);

        mensagens.sucesso('Comentário editado com sucesso!');
    }

    excluirComentario(comentarioId) {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) {
            return;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        const comentario = this.comentarios[comentarioIndex];
        this.comentarios.splice(comentarioIndex, 1);
        this.salvarComentarios();

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(comentario.livroId);

        // Recarregar comentários
        this.carregarComentariosLivro(comentario.livroId);

        mensagens.info('Comentário excluído com sucesso!');
    }

    enviarResposta(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario || !sistemaAuth.isAdmin()) {
            mensagens.erro('Apenas administradores podem responder comentários.');
            return;
        }

        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        const inputResposta = document.querySelector(`[data-comentario-id="${comentarioId}"] .input-resposta`);
        const textoResposta = inputResposta?.value.trim();

        if (!textoResposta) {
            mensagens.erro('Por favor, digite uma resposta.');
            return;
        }

        // Inicializar array de respostas se não existir
        if (!comentario.respostas) {
            comentario.respostas = [];
        }

        const novaResposta = {
            id: GeradorID.gerar(),
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            usuarioAvatar: usuario.avatar || '👑',
            texto: Validacoes.sanitizarHTML(textoResposta),
            data: new Date().toISOString()
        };

        comentario.respostas.push(novaResposta);
        this.salvarComentarios();

        // Limpar e atualizar interface
        inputResposta.value = '';
        this.atualizarInterfaceComentario(comentarioId);

        mensagens.sucesso('Resposta enviada com sucesso!');
    }

    // ========== SISTEMA DE MODERAÇÃO ==========

    aprovarComentario(comentarioId) {
        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return false;

        comentario.aprovado = true;
        comentario.dataAprovacao = new Date().toISOString();
        comentario.moderadorAprovacao = sistemaAuth.getUsuarioLogado()?.id;

        this.salvarComentarios();

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(comentario.livroId);

        // Notificar usuário
        this.notificarComentarioAprovado(comentario);

        return true;
    }

    reprovarComentario(comentarioId) {
        if (!confirm('Tem certeza que deseja reprovar este comentário?')) {
            return false;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return false;

        const comentario = this.comentarios[comentarioIndex];
        this.comentarios.splice(comentarioIndex, 1);
        this.salvarComentarios();

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(comentario.livroId);

        // Notificar usuário
        this.notificarComentarioReprovado(comentario);

        return true;
    }

    getComentariosPendentes() {
        return this.comentarios.filter(c => !c.aprovado);
    }

    getComentariosReportados() {
        return this.comentarios.filter(c => c.reportado);
    }

    // ========== SISTEMA DE NOTIFICAÇÕES ==========

    notificarNovoComentario(comentario) {
        if (typeof sistemaNotificacoes !== 'undefined') {
            sistemaNotificacoes.adicionar(
                'Novo Comentário Pendente',
                `${comentario.usuarioNome} comentou no livro. Aguardando aprovação.`,
                'info',
                '#comentarios'
            );
        }
    }

    notificarComentarioReportado(comentario) {
        if (typeof sistemaNotificacoes !== 'undefined') {
            sistemaNotificacoes.adicionar(
                'Comentário Reportado',
                `Comentário de ${comentario.usuarioNome} foi reportado.`,
                'aviso',
                '#comentarios'
            );
        }
    }

    notificarComentarioAprovado(comentario) {
        // Em um sistema real, enviaria email/notificação para o usuário
        console.log(`✅ Comentário de ${comentario.usuarioNome} aprovado`);
    }

    notificarComentarioReprovado(comentario) {
        // Em um sistema real, enviaria email/notificação para o usuário
        console.log(`❌ Comentário de ${comentario.usuarioNome} reprovado`);
    }

    // ========== SISTEMA DE AVALIAÇÕES ==========

    atualizarAvaliacaoLivro(livroId) {
        const comentariosAprovados = this.obterComentariosAprovados(livroId);

        if (comentariosAprovados.length === 0) return;

        const somaAvaliacoes = comentariosAprovados.reduce((soma, c) => soma + c.avaliacao, 0);
        const media = somaAvaliacoes / comentariosAprovados.length;

        // Atualizar livro
        const livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        const livroIndex = livros.findIndex(l => l.id === livroId);
        
        if (livroIndex !== -1) {
            livros[livroIndex].avaliacao = parseFloat(media.toFixed(1));
            livros[livroIndex].totalAvaliacoes = comentariosAprovados.length;
            ArmazenamentoLocal.salvar('biblioteca_livros', livros);
            
            // Atualizar sistema de livros
            if (typeof sistemaLivros !== 'undefined') {
                sistemaLivros.livros = livros;
            }
        }
    }

    // ========== UTILITÁRIOS ==========

    atualizarInterfaceComentario(comentarioId) {
        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        const livroId = comentario.livroId;
        this.carregarComentariosLivro(livroId);
    }

    salvarComentarios() {
        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);
    }

    // ========== ESTATÍSTICAS E RELATÓRIOS ==========

    getEstatisticasComentarios() {
        const totalComentarios = this.comentarios.length;
        const comentariosAprovados = this.comentarios.filter(c => c.aprovado).length;
        const comentariosPendentes = this.comentarios.filter(c => !c.aprovado).length;
        const comentariosReportados = this.comentarios.filter(c => c.reportado).length;

        return {
            totalComentarios,
            comentariosAprovados,
            comentariosPendentes,
            comentariosReportados,
            taxaAprovacao: totalComentarios > 0 ? (comentariosAprovados / totalComentarios * 100).toFixed(1) : 0
        };
    }

    // ========== MÉTODOS PARA ADMINISTRAÇÃO ==========

    obterComentariosPorUsuario(usuarioId) {
        return this.comentarios.filter(c => c.usuarioId === usuarioId);
    }

    obterComentariosPorLivro(livroId) {
        return this.comentarios.filter(c => c.livroId === livroId);
    }

    limparComentariosUsuario(usuarioId) {
        this.comentarios = this.comentarios.filter(c => c.usuarioId !== usuarioId);
        this.salvarComentarios();
    }
}

// Inicializar sistema de comentários
const sistemaComentarios = new SistemaComentarios();

// Funções globais para uso no HTML
function selecionarAvaliacao(rating) {
    sistemaComentarios.selecionarAvaliacao(rating);
}

function enviarComentario(event) {
    // Esta função será chamada pelo formulário HTML
    if (event) event.preventDefault();
    sistemaComentarios.manipularEnvioComentario(event);
}

// Exportar para uso global
window.sistemaComentarios = sistemaComentarios;
window.selecionarAvaliacao = selecionarAvaliacao;
window.enviarComentario = enviarComentario;