class SistemaLivros {
    constructor() {
        this.livros = this.carregarLivros();
        this.livrosFiltrados = [];
        this.filtrosAtivos = {};
        this.paginaAtual = 1;
        this.livrosPorPagina = 12;
        this.tamanhoExibicao = 'medio';
        this.inicializarEventos();
        this.carregarMaisLivrosExemplo();
    }

    carregarLivros() {
        let livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        
        if (!livros || livros.length === 0) {
            // Livros de exemplo para demonstração
            livros = this.criarLivrosExemplo();
            ArmazenamentoLocal.salvar('biblioteca_livros', livros);
        }
        
        return livros;
    }

    criarLivrosExemplo() {
        return [
            {
                id: GeradorID.gerar(),
                titulo: 'Dom Casmurro',
                autor: 'Machado de Assis',
                genero: 'romance',
                ano: 1899,
                editora: 'Editora Garnier',
                paginas: 256,
                descricao: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e Capitu com a maestria característica de Machado de Assis.',
                sinopse: 'A obra narra a história de Bentinho (Dom Casmurro), que desconfia que sua esposa Capitu o traiu com seu melhor amigo, Escobar. A narrativa explora temas como ciúme, dúvida e a subjetividade da memória.',
                imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                estoque: 5,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.8,
                totalAvaliacoes: 124,
                classificacaoEtaria: 'L',
                destaque: true,
                tags: ['clássico', 'literatura brasileira', 'romance', 'machado de assis'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira A-12'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'O Cortiço',
                autor: 'Aluísio Azevedo',
                genero: 'romance',
                ano: 1890,
                editora: 'Editora Garnier',
                paginas: 312,
                descricao: 'Romance naturalista que retrata a vida em um cortiço carioca do século XIX, mostrando as condições de vida da classe trabalhadora.',
                sinopse: 'A obra descreve a vida dos moradores de um cortiço no Rio de Janeiro, explorando temas como determinismo social, luxúria e a luta pela ascensão social na sociedade brasileira do século XIX.',
                imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                estoque: 3,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 2.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.5,
                totalAvaliacoes: 89,
                classificacaoEtaria: '14',
                destaque: false,
                tags: ['naturalismo', 'literatura brasileira', 'romance social'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira B-05'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
                autor: 'J.R.R. Tolkien',
                genero: 'fantasia',
                ano: 1954,
                editora: 'Allen & Unwin',
                paginas: 423,
                descricao: 'Épica jornada de Frodo Bolseiro para destruir o Um Anel na Montanha da Perdição, em uma terra fantástica repleta de magia e perigos.',
                sinopse: 'Na tranquila região do Condado, o hobbit Frodo Bolseiro herda um anel aparentemente inocente, mas que na verdade é o Um Anel, instrumento do poder do Senhor do Escuro Sauron. Frodo deve partir em uma jornada perigosa para destruir o anel nas chamas da Montanha da Perdição.',
                imagem: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
                estoque: 8,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 5.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 21,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.9,
                totalAvaliacoes: 256,
                classificacaoEtaria: '12',
                destaque: true,
                tags: ['fantasia épica', 'aventura', 'medieval', 'magia'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira F-01'
            },
            {
                id: GeradorID.gerar(),
                titulo: '1984',
                autor: 'George Orwell',
                genero: 'ficcao',
                ano: 1949,
                editora: 'Secker & Warburg',
                paginas: 328,
                descricao: 'Distopia clássica sobre vigilância governamental, controle social e a luta pela liberdade individual em um regime totalitário.',
                sinopse: 'Winston Smith vive em um regime totalitário onde o Grande Irmão observa tudo e todos. Ao se rebelar contra o sistema, ele descobre os horrores do controle absoluto e a manipulação da verdade.',
                imagem: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
                estoque: 0,
                disponivel: false,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 3.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.7,
                totalAvaliacoes: 198,
                classificacaoEtaria: '16',
                destaque: true,
                tags: ['distopia', 'ficção científica', 'política', 'controle social'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira C-08'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'Uma Breve História do Tempo',
                autor: 'Stephen Hawking',
                genero: 'ciencia',
                ano: 1988,
                editora: 'Bantam Books',
                paginas: 256,
                descricao: 'Explora conceitos complexos da cosmologia de forma acessível, desde o Big Bang até buracos negros e a natureza do tempo.',
                sinopse: 'Stephen Hawking conduz o leitor através dos grandes mistérios do cosmos, explicando conceitos como a teoria da relatividade, mecânica quântica, buracos negros e a flecha do tempo de maneira compreensível para leigos.',
                imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                estoque: 4,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 4.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.6,
                totalAvaliacoes: 134,
                classificacaoEtaria: 'L',
                destaque: false,
                tags: ['cosmologia', 'física', 'ciência', 'astronomia'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira D-15'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'O Pequeno Príncipe',
                autor: 'Antoine de Saint-Exupéry',
                genero: 'aventura',
                ano: 1943,
                editora: 'Reynal & Hitchcock',
                paginas: 96,
                descricao: 'Encantadora fábula sobre amizade, amor e a essência da vida, vista através dos olhos de um pequeno príncipe de um asteroide distante.',
                sinopse: 'Um piloto perdido no deserto do Saara encontra um pequeno príncipe que visita a Terra vindo de um asteroide distante. Através de suas conversas, o livro explora temas profundos sobre a vida, amizade e o que realmente importa.',
                imagem: 'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400',
                estoque: 6,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.9,
                totalAvaliacoes: 287,
                classificacaoEtaria: 'L',
                destaque: true,
                tags: ['fábula', 'filosofia', 'infantojuvenil', 'amizade'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira E-03'
            }
        ];
    }

    carregarMaisLivrosExemplo() {
        const livrosAdicionais = [
            {
                id: GeradorID.gerar(),
                titulo: 'Harry Potter e a Pedra Filosofal',
                autor: 'J.K. Rowling',
                genero: 'fantasia',
                ano: 1997,
                editora: 'Bloomsbury',
                paginas: 223,
                descricao: 'O início da jornada do jovem bruxo Harry Potter em Hogwarts, onde descobre seu destino e enfrenta forças das trevas.',
                sinopse: 'Harry Potter descobre aos 11 anos que é um bruxo e foi aceito na Escola de Magia e Bruxaria de Hogwarts. Lá, ele faz amigos, aprende magia e descobre segredos sobre seu passado enquanto enfrenta ameaças que buscam a poderosa Pedra Filosofal.',
                imagem: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
                estoque: 7,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 4.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.8,
                totalAvaliacoes: 312,
                classificacaoEtaria: '10',
                destaque: true,
                tags: ['magia', 'aventura', 'amizade', 'escola de magia'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira F-07'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'O Nome do Vento',
                autor: 'Patrick Rothfuss',
                genero: 'fantasia',
                ano: 2007,
                editora: 'DAW Books',
                paginas: 662,
                descricao: 'A história de Kvothe, um homem de lendária fama contando sua própria história desde a infância até se tornar o herói que todos conhecem.',
                sinopse: 'Kvothe, o personagem mais famoso de seu mundo, conta sua própria história pela primeira vez. Da infância numa trupe de artistas itinerantes aos anos na Universidade, onde busca conhecimento sobre os misteriosos Chandrian que destruíram sua família.',
                imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                estoque: 2,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 5.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 21,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.7,
                totalAvaliacoes: 156,
                classificacaoEtaria: '16',
                destaque: false,
                tags: ['fantasia épica', 'magia', 'música', 'aventura'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira F-12'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'Orgulho e Preconceito',
                autor: 'Jane Austen',
                genero: 'romance',
                ano: 1813,
                editora: 'T. Egerton',
                paginas: 432,
                descricao: 'Clássico da literatura inglesa que narra o relacionamento entre Elizabeth Bennet e Mr. Darcy em uma crítica à sociedade aristocrática.',
                sinopse: 'Elizabeth Bennet e suas quatro irmãs foram criadas com um único propósito: encontrar um bom casamento. Quando o rico e arrogante Mr. Darcy chega à região, o orgulho de Elizabeth e os preconceitos de Darcy criam obstáculos para um possível romance.',
                imagem: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
                estoque: 4,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 3.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.8,
                totalAvaliacoes: 215,
                classificacaoEtaria: 'L',
                destaque: true,
                tags: ['romance clássico', 'sociedade', 'Inglaterra', 'século XIX'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira A-08'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'Duna',
                autor: 'Frank Herbert',
                genero: 'ficcao',
                ano: 1965,
                editora: 'Chilton Books',
                paginas: 412,
                descricao: 'Épica de ficção científica ambientada no planeta deserto Arrakis, a única fonte da especiaria melange, a substância mais valiosa do universo.',
                sinopse: 'Paul Atreides e sua família se mudam para o planeta deserto Arrakis, o único lugar onde a especiaria melange é encontrada. Quando sua família é traída, Paul deve liderar os nativos Fremen em uma revolução que mudará o universo para sempre.',
                imagem: 'https://images.unsplash.com/photo-1535378620166-273708d44e04?w=400',
                estoque: 3,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 4.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 21,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.6,
                totalAvaliacoes: 189,
                classificacaoEtaria: '14',
                destaque: false,
                tags: ['ficção científica', 'espacial', 'ecologia', 'política'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira C-15'
            },
            {
                id: GeradorID.gerar(),
                titulo: 'O Código Da Vinci',
                autor: 'Dan Brown',
                genero: 'misterio',
                ano: 2003,
                editora: 'Doubleday',
                paginas: 454,
                descricao: 'Thriller que mistura arte, religião e história, seguindo Robert Langdon em uma caça ao tesouro pelos locais mais emblemáticos de Paris.',
                sinopse: 'Robert Langdon, especialista em simbologia, é chamado para investigar um assassinato no Louvre. Junto com a criptógrafa Sophie Neveu, ele descobre pistas deixadas pelo falecido curador que levam a um segredo milenar protegido por uma sociedade secreta.',
                imagem: 'https://images.unsplash.com/photo-1554757380-2fb69b9ca4c8?w=400',
                estoque: 5,
                disponivel: true,
                isbn: GeradorID.gerarISBN(),
                valorEmprestimo: 4.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.4,
                totalAvaliacoes: 298,
                classificacaoEtaria: '16',
                destaque: true,
                tags: ['thriller', 'mistério', 'arte', 'religião'],
                fisicoDisponivel: true,
                localizacaoFisica: 'Prateleira B-12'
            }
        ];

        // Adicionar apenas se não existirem
        livrosAdicionais.forEach(novoLivro => {
            if (!this.livros.find(l => l.titulo === novoLivro.titulo)) {
                this.livros.push(novoLivro);
            }
        });

        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);
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

        // Selecionar livros em destaque
        const destaques = this.livros
            .filter(livro => livro.destaque)
            .slice(0, 4);

        if (destaques.length === 0) {
            // Se não houver destaques, usar os mais bem avaliados
            destaques.push(...this.livros
                .sort((a, b) => b.avaliacao - a.avaliacao)
                .slice(0, 4));
        }

        container.innerHTML = destaques.map(livro => `
            <div class="cartao-destaque" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" 
                     onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="overlay-destaque">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 40)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="destaque-info">
                        <span class="avaliacao-destaque">
                            <i class="fas fa-star"></i> ${livro.avaliacao.toFixed(1)}
                        </span>
                        <span class="classificacao-destaque ${livro.classificacaoEtaria === 'L' ? 'livre' : 'etaria'}">
                            ${livro.classificacaoEtaria === 'L' ? 'LIVRE' : livro.classificacaoEtaria + ' anos'}
                        </span>
                    </div>
                </div>
                ${livro.fisicoDisponivel ? `
                    <div class="badge-fisico">
                        <i class="fas fa-book"></i>
                        Disponível Físico
                    </div>
                ` : ''}
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
                livro.descricao.toLowerCase().includes(termoPesquisa) ||
                (livro.tags && livro.tags.some(tag => tag.toLowerCase().includes(termoPesquisa)));

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
                // Para relevância, priorizar livros com destaque e melhor avaliados
                this.livrosFiltrados.sort((a, b) => {
                    if (a.destaque && !b.destaque) return -1;
                    if (!a.destaque && b.destaque) return 1;
                    return b.avaliacao - a.avaliacao;
                });
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

        if (livrosPagina.length === 0) {
            container.innerHTML = `
                <div class="sem-resultados">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum livro encontrado</h3>
                    <p>Tente ajustar os filtros de pesquisa ou verificar a ortografia.</p>
                    <button class="botao botao-primario" onclick="sistemaLivros.limparFiltros()">
                        <i class="fas fa-eraser"></i>
                        Limpar Filtros
                    </button>
                </div>
            `;
        } else {
            // Gerar HTML dos livros
            container.innerHTML = livrosPagina.map(livro => this.criarCartaoLivro(livro)).join('');
        }

        // Atualizar paginação
        this.atualizarPaginacao();
    }

    criarCartaoLivro(livro) {
        const isConvidado = sistemaAuth.isConvidado();
        
        return `
            <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                ${livro.destaque ? `
                    <div class="badge-destaque">
                        <i class="fas fa-star"></i>
                        Destaque
                    </div>
                ` : ''}
                ${livro.fisicoDisponivel ? `
                    <div class="badge-fisico">
                        <i class="fas fa-book"></i>
                        Físico
                    </div>
                ` : ''}
                <img src="${livro.imagem}" alt="${livro.titulo}" 
                     onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
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
                    ${livro.disponivel && !isConvidado ? `
                        <div class="acoes-livro">
                            <button class="botao botao-primario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                <i class="fas fa-hand-holding"></i>
                                Emprestar
                            </button>
                            ${livro.fisicoDisponivel ? `
                                <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); sistemaParceria.solicitarLivroFisico('${livro.id}')">
                                    <i class="fas fa-shipping-fast"></i>
                                    Pedir Físico
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                    ${isConvidado ? `
                        <p class="aviso-convidado">
                            <i class="fas fa-info-circle"></i>
                            Faça login para emprestar
                        </p>
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
        window.scrollTo({ top: document.querySelector('.catalogo-section').offsetTop - 100, behavior: 'smooth' });
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
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        const modal = document.getElementById('modalDetalhesLivro');
        const conteudo = document.getElementById('conteudoDetalhesLivro');

        if (!modal || !conteudo) return;

        const usuario = sistemaAuth.getUsuarioLogado();
        const isConvidado = sistemaAuth.isConvidado();

        conteudo.innerHTML = `
            <div class="detalhes-livro">
                <div class="detalhes-livro-header">
                    <div class="detalhes-livro-capa">
                        <img src="${livro.imagem}" alt="${livro.titulo}" class="detalhes-imagem"
                             onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                        ${livro.fisicoDisponivel ? `
                            <div class="badge-fisico-grande">
                                <i class="fas fa-book"></i>
                                Disponível na Biblioteca Cesta
                            </div>
                        ` : ''}
                    </div>
                    <div class="detalhes-livro-info">
                        <h1 class="detalhes-livro-titulo">${livro.titulo}</h1>
                        <p class="detalhes-livro-autor">por ${livro.autor}</p>
                        
                        <div class="detalhes-livro-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${livro.ano}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-book-open"></i>
                                <span>${livro.paginas} páginas</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${this.obterNomeGenero(livro.genero)}</span>
                            </div>
                            <div class="classificacao-etaria ${livro.classificacaoEtaria === 'L' ? 'livre' : 'etaria'}">
                                ${livro.classificacaoEtaria === 'L' ? 'LIVRE' : livro.classificacaoEtaria + ' anos'}
                            </div>
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

                        ${!isConvidado ? `
                            <div class="detalhes-acoes">
                                ${livro.disponivel ? `
                                    <button class="botao botao-primario" onclick="sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                        <i class="fas fa-hand-holding"></i>
                                        Solicitar Empréstimo
                                    </button>
                                ` : ''}
                                ${livro.fisicoDisponivel ? `
                                    <button class="botao botao-secundario" onclick="sistemaParceria.solicitarLivroFisico('${livro.id}')">
                                        <i class="fas fa-shipping-fast"></i>
                                        Pedir Livro Físico
                                    </button>
                                ` : ''}
                                <button class="botao botao-convidado" onclick="sistemaLivros.adicionarAosFavoritos('${livro.id}')">
                                    <i class="fas fa-heart"></i>
                                    Favoritar
                                </button>
                            </div>
                        ` : `
                            <div class="aviso-convidado-grande">
                                <i class="fas fa-info-circle"></i>
                                <p>Faça login para acessar todas as funcionalidades</p>
                                <button class="botao botao-primario" onclick="fecharModal('modalDetalhesLivro'); mostrarLogin()">
                                    Fazer Login
                                </button>
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="detalhes-livro-corpo">
                    <div class="detalhes-secao">
                        <h3><i class="fas fa-book-open"></i> Sinopse</h3>
                        <p>${livro.sinopse || livro.descricao}</p>
                    </div>
                    
                    <div class="detalhes-secao">
                        <h3><i class="fas fa-info-circle"></i> Informações do Livro</h3>
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
                                <strong>Ano de Publicação:</strong>
                                <span>${livro.ano}</span>
                            </div>
                            <div class="info-item">
                                <strong>Gênero:</strong>
                                <span>${this.obterNomeGenero(livro.genero)}</span>
                            </div>
                            <div class="info-item">
                                <strong>Exemplares:</strong>
                                <span>${livro.estoque} unidades</span>
                            </div>
                            ${livro.fisicoDisponivel ? `
                                <div class="info-item">
                                    <strong>Localização Física:</strong>
                                    <span>${livro.localizacaoFisica}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    ${livro.disponivel ? `
                        <div class="detalhes-secao">
                            <h3><i class="fas fa-file-contract"></i> Condições de Empréstimo</h3>
                            <div class="condicoes-grid">
                                <div class="condicao-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    <div>
                                        <strong>Prazo de Empréstimo:</strong>
                                        <span>${livro.prazoEmprestimo} dias</span>
                                    </div>
                                </div>
                                <div class="condicao-item">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <div>
                                        <strong>Valor do Empréstimo:</strong>
                                        <span>${livro.valorEmprestimo > 0 ? Formatadores.formatarMoeda(livro.valorEmprestimo) : 'Gratuito'}</span>
                                    </div>
                                </div>
                                <div class="condicao-item">
                                    <i class="fas fa-percentage"></i>
                                    <div>
                                        <strong>Taxa de Juros Diária:</strong>
                                        <span>${livro.taxaJuros}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="detalhes-secao" id="secao-comentarios">
                        <h3><i class="fas fa-comments"></i> Avaliações e Comentários</h3>
                        <div id="lista-comentarios">
                            <!-- Comentários serão carregados aqui -->
                        </div>
                        ${usuario && !isConvidado ? `
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
                            <div class="aviso-comentario">
                                <i class="fas fa-info-circle"></i>
                                <p>${isConvidado ? 'Faça login' : 'Você precisa estar logado'} para deixar uma avaliação.</p>
                                ${isConvidado ? `
                                    <button class="botao botao-primario" onclick="fecharModal('modalDetalhesLivro'); mostrarLogin()">
                                        Fazer Login
                                    </button>
                                ` : ''}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Carregar comentários
        if (typeof sistemaComentarios !== 'undefined') {
            sistemaComentarios.carregarComentariosLivro(livroId);
        }

        // Inicializar estrelas de avaliação
        setTimeout(() => {
            sistemaComentarios.resetarAvaliacao();
        }, 100);

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

        // Verificar classificação etária se o sistema estiver ativo
        if (typeof sistemaClassificacao !== 'undefined') {
            if (!sistemaClassificacao.verificarIdadeRequerida(livro)) {
                return;
            }
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
            livroImagem: livro.imagem,
            tipo: 'digital'
        };

        emprestimos.push(novoEmprestimo);
        ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimos);

        // Atualizar estoque do livro
        livro.estoque -= 1;
        if (livro.estoque <= 0) {
            livro.disponivel = false;
        }
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);

        // Notificação de empréstimo
        sistemaNotificacoes.adicionarNotificacao(
            'Empréstimo Realizado',
            `Você emprestou "${livro.titulo}". Devolução em ${livro.prazoEmprestimo} dias.`,
            'sucesso'
        );

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
            livroImagem: livro.imagem,
            livroGenero: livro.genero
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

    limparFiltros() {
        document.getElementById('campoPesquisa').value = '';
        document.getElementById('filtroGenero').value = '';
        document.getElementById('filtroAno').value = '';
        document.getElementById('filtroDisponibilidade').value = '';
        document.getElementById('filtroOrdenacao').value = 'relevancia';
        
        this.aplicarFiltros();
        mensagens.info('Filtros limpos com sucesso.');
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

    getLivrosFisicosDisponiveis() {
        return this.livros.filter(livro => livro.fisicoDisponivel).length;
    }

    getLivrosEmDestaque() {
        return this.livros.filter(livro => livro.destaque).length;
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

// Busca Inteligente Melhorada
class BuscaInteligente {
    constructor() {
        this.sugestoesContainer = null;
        this.ultimoTermo = '';
        this.sugestaoSelecionada = null;
        this.inicializarBusca();
    }

    inicializarBusca() {
        const campoPesquisa = document.getElementById('campoPesquisa');
        if (!campoPesquisa) return;

        // Criar container de sugestões
        this.sugestoesContainer = document.createElement('div');
        this.sugestoesContainer.className = 'sugestoes-busca';
        campoPesquisa.parentNode.appendChild(this.sugestoesContainer);

        campoPesquisa.addEventListener('input', (e) => {
            this.mostrarSugestoes(e.target.value);
        });

        campoPesquisa.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.mostrarSugestoes(e.target.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.campo-pesquisa-principal')) {
                this.ocultarSugestoes();
            }
        });

        // Teclas de atalho
        campoPesquisa.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navegarSugestoes(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navegarSugestoes(-1);
            } else if (e.key === 'Enter' && this.sugestaoSelecionada) {
                e.preventDefault();
                this.selecionarSugestaoAtual();
            } else if (e.key === 'Escape') {
                this.ocultarSugestoes();
            }
        });
    }

    navegarSugestoes(direcao) {
        const sugestoes = this.sugestoesContainer.querySelectorAll('.sugestao-item');
        if (sugestoes.length === 0) return;

        let indexAtual = -1;
        
        // Encontrar sugestão atual selecionada
        sugestoes.forEach((sugestao, index) => {
            if (sugestao.classList.contains('selecionada')) {
                indexAtual = index;
            }
            sugestao.classList.remove('selecionada');
        });

        // Calcular nova seleção
        let novoIndex = indexAtual + direcao;
        if (novoIndex < 0) novoIndex = sugestoes.length - 1;
        if (novoIndex >= sugestoes.length) novoIndex = 0;

        // Aplicar nova seleção
        sugestoes[novoIndex].classList.add('selecionada');
        this.sugestaoSelecionada = sugestoes[novoIndex];
        sugestoes[novoIndex].scrollIntoView({ block: 'nearest' });
    }

    selecionarSugestaoAtual() {
        if (this.sugestaoSelecionada) {
            const termo = this.sugestaoSelecionada.getAttribute('data-termo');
            this.selecionarSugestao(termo);
        }
    }

    mostrarSugestoes(termo) {
        if (termo === this.ultimoTermo) return;
        this.ultimoTermo = termo;

        if (!termo || termo.length < 2) {
            this.ocultarSugestoes();
            return;
        }

        const sugestoes = this.gerarSugestoes(termo.toLowerCase());
        
        if (sugestoes.length === 0) {
            this.ocultarSugestoes();
            return;
        }

        this.sugestoesContainer.innerHTML = sugestoes.map(sugestao => `
            <div class="sugestao-item" data-termo="${sugestao.termo}" onclick="buscaInteligente.selecionarSugestao('${sugestao.termo}')">
                <i class="fas ${sugestao.icone}"></i>
                <div class="sugestao-conteudo">
                    <div class="sugestao-termo">${this.destacarTermo(sugestao.termo, termo)}</div>
                    <div class="sugestao-tipo">${sugestao.tipo}</div>
                </div>
                ${sugestao.info ? `<div class="sugestao-info">${sugestao.info}</div>` : ''}
            </div>
        `).join('');

        this.sugestoesContainer.style.display = 'block';
        this.sugestaoSelecionada = null;
    }

    destacarTermo(texto, termo) {
        const regex = new RegExp(`(${this.escapeRegExp(termo)})`, 'gi');
        return texto.replace(regex, '<strong>$1</strong>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    gerarSugestoes(termo) {
        const sugestoes = [];
        const livros = sistemaLivros.livros;

        // Sugestões por título (maior relevância)
        livros.forEach(livro => {
            if (livro.titulo.toLowerCase().includes(termo)) {
                sugestoes.push({
                    termo: livro.titulo,
                    tipo: 'Título',
                    icone: 'fa-book',
                    info: livro.autor,
                    relevancia: 3
                });
            }
        });

        // Sugestões por autor
        livros.forEach(livro => {
            if (livro.autor.toLowerCase().includes(termo)) {
                sugestoes.push({
                    termo: livro.autor,
                    tipo: 'Autor',
                    icone: 'fa-user-edit',
                    info: `${livro.titulo} (${livro.ano})`,
                    relevancia: 2
                });
            }
        });

        // Sugestões por gênero
        const generos = Object.keys(sistemaLivros.getLivrosPorGenero());
        generos.forEach(genero => {
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            if (nomeGenero.toLowerCase().includes(termo)) {
                const quantidade = sistemaLivros.getLivrosPorGenero()[genero];
                sugestoes.push({
                    termo: nomeGenero,
                    tipo: 'Gênero',
                    icone: 'fa-tag',
                    info: `${quantidade} livro${quantidade !== 1 ? 's' : ''}`,
                    relevancia: 1
                });
            }
        });

        // Sugestões por tags
        livros.forEach(livro => {
            if (livro.tags) {
                livro.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(termo)) {
                        sugestoes.push({
                            termo: tag,
                            tipo: 'Tag',
                            icone: 'fa-hashtag',
                            info: `Relacionado a ${livro.titulo}`,
                            relevancia: 1
                        });
                    }
                });
            }
        });

        // Remover duplicatas e ordenar por relevância
        const sugestoesUnicas = [];
        const termosAdicionados = new Set();

        sugestoes
            .sort((a, b) => b.relevancia - a.relevancia)
            .forEach(sugestao => {
                const chave = sugestao.termo + sugestao.tipo;
                if (!termosAdicionados.has(chave)) {
                    sugestoesUnicas.push(sugestao);
                    termosAdicionados.add(chave);
                }
            });

        return sugestoesUnicas.slice(0, 8);
    }

    selecionarSugestao(termo) {
        document.getElementById('campoPesquisa').value = termo;
        this.ocultarSugestoes();
        sistemaLivros.aplicarFiltros();
        
        // Focar novamente no campo de pesquisa
        document.getElementById('campoPesquisa').focus();
    }

    ocultarSugestoes() {
        if (this.sugestoesContainer) {
            this.sugestoesContainer.style.display = 'none';
            this.sugestaoSelecionada = null;
        }
    }
}

// Inicializar busca inteligente
const buscaInteligente = new BuscaInteligente();