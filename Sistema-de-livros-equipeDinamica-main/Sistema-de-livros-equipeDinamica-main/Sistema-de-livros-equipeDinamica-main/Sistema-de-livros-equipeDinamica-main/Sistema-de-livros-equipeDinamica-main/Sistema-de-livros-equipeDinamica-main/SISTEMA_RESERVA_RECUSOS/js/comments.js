class SistemaComentarios {
    constructor() {
        this.comentarios = this.carregarComentarios();
        this.avaliacaoAtual = 5;
        this.inicializarEventos();
    }

    carregarComentarios() {
        let comentarios = ArmazenamentoLocal.carregar('biblioteca_comentarios');
        
        if (!comentarios) {
            // Comentários de exemplo para demonstração
            const primeiroLivroId = this.obterPrimeiroLivroId();
            comentarios = [
                {
                    id: GeradorID.gerar(),
                    livroId: primeiroLivroId,
                    usuarioId: 'admin',
                    usuarioNome: 'Administrador',
                    comentario: 'Excelente livro! Uma obra prima da literatura brasileira que todos deveriam ler.',
                    avaliacao: 5,
                    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'aprovado',
                    likes: 12,
                    dislikes: 2,
                    curtidas: [],
                    descurtidas: [],
                    editado: false,
                    denuncias: []
                },
                {
                    id: GeradorID.gerar(),
                    livroId: primeiroLivroId,
                    usuarioId: 'usuario',
                    usuarioNome: 'Usuário Teste',
                    comentario: 'Muito bom, mas a linguagem é um pouco difícil para quem não está acostumado com clássicos.',
                    avaliacao: 4,
                    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'aprovado',
                    likes: 8,
                    dislikes: 1,
                    curtidas: [],
                    descurtidas: [],
                    editado: false,
                    denuncias: []
                },
                {
                    id: GeradorID.gerar(),
                    livroId: primeiroLivroId,
                    usuarioId: 'user-003',
                    usuarioNome: 'Pedro Costa',
                    comentario: 'Obra-prima da literatura mundial! Tolkien cria um universo tão rico e detalhado que você se sente dentro da história.',
                    avaliacao: 5,
                    data: new Date('2024-02-01').toISOString(),
                    status: 'aprovado',
                    likes: 25,
                    dislikes: 0,
                    curtidas: [],
                    descurtidas: [],
                    editado: true,
                    denuncias: []
                }
            ];
            ArmazenamentoLocal.salvar('biblioteca_comentarios', comentarios);
        }
        
        return comentarios;
    }

    obterPrimeiroLivroId() {
        const livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        return livros && livros.length > 0 ? livros[0].id : null;
    }

    inicializarEventos() {
        console.log('Sistema de Comentários inicializado com', this.comentarios.length, 'comentários');
    }

    carregarComentariosLivro(livroId) {
        const container = document.getElementById('lista-comentarios');
        if (!container) return;

        const comentariosLivro = this.comentarios.filter(c => 
            c.livroId === livroId && c.status === 'aprovado'
        );

        if (comentariosLivro.length === 0) {
            container.innerHTML = `
                <div class="sem-comentarios">
                    <i class="fas fa-comments"></i>
                    <h4>Nenhum comentário ainda</h4>
                    <p>Seja o primeiro a compartilhar sua opinião sobre este livro!</p>
                </div>
            `;
            return;
        }

        // Ordenar por data (mais recentes primeiro) e por relevância (likes)
        comentariosLivro.sort((a, b) => {
            const dataCompare = new Date(b.data) - new Date(a.data);
            if (dataCompare !== 0) return dataCompare;
            return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        });

        container.innerHTML = comentariosLivro.map(comentario => this.criarItemComentario(comentario)).join('');
    }

    criarItemComentario(comentario) {
        const usuarioLogado = sistemaAuth.getUsuarioLogado();
        const podeEditar = usuarioLogado && (usuarioLogado.id === comentario.usuarioId || usuarioLogado.tipo === 'admin');
        const jaCurtiu = comentario.curtidas && comentario.curtidas.includes(usuarioLogado?.id);
        const jaDescurtiu = comentario.descurtidas && comentario.descurtidas.includes(usuarioLogado?.id);

        return `
            <div class="comentario-item" id="comentario-${comentario.id}">
                <div class="comentario-cabecalho">
                    <div class="comentario-usuario">
                        <div class="comentario-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="comentario-info-usuario">
                            <strong class="comentario-nome">${comentario.usuarioNome}</strong>
                            <div class="comentario-estrelas">
                                ${this.gerarEstrelas(comentario.avaliacao)}
                                <span class="comentario-avaliacao-numero">${comentario.avaliacao}.0</span>
                            </div>
                        </div>
                    </div>
                    <div class="comentario-metadata">
                        <span class="comentario-data">${UtilitariosData.formatarData(comentario.data)}</span>
                        ${comentario.editado ? '<span class="comentario-editado">(editado)</span>' : ''}
                    </div>
                </div>
                
                <div class="comentario-texto" id="comentario-texto-${comentario.id}">
                    ${this.formatarTextoComentario(comentario.comentario)}
                </div>

                <div class="comentario-acoes">
                    <div class="comentario-reacoes">
                        <button class="botao-reacao ${jaCurtiu ? 'ativo' : ''}" 
                                onclick="sistemaComentarios.curtirComentario('${comentario.id}')"
                                ${!usuarioLogado ? 'disabled' : ''}>
                            <i class="fas fa-thumbs-up"></i>
                            <span class="contador-reacao">${comentario.likes || 0}</span>
                        </button>
                        <button class="botao-reacao ${jaDescurtiu ? 'ativo' : ''}" 
                                onclick="sistemaComentarios.descurtirComentario('${comentario.id}')"
                                ${!usuarioLogado ? 'disabled' : ''}>
                            <i class="fas fa-thumbs-down"></i>
                            <span class="contador-reacao">${comentario.dislikes || 0}</span>
                        </button>
                        ${usuarioLogado && usuarioLogado.id !== comentario.usuarioId ? `
                            <button class="botao-reacao" onclick="sistemaComentarios.denunciarComentario('${comentario.id}')">
                                <i class="fas fa-flag"></i>
                                Denunciar
                            </button>
                        ` : ''}
                    </div>
                    
                    ${podeEditar ? `
                        <div class="comentario-controles">
                            <button class="botao-editar-comentario" onclick="sistemaComentarios.editarComentario('${comentario.id}')">
                                <i class="fas fa-edit"></i>
                                Editar
                            </button>
                            <button class="botao-excluir-comentario" onclick="sistemaComentarios.excluirComentario('${comentario.id}')">
                                <i class="fas fa-trash"></i>
                                Excluir
                            </button>
                        </div>
                    ` : ''}
                </div>

                ${comentario.respostaAdmin ? `
                    <div class="comentario-resposta-admin">
                        <div class="resposta-cabecalho">
                            <i class="fas fa-shield-alt"></i>
                            <strong>Resposta da Administração</strong>
                        </div>
                        <div class="resposta-texto">${comentario.respostaAdmin}</div>
                        <div class="resposta-data">${UtilitariosData.formatarData(comentario.dataResposta)}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    gerarEstrelas(avaliacao) {
        const estrelasCheias = Math.floor(avaliacao);
        const temMeiaEstrela = avaliacao % 1 !== 0;
        
        let html = '';
        
        // Estrelas cheias
        for (let i = 0; i < estrelasCheias; i++) {
            html += '<i class="fas fa-star ativa"></i>';
        }
        
        // Meia estrela
        if (temMeiaEstrela) {
            html += '<i class="fas fa-star-half-alt ativa"></i>';
        }
        
        // Estrelas vazias
        const estrelasVazias = 5 - Math.ceil(avaliacao);
        for (let i = 0; i < estrelasVazias; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        return html;
    }

    formatarTextoComentario(texto) {
        // Converter quebras de linha
        texto = texto.replace(/\n/g, '<br>');
        
        // Destacar palavras-chave (exemplo: **negrito**)
        texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Links simples
        texto = texto.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        return texto;
    }

    selecionarAvaliacao(rating) {
        this.avaliacaoAtual = rating;
        
        const estrelas = document.querySelectorAll('.estrelas-avaliacao .fas.fa-star');
        estrelas.forEach((estrela, index) => {
            if (index < rating) {
                estrela.classList.add('ativa');
            } else {
                estrela.classList.remove('ativa');
            }
        });

        document.getElementById('avaliacao-livro').value = rating;
    }

    resetarAvaliacao() {
        this.avaliacaoAtual = 5;
        const estrelas = document.querySelectorAll('.estrelas-avaliacao .fas.fa-star');
        estrelas.forEach((estrela, index) => {
            if (index < 5) {
                estrela.classList.add('ativa');
            } else {
                estrela.classList.remove('ativa');
            }
        });
        document.getElementById('avaliacao-livro').value = 5;
    }

    adicionarComentario(event, livroId) {
        event.preventDefault();
        
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Você precisa estar logado para comentar.');
            return;
        }

        const comentarioTexto = document.getElementById('comentario-livro').value.trim();
        const avaliacao = parseInt(document.getElementById('avaliacao-livro').value);

        if (!comentarioTexto) {
            mensagens.erro('Por favor, escreva um comentário.');
            return;
        }

        if (comentarioTexto.length < 10) {
            mensagens.erro('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }

        if (comentarioTexto.length > 1000) {
            mensagens.erro('O comentário não pode ter mais de 1000 caracteres.');
            return;
        }

        if (avaliacao < 1 || avaliacao > 5) {
            mensagens.erro('Por favor, selecione uma avaliação válida.');
            return;
        }

        const livro = sistemaLivros.livros.find(l => l.id === livroId);
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        // Verificar se usuário já comentou neste livro
        const comentarioExistente = this.comentarios.find(c => 
            c.livroId === livroId && c.usuarioId === usuario.id && c.status !== 'excluido'
        );

        if (comentarioExistente) {
            if (confirm('Você já comentou este livro. Deseja editar seu comentário anterior?')) {
                this.editarComentarioExistente(comentarioExistente.id, comentarioTexto, avaliacao);
                return;
            } else {
                return;
            }
        }

        const novoComentario = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            comentario: comentarioTexto,
            avaliacao: avaliacao,
            data: new Date().toISOString(),
            status: usuario.tipo === 'admin' ? 'aprovado' : 'pendente',
            likes: 0,
            dislikes: 0,
            curtidas: [],
            descurtidas: [],
            editado: false,
            denuncias: []
        };

        this.comentarios.push(novoComentario);
        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(livroId);

        // Limpar formulário
        document.getElementById('comentario-livro').value = '';
        this.resetarAvaliacao();

        // Feedback para o usuário
        if (usuario.tipo === 'admin') {
            mensagens.sucesso('Comentário publicado com sucesso!');
            this.carregarComentariosLivro(livroId);
        } else {
            mensagens.info('Comentário enviado para moderação. Obrigado por contribuir!');
            sistemaLivros.fecharModal('modalDetalhesLivro');
        }

        // Notificar administradores se necessário
        if (usuario.tipo !== 'admin') {
            sistemaNotificacoes.adicionarNotificacaoAdmin(
                'Novo Comentário para Moderar',
                `${usuario.nome} comentou no livro "${livro.titulo}"`,
                'aviso'
            );
        }
    }

    editarComentarioExistente(comentarioId, novoTexto, novaAvaliacao) {
        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        this.comentarios[comentarioIndex].comentario = novoTexto;
        this.comentarios[comentarioIndex].avaliacao = novaAvaliacao;
        this.comentarios[comentarioIndex].editado = true;
        this.comentarios[comentarioIndex].dataEdicao = new Date().toISOString();

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(this.comentarios[comentarioIndex].livroId);

        mensagens.sucesso('Comentário atualizado com sucesso!');
        this.carregarComentariosLivro(this.comentarios[comentarioIndex].livroId);
    }

    editarComentario(comentarioId) {
        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        const novoTexto = prompt('Edite seu comentário:', comentario.comentario);
        if (novoTexto === null) return;

        if (novoTexto.trim().length < 10) {
            mensagens.erro('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }

        this.editarComentarioExistente(comentarioId, novoTexto.trim(), comentario.avaliacao);
    }

    excluirComentario(comentarioId) {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) {
            return;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        const comentario = this.comentarios[comentarioIndex];
        const livroId = comentario.livroId;
        
        // Para administradores, excluir completamente
        if (sistemaAuth.isAdmin()) {
            this.comentarios.splice(comentarioIndex, 1);
        } else {
            // Para usuários normais, marcar como excluído
            this.comentarios[comentarioIndex].status = 'excluido';
        }

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(livroId);

        mensagens.sucesso('Comentário excluído com sucesso!');
        this.carregarComentariosLivro(livroId);
    }

    curtirComentario(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Faça login para curtir comentários.');
            return;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        const comentario = this.comentarios[comentarioIndex];

        // Inicializar arrays se não existirem
        if (!comentario.curtidas) comentario.curtidas = [];
        if (!comentario.descurtidas) comentario.descurtidas = [];

        // Verificar se já curtiu
        if (comentario.curtidas.includes(usuario.id)) {
            // Remover curtida
            comentario.curtidas = comentario.curtidas.filter(id => id !== usuario.id);
            comentario.likes = Math.max(0, (comentario.likes || 0) - 1);
        } else {
            // Adicionar curtida e remover descurtida se existir
            comentario.curtidas.push(usuario.id);
            comentario.likes = (comentario.likes || 0) + 1;

            if (comentario.descurtidas.includes(usuario.id)) {
                comentario.descurtidas = comentario.descurtidas.filter(id => id !== usuario.id);
                comentario.dislikes = Math.max(0, (comentario.dislikes || 0) - 1);
            }
        }

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);
        this.carregarComentariosLivro(comentario.livroId);
    }

    descurtirComentario(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Faça login para descurtir comentários.');
            return;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        const comentario = this.comentarios[comentarioIndex];

        // Inicializar arrays se não existirem
        if (!comentario.curtidas) comentario.curtidas = [];
        if (!comentario.descurtidas) comentario.descurtidas = [];

        // Verificar se já descurtiu
        if (comentario.descurtidas.includes(usuario.id)) {
            // Remover descurtida
            comentario.descurtidas = comentario.descurtidas.filter(id => id !== usuario.id);
            comentario.dislikes = Math.max(0, (comentario.dislikes || 0) - 1);
        } else {
            // Adicionar descurtida e remover curtida se existir
            comentario.descurtidas.push(usuario.id);
            comentario.dislikes = (comentario.dislikes || 0) + 1;

            if (comentario.curtidas.includes(usuario.id)) {
                comentario.curtidas = comentario.curtidas.filter(id => id !== usuario.id);
                comentario.likes = Math.max(0, (comentario.likes || 0) - 1);
            }
        }

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);
        this.carregarComentariosLivro(comentario.livroId);
    }

    denunciarComentario(comentarioId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Faça login para denunciar comentários.');
            return;
        }

        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (!comentario) return;

        if (usuario.id === comentario.usuarioId) {
            mensagens.erro('Você não pode denunciar seu próprio comentário.');
            return;
        }

        const motivo = prompt('Por favor, informe o motivo da denúncia:');
        if (!motivo || motivo.trim().length < 5) {
            mensagens.erro('Por favor, forneça um motivo válido (mínimo 5 caracteres).');
            return;
        }

        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return;

        // Inicializar array de denúncias se não existir
        if (!comentario.denuncias) comentario.denuncias = [];

        // Verificar se já denunciou
        if (comentario.denuncias.find(d => d.usuarioId === usuario.id)) {
            mensagens.info('Você já denunciou este comentário.');
            return;
        }

        comentario.denuncias.push({
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            motivo: motivo.trim(),
            data: new Date().toISOString()
        });

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Notificar administradores
        sistemaNotificacoes.adicionarNotificacaoAdmin(
            'Comentário Denunciado',
            `${usuario.nome} denunciou um comentário de ${comentario.usuarioNome}. Motivo: ${motivo}`,
            'erro'
        );

        mensagens.sucesso('Denúncia enviada com sucesso. Obrigado por ajudar a manter nossa comunidade segura!');
    }

    atualizarAvaliacaoLivro(livroId) {
        const comentariosAprovados = this.comentarios.filter(c => 
            c.livroId === livroId && c.status === 'aprovado'
        );

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
            sistemaLivros.livros = livros;
        }
    }

    // Métodos para administração
    getComentariosPendentes() {
        return this.comentarios.filter(c => c.status === 'pendente');
    }

    getComentariosDenunciados() {
        return this.comentarios.filter(c => c.denuncias && c.denuncias.length > 0);
    }

    aprovarComentario(comentarioId) {
        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return false;

        this.comentarios[comentarioIndex].status = 'aprovado';
        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Atualizar avaliação do livro
        this.atualizarAvaliacaoLivro(this.comentarios[comentarioIndex].livroId);

        return true;
    }

    rejeitarComentario(comentarioId) {
        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return false;

        const motivo = prompt('Informe o motivo da rejeição (opcional):');
        
        this.comentarios[comentarioIndex].status = 'rejeitado';
        if (motivo) {
            this.comentarios[comentarioIndex].motivoRejeicao = motivo;
        }

        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        return true;
    }

    responderComentario(comentarioId, resposta) {
        const comentarioIndex = this.comentarios.findIndex(c => c.id === comentarioId);
        if (comentarioIndex === -1) return false;

        this.comentarios[comentarioIndex].respostaAdmin = resposta;
        this.comentarios[comentarioIndex].dataResposta = new Date().toISOString();
        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        return true;
    }

    // Estatísticas
    getEstatisticasComentarios() {
        const total = this.comentarios.length;
        const aprovados = this.comentarios.filter(c => c.status === 'aprovado').length;
        const pendentes = this.comentarios.filter(c => c.status === 'pendente').length;
        const denunciados = this.comentarios.filter(c => c.denuncias && c.denuncias.length > 0).length;

        return {
            total,
            aprovados,
            pendentes,
            denunciados,
            taxaAprovacao: total > 0 ? ((aprovados / total) * 100).toFixed(1) : 0
        };
    }
}

// Inicializar sistema de comentários
const sistemaComentarios = new SistemaComentarios();