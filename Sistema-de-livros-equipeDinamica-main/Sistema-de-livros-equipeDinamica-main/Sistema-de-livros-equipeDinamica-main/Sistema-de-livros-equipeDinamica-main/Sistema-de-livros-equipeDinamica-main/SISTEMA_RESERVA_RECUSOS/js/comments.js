class SistemaComentarios {
    constructor() {
        this.comentarios = this.carregarComentarios();
    }

    carregarComentarios() {
        let comentarios = ArmazenamentoLocal.carregar('biblioteca_comentarios');
        
        if (!comentarios) {
            // Comentários de exemplo
            comentarios = [
                {
                    id: GeradorID.gerar(),
                    livroId: this.obterPrimeiroLivroId(),
                    usuarioId: 'admin',
                    usuarioNome: 'Administrador',
                    avaliacao: 5,
                    comentario: 'Excelente livro! Uma obra prima da literatura brasileira que todos deveriam ler.',
                    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
                    aprovado: true
                },
                {
                    id: GeradorID.gerar(),
                    livroId: this.obterPrimeiroLivroId(),
                    usuarioId: 'usuario',
                    usuarioNome: 'Usuário Teste',
                    avaliacao: 4,
                    comentario: 'Muito bom, mas a linguagem é um pouco difícil para quem não está acostumado com clássicos.',
                    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
                    aprovado: true
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

    carregarComentariosLivro(livroId) {
        const container = document.getElementById('lista-comentarios');
        if (!container) return;

        const comentariosLivro = this.comentarios
            .filter(c => c.livroId === livroId && c.aprovado)
            .sort((a, b) => new Date(b.data) - new Date(a.data));

        if (comentariosLivro.length === 0) {
            container.innerHTML = '<p class="sem-comentarios">Nenhum comentário ainda. Seja o primeiro a avaliar!</p>';
            return;
        }

        container.innerHTML = comentariosLivro.map(comentario => `
            <div class="comentario-item">
                <div class="comentario-cabecalho">
                    <div class="comentario-usuario">
                        <strong>${comentario.usuarioNome}</strong>
                        <div class="comentario-estrelas">
                            ${sistemaLivros.gerarEstrelas(comentario.avaliacao)}
                        </div>
                    </div>
                    <span class="comentario-data">${UtilitariosData.formatarData(comentario.data)}</span>
                </div>
                <div class="comentario-texto">
                    ${comentario.comentario}
                </div>
            </div>
        `).join('');
    }

    adicionarComentario(event, livroId) {
        event.preventDefault();
        
        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Você precisa estar logado para comentar.');
            return;
        }

        const avaliacao = parseInt(document.getElementById('avaliacao-livro').value);
        const comentarioTexto = document.getElementById('comentario-livro').value.trim();

        if (!comentarioTexto) {
            mensagens.erro('Por favor, escreva um comentário.');
            return;
        }

        if (avaliacao < 1 || avaliacao > 5) {
            mensagens.erro('Por favor, selecione uma avaliação.');
            return;
        }

        const novoComentario = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            avaliacao: avaliacao,
            comentario: comentarioTexto,
            data: new Date().toISOString(),
            aprovado: usuario.tipo === 'admin' // Aprovação automática para admins
        };

        this.comentarios.push(novoComentario);
        ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);

        // Atualizar média de avaliações do livro
        this.atualizarAvaliacaoLivro(livroId);

        // Limpar formulário
        document.getElementById('comentario-livro').value = '';
        this.resetarAvaliacao();

        if (usuario.tipo === 'admin') {
            mensagens.sucesso('Comentário publicado com sucesso!');
            this.carregarComentariosLivro(livroId);
        } else {
            mensagens.info('Comentário enviado para aprovação. Obrigado pela contribuição!');
            sistemaLivros.fecharModal('modalDetalhesLivro');
        }
    }

    atualizarAvaliacaoLivro(livroId) {
        const comentariosLivro = this.comentarios.filter(c => 
            c.livroId === livroId && c.aprovado
        );

        if (comentariosLivro.length === 0) return;

        const somaAvaliacoes = comentariosLivro.reduce((soma, c) => soma + c.avaliacao, 0);
        const media = somaAvaliacoes / comentariosLivro.length;

        // Atualizar livro
        const livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        const livroIndex = livros.findIndex(l => l.id === livroId);
        
        if (livroIndex !== -1) {
            livros[livroIndex].avaliacao = parseFloat(media.toFixed(1));
            livros[livroIndex].totalAvaliacoes = comentariosLivro.length;
            ArmazenamentoLocal.salvar('biblioteca_livros', livros);
            
            // Atualizar sistema de livros
            sistemaLivros.livros = livros;
        }
    }

    selecionarAvaliacao(rating) {
        document.getElementById('avaliacao-livro').value = rating;
        
        const estrelas = document.querySelectorAll('.estrelas-avaliacao .fas.fa-star');
        estrelas.forEach((estrela, index) => {
            if (index < rating) {
                estrela.classList.add('ativa');
            } else {
                estrela.classList.remove('ativa');
            }
        });
    }

    resetarAvaliacao() {
        document.getElementById('avaliacao-livro').value = 5;
        const estrelas = document.querySelectorAll('.estrelas-avaliacao .fas.fa-star');
        estrelas.forEach((estrela, index) => {
            if (index < 5) {
                estrela.classList.add('ativa');
            }
        });
    }

    // Métodos para administração
    getComentariosPendentes() {
        return this.comentarios.filter(c => !c.aprovado);
    }

    aprovarComentario(comentarioId) {
        const comentario = this.comentarios.find(c => c.id === comentarioId);
        if (comentario) {
            comentario.aprovado = true;
            ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);
            this.atualizarAvaliacaoLivro(comentario.livroId);
            return true;
        }
        return false;
    }

    rejeitarComentario(comentarioId) {
        const index = this.comentarios.findIndex(c => c.id === comentarioId);
        if (index !== -1) {
            this.comentarios.splice(index, 1);
            ArmazenamentoLocal.salvar('biblioteca_comentarios', this.comentarios);
            return true;
        }
        return false;
    }
}

// Inicializar sistema de comentários
const sistemaComentarios = new SistemaComentarios();