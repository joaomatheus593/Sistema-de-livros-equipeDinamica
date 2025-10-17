class SistemaLivros {
    constructor() {
        this.livros = this.carregarLivros();
        this.livrosFiltrados = [];
        this.filtrosAtivos = {};
        this.paginaAtual = 1;
        this.livrosPorPagina = 12;
        this.tamanhoExibicao = 'medio';
        this.inicializarEventos();
    }

    carregarLivros() {
        let livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        
        if (!livros || livros.length === 0) {
            // Livros de exemplo para demonstração
            livros = [
                {
                    id: GeradorID.gerar(),
                    titulo: 'Dom Casmurro',
                    autor: 'Machado de Assis',
                    genero: 'romance',
                    ano: 1899,
                    editora: 'Editora Garnier',
                    paginas: 256,
                    descricao: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e Capitu.',
                    imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                    estoque: 5,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 0,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.8,
                    totalAvaliacoes: 124
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Cortiço',
                    autor: 'Aluísio Azevedo',
                    genero: 'romance',
                    ano: 1890,
                    editora: 'Editora Garnier',
                    paginas: 312,
                    descricao: 'Romance naturalista que retrata a vida em um cortiço carioca do século XIX.',
                    imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                    estoque: 3,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 2.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.5,
                    totalAvaliacoes: 89
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Senhor dos Anéis',
                    autor: 'J.R.R. Tolkien',
                    genero: 'fantasia',
                    ano: 1954,
                    editora: 'Allen & Unwin',
                    paginas: 1178,
                    descricao: 'Épica jornada de Frodo Bolseiro para destruir o Um Anel na Montanha da Perdição.',
                    imagem: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
                    estoque: 8,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 5.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 21,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.9,
                    totalAvaliacoes: 256
                },
                {
                    id: GeradorID.gerar(),
                    titulo: '1984',
                    autor: 'George Orwell',
                    genero: 'ficcao',
                    ano: 1949,
                    editora: 'Secker & Warburg',
                    paginas: 328,
                    descricao: 'Distopia clássica sobre vigilância governamental e controle social.',
                    imagem: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
                    estoque: 0,
                    disponivel: false,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 3.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 198
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Uma Breve História do Tempo',
                    autor: 'Stephen Hawking',
                    genero: 'ciencia',
                    ano: 1988,
                    editora: 'Bantam Books',
                    paginas: 256,
                    descricao: 'Explora conceitos complexos da cosmologia de forma acessível.',
                    imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.6,
                    totalAvaliacoes: 134
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Pequeno Príncipe',
                    autor: 'Antoine de Saint-Exupéry',
                    genero: 'aventura',
                    ano: 1943,
                    editora: 'Reynal & Hitchcock',
                    paginas: 96,
                    descricao: 'Encantadora fábula sobre amizade, amor e a essência da vida.',
                    imagem: 'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400',
                    estoque: 6,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 0,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.9,
                    totalAvaliacoes: 287
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Harry Potter e a Pedra Filosofal',
                    autor: 'J.K. Rowling',
                    genero: 'fantasia',
                    ano: 1997,
                    editora: 'Bloomsbury',
                    paginas: 223,
                    descricao: 'O início da jornada do jovem bruxo Harry Potter em Hogwarts.',
                    imagem: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
                    estoque: 7,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.8,
                    totalAvaliacoes: 312
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Nome do Vento',
                    autor: 'Patrick Rothfuss',
                    genero: 'fantasia',
                    ano: 2007,
                    editora: 'DAW Books',
                    paginas: 662,
                    descricao: 'A história de Kvothe, um homem de lendária fama contando sua própria história.',
                    imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                    estoque: 2,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 5.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 21,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 156
                }
            ];
            ArmazenamentoLocal.salvar('biblioteca_livros', livros);
        }
        
        return livros;
    }

    inicializarEventos() {
        // Pesquisa em tempo real
        const campoPesquisa = document.getElementById('campoPesquisa');
        if (campoPesquisa) {
            campoPesquisa.addEventListener('input', (e) => {
                clearTimeout(this.pesquisaTimeout);
                this.pesquisaTimeout = setTimeout(() => {
                    this.aplicarFiltros();
                }, 500);
            });

            campoPesquisa.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.realizarPesquisa();
                }
            });
        }

        // Carregar livros quando o sistema estiver pronto
        if (document.getElementById('sistemaPrincipal').style.display !== 'none') {
            this.carregarLivrosNaInterface();
        }
    }

    carregarLivrosNaInterface() {
        this.carregarDestaques();
        this.aplicarFiltros();
    }

    carregarDestaques() {
        const container = document.getElementById('carrosselDestaques');
        if (!container) return;

        // Selecionar livros em destaque (os mais bem avaliados)
        const destaques = [...this.livros]
            .sort((a, b) => b.avaliacao - a.avaliacao)
            .slice(0, 4);

        container.innerHTML = destaques.map(livro => `
            <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="info-livro">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 50)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="meta-livro">
                        <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                        <span class="ano-livro">${livro.ano}</span>
                    </div>
                    <div class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    aplicarFiltros() {
        const termoPesquisa = document.getElementById('campoPesquisa')?.value.toLowerCase() || '';
        const genero = document.getElementById('filtroGenero')?.value || '';
        const ano = document.getElementById('filtroAno')?.value || '';
        const disponibilidade = document.getElementById('filtroDisponibilidade')?.value || '';
        const ordenacao = document.getElementById('filtroOrdenacao')?.value || 'relevancia';

        // Aplicar filtros
        this.livrosFiltrados = this.livros.filter(livro => {
            const correspondePesquisa = 
                livro.titulo.toLowerCase().includes(termoPesquisa) ||
                livro.autor.toLowerCase().includes(termoPesquisa) ||
                livro.genero.toLowerCase().includes(termoPesquisa) ||
                livro.descricao.toLowerCase().includes(termoPesquisa);

            const correspondeGenero = !genero || livro.genero === genero;
            const correspondeAno = !ano || livro.ano.toString() === ano;
            const correspondeDisponibilidade = 
                !disponibilidade || 
                (disponibilidade === 'disponivel' && livro.disponivel) ||
                (disponibilidade === 'indisponivel' && !livro.disponivel);

            return correspondePesquisa && correspondeGenero && correspondeAno && correspondeDisponibilidade;
        });

        // Aplicar ordenação
        this.ordenarLivros(ordenacao);

        this.paginaAtual = 1;
        this.atualizarGradeLivros();
    }

    ordenarLivros(ordenacao) {
        switch (ordenacao) {
            case 'titulo':
                this.livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'titulo-desc':
                this.livrosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
                break;
            case 'ano':
                this.livrosFiltrados.sort((a, b) => b.ano - a.ano);
                break;
            case 'ano-desc':
                this.livrosFiltrados.sort((a, b) => a.ano - b.ano);
                break;
            case 'avaliacao':
                this.livrosFiltrados.sort((a, b) => b.avaliacao - a.avaliacao);
                break;
            case 'relevancia':
            default:
                // Manter ordem original para relevância
                break;
        }
    }

    atualizarGradeLivros() {
        const container = document.getElementById('gradeLivros');
        const totalElement = document.getElementById('totalLivrosEncontrados');
        
        if (!container) return;

        // Atualizar contador
        if (totalElement) {
            totalElement.textContent = this.livrosFiltrados.length;
        }

        // Calcular livros para a página atual
        const inicio = (this.paginaAtual - 1) * this.livrosPorPagina;
        const fim = inicio + this.livrosPorPagina;
        const livrosPagina = this.livrosFiltrados.slice(inicio, fim);

        // Aplicar classe de tamanho
        container.className = `grade-livros tamanho-${this.tamanhoExibicao}`;

        // Gerar HTML dos livros
        container.innerHTML = livrosPagina.map(livro => this.criarCartaoLivro(livro)).join('');

        // Atualizar paginação
        this.atualizarPaginacao();
    }

    criarCartaoLivro(livro) {
        return `
            <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="info-livro">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 50)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="meta-livro">
                        <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                        <span class="ano-livro">${livro.ano}</span>
                    </div>
                    <div class="avaliacao-livro">
                        <i class="fas fa-star" style="color: var(--dourado);"></i>
                        <span>${livro.avaliacao.toFixed(1)} (${livro.totalAvaliacoes})</span>
                    </div>
                    <div class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </div>
                    ${livro.disponivel ? `
                        <button class="botao botao-primario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.solicitarEmprestimo('${livro.id}')">
                            <i class="fas fa-hand-holding"></i>
                            Emprestar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    atualizarPaginacao() {
        const container = document.getElementById('paginacao');
        if (!container) return;

        const totalPaginas = Math.ceil(this.livrosFiltrados.length / this.livrosPorPagina);
        
        if (totalPaginas <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginacaoHTML = '';

        // Botão anterior
        if (this.paginaAtual > 1) {
            paginacaoHTML += `<button class="pagina" onclick="sistemaLivros.irParaPagina(${this.paginaAtual - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        // Páginas
        for (let i = 1; i <= totalPaginas; i++) {
            if (i === 1 || i === totalPaginas || (i >= this.paginaAtual - 1 && i <= this.paginaAtual + 1)) {
                paginacaoHTML += `<button class="pagina ${i === this.paginaAtual ? 'ativa' : ''}" onclick="sistemaLivros.irParaPagina(${i})">${i}</button>`;
            } else if (i === this.paginaAtual - 2 || i === this.paginaAtual + 2) {
                paginacaoHTML += `<span class="pagina">...</span>`;
            }
        }

        // Botão próximo
        if (this.paginaAtual < totalPaginas) {
            paginacaoHTML += `<button class="pagina" onclick="sistemaLivros.irParaPagina(${this.paginaAtual + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        container.innerHTML = paginacaoHTML;
    }

    irParaPagina(pagina) {
        this.paginaAtual = pagina;
        this.atualizarGradeLivros();
        window.scrollTo({ top: document.getElementById('catalogo-section').offsetTop - 100, behavior: 'smooth' });
    }

    obterNomeGenero(codigoGenero) {
        const generos = {
            'ficcao': 'Ficção',
            'romance': 'Romance',
            'fantasia': 'Fantasia',
            'aventura': 'Aventura',
            'misterio': 'Mistério',
            'biografia': 'Biografia',
            'historia': 'História',
            'ciencia': 'Ciência',
            'tecnologia': 'Tecnologia',
            'autoajuda': 'Autoajuda'
        };
        return generos[codigoGenero] || codigoGenero;
    }

    abrirDetalhesLivro(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) return;

        const modal = document.getElementById('modalDetalhesLivro');
        const conteudo = document.getElementById('conteudoDetalhesLivro');

        if (!modal || !conteudo) return;

        conteudo.innerHTML = `
            <div class="detalhes-livro">
                <div class="detalhes-cabecalho">
                    <img src="${livro.imagem}" alt="${livro.titulo}" class="detalhes-imagem">
                    <div class="detalhes-info">
                        <h2>${livro.titulo}</h2>
                        <p class="detalhes-autor">por ${livro.autor}</p>
                        <div class="detalhes-meta">
                            <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                            <span class="ano-livro">${livro.ano}</span>
                            <span class="paginas-livro">${livro.paginas} páginas</span>
                        </div>
                        <div class="detalhes-avaliacao">
                            <div class="estrelas">
                                ${this.gerarEstrelas(livro.avaliacao)}
                            </div>
                            <span>${livro.avaliacao.toFixed(1)} (${livro.totalAvaliacoes} avaliações)</span>
                        </div>
                        <div class="detalhes-status ${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                            <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${livro.disponivel ? 'Disponível para empréstimo' : 'Indisponível no momento'}
                        </div>
                        ${livro.disponivel ? `
                            <div class="detalhes-acoes">
                                <button class="botao botao-primario" onclick="sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                    <i class="fas fa-hand-holding"></i>
                                    Solicitar Empréstimo
                                </button>
                                <button class="botao botao-secundario" onclick="sistemaLivros.adicionarAosFavoritos('${livro.id}')">
                                    <i class="fas fa-heart"></i>
                                    Favoritar
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detalhes-corpo">
                    <div class="detalhes-secao">
                        <h3>Sinopse</h3>
                        <p>${livro.descricao}</p>
                    </div>
                    
                    <div class="detalhes-secao">
                        <h3>Informações do Livro</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Editora:</strong>
                                <span>${livro.editora}</span>
                            </div>
                            <div class="info-item">
                                <strong>ISBN:</strong>
                                <span>${livro.isbn}</span>
                            </div>
                            <div class="info-item">
                                <strong>Páginas:</strong>
                                <span>${livro.paginas}</span>
                            </div>
                            <div class="info-item">
                                <strong>Ano:</strong>
                                <span>${livro.ano}</span>
                            </div>
                            <div class="info-item">
                                <strong>Gênero:</strong>
                                <span>${this.obterNomeGenero(livro.genero)}</span>
                            </div>
                            <div class="info-item">
                                <strong>Estoque:</strong>
                                <span>${livro.estoque} unidades</span>
                            </div>
                        </div>
                    </div>

                    <div class="detalhes-secao">
                        <h3>Condições de Empréstimo</h3>
                        <div class="condicoes-grid">
                            <div class="condicao-item">
                                <i class="fas fa-calendar-alt"></i>
                                <div>
                                    <strong>Prazo:</strong>
                                    <span>${livro.prazoEmprestimo} dias</span>
                                </div>
                            </div>
                            <div class="condicao-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <div>
                                    <strong>Valor:</strong>
                                    <span>${livro.valorEmprestimo > 0 ? Formatadores.formatarMoeda(livro.valorEmprestimo) : 'Gratuito'}</span>
                                </div>
                            </div>
                            <div class="condicao-item">
                                <i class="fas fa-percentage"></i>
                                <div>
                                    <strong>Juros diário:</strong>
                                    <span>${livro.taxaJuros}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detalhes-secao" id="secao-comentarios">
                        <h3>Avaliações e Comentários</h3>
                        <div id="lista-comentarios">
                            <!-- Comentários serão carregados aqui -->
                        </div>
                        ${sistemaAuth.getUsuarioLogado() && sistemaAuth.getUsuarioLogado().tipo !== 'convidado' ? `
                            <div class="formulario-comentario">
                                <h4>Deixe sua avaliação</h4>
                                <form onsubmit="sistemaComentarios.adicionarComentario(event, '${livro.id}')">
                                    <div class="campo-avaliacao">
                                        <label>Sua avaliação:</label>
                                        <div class="estrelas-avaliacao">
                                            ${[1,2,3,4,5].map(star => `
                                                <i class="fas fa-star" data-rating="${star}" onclick="sistemaComentarios.selecionarAvaliacao(${star})"></i>
                                            `).join('')}
                                        </div>
                                        <input type="hidden" id="avaliacao-livro" value="5">
                                    </div>
                                    <div class="campo-formulario">
                                        <label for="comentario-livro">Seu comentário:</label>
                                        <textarea id="comentario-livro" rows="4" placeholder="Compartilhe sua opinião sobre este livro..." required></textarea>
                                    </div>
                                    <button type="submit" class="botao botao-primario">
                                        <i class="fas fa-paper-plane"></i>
                                        Enviar Avaliação
                                    </button>
                                </form>
                            </div>
                        ` : `
                            <p class="aviso-comentario">
                                <a href="#" onclick="fecharModal('modalDetalhesLivro'); mostrarLogin()">Faça login</a> para deixar uma avaliação.
                            </p>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Carregar comentários
        if (typeof sistemaComentarios !== 'undefined') {
            sistemaComentarios.carregarComentariosLivro(livroId);
        }

        this.abrirModal('modalDetalhesLivro');
    }

    gerarEstrelas(avaliacao) {
        const estrelasCheias = Math.floor(avaliacao);
        const meiaEstrela = avaliacao % 1 >= 0.5;
        const estrelasVazias = 5 - estrelasCheias - (meiaEstrela ? 1 : 0);

        let html = '';
        
        // Estrelas cheias
        for (let i = 0; i < estrelasCheias; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        
        // Meia estrela
        if (meiaEstrela) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Estrelas vazias
        for (let i = 0; i < estrelasVazias; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        return html;
    }

    solicitarEmprestimo(livroId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        const livro = this.livros.find(l => l.id === livroId);

        if (!usuario) {
            mensagens.erro('Você precisa estar logado para solicitar empréstimos.');
            this.fecharModal('modalDetalhesLivro');
            this.mostrarLogin();
            return;
        }

        if (usuario.tipo === 'convidado') {
            mensagens.erro('Convidados não podem solicitar empréstimos. Faça login ou cadastre-se.');
            return;
        }

        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        if (!livro.disponivel) {
            mensagens.erro('Este livro não está disponível para empréstimo no momento.');
            return;
        }

        if (livro.estoque <= 0) {
            mensagens.erro('Não há exemplares disponíveis deste livro.');
            return;
        }

        // Verificar se o usuário já tem este livro emprestado
        const emprestimos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoAtivo = emprestimos.find(e => 
            e.livroId === livroId && 
            e.usuarioId === usuario.id && 
            e.status === 'ativo'
        );

        if (emprestimoAtivo) {
            mensagens.erro('Você já tem um empréstimo ativo deste livro.');
            return;
        }

        // Criar empréstimo
        const novoEmprestimo = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            dataEmprestimo: new Date().toISOString(),
            dataDevolucaoPrevista: UtilitariosData.adicionarDias(new Date(), livro.prazoEmprestimo).toISOString(),
            dataDevolucao: null,
            status: 'ativo',
            valor: livro.valorEmprestimo,
            taxaJuros: livro.taxaJuros,
            multa: 0,
            livroTitulo: livro.titulo,
            livroAutor: livro.autor,
            livroImagem: livro.imagem
        };

        emprestimos.push(novoEmprestimo);
        ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);

        // Atualizar estoque do livro
        livro.estoque -= 1;
        if (livro.estoque <= 0) {
            livro.disponivel = false;
        }
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);

        mensagens.sucesso(`Empréstimo solicitado com sucesso! Devolução prevista para ${UtilitariosData.formatarData(novoEmprestimo.dataDevolucaoPrevista)}.`);
        
        this.fecharModal('modalDetalhesLivro');
        this.aplicarFiltros();
        this.carregarDestaques();
    }

    adicionarAosFavoritos(livroId) {
        const usuario = sistemaAuth.getUsuarioLogado();
        
        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Faça login para adicionar livros aos favoritos.');
            return;
        }

        let favoritos = ArmazenamentoLocal.carregar('biblioteca_favoritos') || [];
        
        // Verificar se já está nos favoritos
        if (favoritos.find(f => f.livroId === livroId && f.usuarioId === usuario.id)) {
            mensagens.info('Este livro já está nos seus favoritos.');
            return;
        }

        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) return;

        favoritos.push({
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            dataAdicao: new Date().toISOString(),
            livroTitulo: livro.titulo,
            livroAutor: livro.autor,
            livroImagem: livro.imagem
        });

        ArmazenamentoLocal.salvar('biblioteca_favoritos', favoritos);
        mensagens.sucesso('Livro adicionado aos favoritos!');
    }

    // Métodos auxiliares para modais
    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Métodos para eventos do HTML
    realizarPesquisa() {
        this.aplicarFiltros();
    }

    alterarTamanhoExibicao(tamanho) {
        this.tamanhoExibicao = tamanho;
        
        // Atualizar botões ativos
        document.querySelectorAll('.botao-tamanho').forEach(botao => {
            botao.classList.remove('ativo');
        });
        document.querySelector(`.botao-tamanho[data-tamanho="${tamanho}"]`).classList.add('ativo');
        
        this.atualizarGradeLivros();
    }

    filtrarPorGenero(genero) {
        document.getElementById('filtroGenero').value = genero;
        this.aplicarFiltros();
    }

    filtrarPorDisponibilidade(disponibilidade) {
        document.getElementById('filtroDisponibilidade').value = disponibilidade;
        this.aplicarFiltros();
    }

    // Getters para estatísticas
    getTotalLivros() {
        return this.livros.length;
    }

    getLivrosDisponiveis() {
        return this.livros.filter(livro => livro.disponivel).length;
    }

    getLivrosPorGenero() {
        const generos = {};
        this.livros.forEach(livro => {
            generos[livro.genero] = (generos[livro.genero] || 0) + 1;
        });
        return generos;
    }
}

// Inicializar sistema de livros
const sistemaLivros = new SistemaLivros();

// Funções globais para eventos do HTML
function realizarPesquisa() {
    sistemaLivros.realizarPesquisa();
}

function aplicarFiltros() {
    sistemaLivros.aplicarFiltros();
}

function alterarTamanhoExibicao(tamanho) {
    sistemaLivros.alterarTamanhoExibicao(tamanho);
}

function filtrarPorGenero(genero) {
    sistemaLivros.filtrarPorGenero(genero);
}

function filtrarPorDisponibilidade(disponibilidade) {
    sistemaLivros.filtrarPorDisponibilidade(disponibilidade);
}