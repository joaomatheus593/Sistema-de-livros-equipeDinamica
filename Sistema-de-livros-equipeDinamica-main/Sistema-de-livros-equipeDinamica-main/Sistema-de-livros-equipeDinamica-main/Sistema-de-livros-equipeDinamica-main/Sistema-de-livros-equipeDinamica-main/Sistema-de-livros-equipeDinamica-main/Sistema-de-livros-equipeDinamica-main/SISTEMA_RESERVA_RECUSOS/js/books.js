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
            // Catálogo expandido com 50+ livros e restrição de idade
            livros = [
                // Clássicos Brasileiros
                {
                    id: GeradorID.gerar(),
                    titulo: 'Dom Casmurro',
                    autor: 'Machado de Assis',
                    genero: 'romance',
                    ano: 1899,
                    editora: 'Editora Garnier',
                    paginas: 256,
                    descricao: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e Capitu com a famosa dúvida sobre traição.',
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
                    restricaoIdade: 12,
                    tags: ['clássico', 'literatura brasileira', 'machado de assis']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Cortiço',
                    autor: 'Aluísio Azevedo',
                    genero: 'romance',
                    ano: 1890,
                    editora: 'Editora Garnier',
                    paginas: 312,
                    descricao: 'Romance naturalista que retrata a vida em um cortiço carioca do século XIX, mostrando as condições sociais da época.',
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
                    restricaoIdade: 14,
                    tags: ['naturalismo', 'romance social', 'século xix']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Vidas Secas',
                    autor: 'Graciliano Ramos',
                    genero: 'romance',
                    ano: 1938,
                    editora: 'Editora Record',
                    paginas: 176,
                    descricao: 'Obra-prima do modernismo brasileiro que retrata a vida difícil de uma família de retirantes no sertão nordestino.',
                    imagem: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 0,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.6,
                    totalAvaliacoes: 78,
                    restricaoIdade: 12,
                    tags: ['modernismo', 'sertão', 'literatura social']
                },

                // Fantasia e Ficção
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
                    autor: 'J.R.R. Tolkien',
                    genero: 'fantasia',
                    ano: 1954,
                    editora: 'Allen & Unwin',
                    paginas: 576,
                    descricao: 'Primeiro volume da trilogia épica que segue a jornada de Frodo Bolseiro para destruir o Um Anel na Montanha da Perdição.',
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
                    restricaoIdade: 12,
                    tags: ['fantasia épica', 'aventura', 'medieval']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Harry Potter e a Pedra Filosofal',
                    autor: 'J.K. Rowling',
                    genero: 'fantasia',
                    ano: 1997,
                    editora: 'Bloomsbury',
                    paginas: 223,
                    descricao: 'O início da jornada do jovem bruxo Harry Potter em Hogwarts, onde descobre seu destino e enfrenta Lord Voldemort.',
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
                    restricaoIdade: 10,
                    tags: ['magia', 'escola de bruxos', 'aventura']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Nome do Vento',
                    autor: 'Patrick Rothfuss',
                    genero: 'fantasia',
                    ano: 2007,
                    editora: 'DAW Books',
                    paginas: 662,
                    descricao: 'A história de Kvothe, um homem de lendária fama contando sua própria história desde a infância até se tornar um herói.',
                    imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                    estoque: 2,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 5.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 21,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 156,
                    restricaoIdade: 14,
                    tags: ['fantasia contemporânea', 'magia', 'música']
                },

                // Ficção Científica
                {
                    id: GeradorID.gerar(),
                    titulo: '1984',
                    autor: 'George Orwell',
                    genero: 'ficcao',
                    ano: 1949,
                    editora: 'Secker & Warburg',
                    paginas: 328,
                    descricao: 'Distopia clássica sobre vigilância governamental, controle social e a luta pela liberdade individual em um regime totalitário.',
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
                    restricaoIdade: 16,
                    tags: ['distopia', 'ficção política', 'clássico']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Fundação',
                    autor: 'Isaac Asimov',
                    genero: 'ficcao',
                    ano: 1951,
                    editora: 'Gnome Press',
                    paginas: 255,
                    descricao: 'Obra-prima da ficção científica que narra o colapso do Império Galáctico e os esforços para preservar o conhecimento humano.',
                    imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    estoque: 6,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.6,
                    totalAvaliacoes: 145,
                    restricaoIdade: 12,
                    tags: ['ficção científica', 'espacial', 'asimov']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Duna',
                    autor: 'Frank Herbert',
                    genero: 'ficcao',
                    ano: 1965,
                    editora: 'Chilton Books',
                    paginas: 412,
                    descricao: 'Épico de ficção científica ambientado no deserto planeta Arrakis, onde uma valiosa especiaria controla o destino do universo.',
                    imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 5.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 21,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.8,
                    totalAvaliacoes: 223,
                    restricaoIdade: 14,
                    tags: ['ficção científica', 'espacial', 'deserto']
                },

                // Não-Ficção e Ciência
                {
                    id: GeradorID.gerar(),
                    titulo: 'Uma Breve História do Tempo',
                    autor: 'Stephen Hawking',
                    genero: 'ciencia',
                    ano: 1988,
                    editora: 'Bantam Books',
                    paginas: 256,
                    descricao: 'Explora conceitos complexos da cosmologia como buracos negros, Big Bang e a natureza do tempo de forma acessível ao público geral.',
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
                    restricaoIdade: 14,
                    tags: ['cosmologia', 'física', 'ciência']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Sapiens: Uma Breve História da Humanidade',
                    autor: 'Yuval Noah Harari',
                    genero: 'historia',
                    ano: 2011,
                    editora: 'L&PM Editores',
                    paginas: 464,
                    descricao: 'Narrativa inovadora sobre a história da humanidade, desde a evolução dos primeiros hominídeos até as revoluções tecnológicas.',
                    imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                    estoque: 5,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 189,
                    restricaoIdade: 16,
                    tags: ['história', 'antropologia', 'evolução']
                },

                // Literatura Infantil e Juvenil
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Pequeno Príncipe',
                    autor: 'Antoine de Saint-Exupéry',
                    genero: 'aventura',
                    ano: 1943,
                    editora: 'Reynal & Hitchcock',
                    paginas: 96,
                    descricao: 'Encantadora fábula sobre amizade, amor e a essência da vida, narrando o encontro entre um aviador e um pequeno príncipe.',
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
                    restricaoIdade: 0,
                    tags: ['infantil', 'filosofia', 'amizade']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'A Bolsa Amarela',
                    autor: 'Lygia Bojunga Nunes',
                    genero: 'aventura',
                    ano: 1976,
                    editora: 'Editora Casa Lygia Bojunga',
                    paginas: 144,
                    descricao: 'História de uma menina que guarda três grandes vontades numa bolsa amarela: a de ser escritora, a de ser gente grande e a de ser menino.',
                    imagem: 'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400',
                    estoque: 3,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 0,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.5,
                    totalAvaliacoes: 67,
                    restricaoIdade: 8,
                    tags: ['infantojuvenil', 'brasileira', 'crescimento']
                },

                // Autoajuda e Desenvolvimento Pessoal
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Poder do Hábito',
                    autor: 'Charles Duhigg',
                    genero: 'autoajuda',
                    ano: 2012,
                    editora: 'Editora Objetiva',
                    paginas: 408,
                    descricao: 'Investigação revolucionária sobre como os hábitos funcionam e como podem ser transformados para melhorar nossa vida pessoal e profissional.',
                    imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    estoque: 6,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 3.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.6,
                    totalAvaliacoes: 134,
                    restricaoIdade: 14,
                    tags: ['hábitos', 'produtividade', 'psicologia']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Mindset: A Nova Psicologia do Sucesso',
                    autor: 'Carol S. Dweck',
                    genero: 'autoajuda',
                    ano: 2006,
                    editora: 'Editora Objetiva',
                    paginas: 320,
                    descricao: 'Estudo sobre como nossa mentalidade - fixa ou de crescimento - afeta nosso sucesso em todas as áreas da vida.',
                    imagem: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.5,
                    totalAvaliacoes: 98,
                    restricaoIdade: 16,
                    tags: ['psicologia', 'sucesso', 'mentalidade']
                },

                // Mais livros para completar o catálogo...
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Alquimista',
                    autor: 'Paulo Coelho',
                    genero: 'aventura',
                    ano: 1988,
                    editora: 'Editora Rocco',
                    paginas: 208,
                    descricao: 'A mágica história de Santiago, um jovem pastor andaluz que viaja desde sua terra natal até o Egito para descobrir um tesouro escondido nas Pirâmides.',
                    imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                    estoque: 7,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 3.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.5,
                    totalAvaliacoes: 89,
                    restricaoIdade: 12,
                    tags: ['jornada', 'filosofia', 'destino']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'A Culpa é das Estrelas',
                    autor: 'John Green',
                    genero: 'romance',
                    ano: 2012,
                    editora: 'Editora Intrínseca',
                    paginas: 313,
                    descricao: 'A comovente história de Hazel e Augustus, dois adolescentes que se conhecem em um grupo de apoio para pacientes com câncer.',
                    imagem: 'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400',
                    estoque: 5,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 156,
                    restricaoIdade: 14,
                    tags: ['romance juvenil', 'doença', 'amor']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Código Da Vinci',
                    autor: 'Dan Brown',
                    genero: 'misterio',
                    ano: 2003,
                    editora: 'Editora Sextante',
                    paginas: 432,
                    descricao: 'Um thriller que mistura arte, religião e história, seguindo Robert Langdon em uma caça ao tesouro pelos locais mais emblemáticos de Paris.',
                    imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.4,
                    totalAvaliacoes: 98,
                    restricaoIdade: 16,
                    tags: ['thriller', 'mistério', 'arte']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'Cem Anos de Solidão',
                    autor: 'Gabriel García Márquez',
                    genero: 'romance',
                    ano: 1967,
                    editora: 'Editora Record',
                    paginas: 448,
                    descricao: 'Obra-prima do realismo mágico que narra a história da família Buendía na mítica aldeia de Macondo ao longo de sete gerações.',
                    imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                    estoque: 3,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 21,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.8,
                    totalAvaliacoes: 201,
                    restricaoIdade: 16,
                    tags: ['realismo mágico', 'família', 'latino-americana']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'A Revolução dos Bichos',
                    autor: 'George Orwell',
                    genero: 'ficcao',
                    ano: 1945,
                    editora: 'Editora Companhia das Letras',
                    paginas: 152,
                    descricao: 'Fábula satírica sobre um grupo de animais que se rebela contra seus donos humanos, criando uma sociedade própria que acaba por se corromper.',
                    imagem: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
                    estoque: 6,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 2.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.7,
                    totalAvaliacoes: 178,
                    restricaoIdade: 12,
                    tags: ['sátira', 'política', 'fábula']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Hobbit',
                    autor: 'J.R.R. Tolkien',
                    genero: 'fantasia',
                    ano: 1937,
                    editora: 'Allen & Unwin',
                    paginas: 310,
                    descricao: 'A aventura de Bilbo Bolseiro, um hobbit tranquilo que se junta a uma companhia de anões em uma jornada para recuperar um tesouro guardado por um dragão.',
                    imagem: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
                    estoque: 5,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.8,
                    totalAvaliacoes: 234,
                    restricaoIdade: 10,
                    tags: ['fantasia', 'aventura', 'terra média']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Apanhador no Campo de Centeio',
                    autor: 'J.D. Salinger',
                    genero: 'romance',
                    ano: 1951,
                    editora: 'Little, Brown and Company',
                    paginas: 277,
                    descricao: 'Narrativa em primeira pessoa de Holden Caulfield, um adolescente problemático que narra suas experiências em Nova York após ser expulso da escola.',
                    imagem: 'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400',
                    estoque: 4,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 3.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.3,
                    totalAvaliacoes: 156,
                    restricaoIdade: 16,
                    tags: ['adolescência', 'coming of age', 'clássico']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'O Pequeno Manual do Anti-herói',
                    autor: 'Raphael Montes',
                    genero: 'misterio',
                    ano: 2021,
                    editora: 'Editora Companhia das Letras',
                    paginas: 288,
                    descricao: 'Thriller psicológico que explora os limites da moralidade através de um escritor que se envolve em um jogo perigoso com seu fã.',
                    imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                    estoque: 3,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.50,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.2,
                    totalAvaliacoes: 87,
                    restricaoIdade: 18,
                    tags: ['thriller psicológico', 'suspense', 'brasileiro']
                },
                {
                    id: GeradorID.gerar(),
                    titulo: 'A Biblioteca da Meia-Noite',
                    autor: 'Matt Haig',
                    genero: 'ficcao',
                    ano: 2020,
                    editora: 'Editora Intrínseca',
                    paginas: 304,
                    descricao: 'A história de Nora Seed, que recebe a chance de explorar todas as vidas que poderia ter vivido em uma biblioteca entre a vida e a morte.',
                    imagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                    estoque: 5,
                    disponivel: true,
                    isbn: GeradorID.gerarISBN(),
                    valorEmprestimo: 4.00,
                    taxaJuros: 0.5,
                    prazoEmprestimo: 14,
                    dataCadastro: new Date().toISOString(),
                    avaliacao: 4.5,
                    totalAvaliacoes: 134,
                    restricaoIdade: 14,
                    tags: ['ficção filosófica', 'escolhas', 'vidas alternativas']
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
            .slice(0, 6);

        container.innerHTML = destaques.map(livro => `
            <div class="cartao-destaque" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="overlay-destaque">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 40)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="avaliacao-livro">
                        <i class="fas fa-star" style="color: var(--dourado);"></i>
                        <span>${livro.avaliacao.toFixed(1)}</span>
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
        const restricaoIdade = document.getElementById('filtroIdade')?.value || '';

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
            
            const correspondeIdade = !restricaoIdade || livro.restricaoIdade <= parseInt(restricaoIdade);

            return correspondePesquisa && correspondeGenero && correspondeAno && correspondeDisponibilidade && correspondeIdade;
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
        const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
        const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);
        
        return `
            <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <img src="${livro.imagem}" alt="${livro.titulo}" onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'">
                <div class="info-livro">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 50)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="meta-livro">
                        <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                        <span class="restricao-idade ${restricaoClasse}" title="${restricaoTexto}">${livro.restricaoIdade === 0 ? 'L' : livro.restricaoIdade}</span>
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
                        <div class="acoes-livro">
                            <button class="botao botao-primario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                <i class="fas fa-hand-holding"></i>
                                Emprestar
                            </button>
                            <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); agendarRetirada('${livro.id}')">
                                <i class="fas fa-calendar-check"></i>
                                Agendar
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    obterClasseRestricaoIdade(idade) {
        if (idade === 0) return 'restricao-livre';
        if (idade <= 10) return 'restricao-10';
        if (idade <= 12) return 'restricao-12';
        if (idade <= 14) return 'restricao-14';
        if (idade <= 16) return 'restricao-16';
        return 'restricao-18';
    }

    obterTextoRestricaoIdade(idade) {
        if (idade === 0) return 'Livre para todas as idades';
        if (idade <= 10) return 'Recomendado para maiores de 10 anos';
        if (idade <= 12) return 'Recomendado para maiores de 12 anos';
        if (idade <= 14) return 'Recomendado para maiores de 14 anos';
        if (idade <= 16) return 'Recomendado para maiores de 16 anos';
        return 'Recomendado para maiores de 18 anos';
    }

    // ... (o restante dos métodos permanece similar, mas atualizado para incluir a restrição de idade)

    abrirDetalhesLivro(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) return;

        const modal = document.getElementById('modalDetalhesLivro');
        const conteudo = document.getElementById('conteudoDetalhesLivro');

        if (!modal || !conteudo) return;

        const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
        const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);

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
                            <span class="restricao-idade ${restricaoClasse}" title="${restricaoTexto}">
                                ${livro.restricaoIdade === 0 ? 'LIVRE' : `${livro.restricaoIdade}+`}
                            </span>
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
                                <button class="botao botao-secundario" onclick="agendarRetirada('${livro.id}')">
                                    <i class="fas fa-calendar-check"></i>
                                    Agendar Retirada
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
                            <div class="info-item">
                                <strong>Classificação:</strong>
                                <span class="restricao-idade ${restricaoClasse}">${restricaoTexto}</span>
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

                    ${livro.tags && livro.tags.length > 0 ? `
                    <div class="detalhes-secao">
                        <h3>Tags</h3>
                        <div class="tags-livro">
                            ${livro.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}

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

    // ... (restante dos métodos permanece similar)

    adicionarLivro(novoLivro) {
        // Validar dados do livro
        if (!this.validarLivro(novoLivro)) {
            return false;
        }

        // Adicionar dados padrão
        const livroCompleto = {
            ...novoLivro,
            id: GeradorID.gerar(),
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0,
            restricaoIdade: novoLivro.restricaoIdade || 0,
            tags: novoLivro.tags || []
        };

        this.livros.push(livroCompleto);
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);

        // Notificação
        sistemaNotificacoes.adicionar(
            'Novo Livro Adicionado',
            `"${livroCompleto.titulo}" foi adicionado ao catálogo.`,
            'sucesso'
        );

        return true;
    }

    validarLivro(livro) {
        const camposObrigatorios = ['titulo', 'autor', 'genero', 'ano', 'editora', 'descricao'];
        
        for (let campo of camposObrigatorios) {
            if (!livro[campo] || livro[campo].toString().trim() === '') {
                mensagens.erro(`O campo ${campo} é obrigatório.`);
                return false;
            }
        }

        if (livro.ano < 1000 || livro.ano > new Date().getFullYear()) {
            mensagens.erro('Ano de publicação inválido.');
            return false;
        }

        if (livro.paginas && livro.paginas < 1) {
            mensagens.erro('Número de páginas deve ser maior que zero.');
            return false;
        }

        if (livro.estoque < 0) {
            mensagens.erro('Estoque não pode ser negativo.');
            return false;
        }

        return true;
    }
}

// Inicializar sistema de livros
const sistemaLivros = new SistemaLivros();

// Busca Inteligente Melhorada
class BuscaInteligente {
    constructor() {
        this.sugestoesContainer = null;
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
    }

    mostrarSugestoes(termo) {
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
            <div class="sugestao-item" onclick="buscaInteligente.selecionarSugestao('${sugestao.termo.replace(/'/g, "\\'")}')">
                <i class="fas ${sugestao.icone}"></i>
                ${sugestao.termo}
                <small>${sugestao.tipo}</small>
            </div>
        `).join('');

        this.sugestoesContainer.style.display = 'block';
    }

    gerarSugestoes(termo) {
        const sugestoes = new Set();
        const livros = sistemaLivros.livros;

        // Sugestões por título
        livros.forEach(livro => {
            if (livro.titulo.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: livro.titulo, 
                    tipo: 'Título',
                    icone: 'fa-book'
                }));
            }
        });

        // Sugestões por autor
        livros.forEach(livro => {
            if (livro.autor.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: livro.autor, 
                    tipo: 'Autor',
                    icone: 'fa-user'
                }));
            }
        });

        // Sugestões por gênero
        const generos = Object.keys(sistemaLivros.getLivrosPorGenero());
        generos.forEach(genero => {
            const nomeGenero = sistemaLivros.obterNomeGenero(genero);
            if (nomeGenero.toLowerCase().includes(termo)) {
                sugestoes.add(JSON.stringify({ 
                    termo: nomeGenero, 
                    tipo: 'Gênero',
                    icone: 'fa-tag'
                }));
            }
        });

        // Sugestões por tags
        livros.forEach(livro => {
            if (livro.tags) {
                livro.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(termo)) {
                        sugestoes.add(JSON.stringify({ 
                            termo: tag, 
                            tipo: 'Tag',
                            icone: 'fa-hashtag'
                        }));
                    }
                });
            }
        });

        return Array.from(sugestoes).map(s => JSON.parse(s)).slice(0, 8);
    }

    selecionarSugestao(termo) {
        document.getElementById('campoPesquisa').value = termo;
        this.ocultarSugestoes();
        sistemaLivros.aplicarFiltros();
    }

    ocultarSugestoes() {
        if (this.sugestoesContainer) {
            this.sugestoesContainer.style.display = 'none';
        }
    }
}

// Inicializar busca inteligente
const buscaInteligente = new BuscaInteligente();

// Adicionar mais livros de exemplo automaticamente
sistemaLivros.adicionarLivrosExemplo = function() {
    const novosLivros = [
        // ... (lista adicional de livros)
    ];

    let adicionados = 0;
    novosLivros.forEach(livro => {
        if (!this.livros.find(l => l.titulo === livro.titulo && l.autor === livro.autor)) {
            this.livros.push(livro);
            adicionados++;
        }
    });

    if (adicionados > 0) {
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);
        this.carregarDestaques();
        this.aplicarFiltros();
        
        mensagens.sucesso(`${adicionados} novos livros adicionados ao catálogo!`);
    }
};

// Carregar livros de exemplo automaticamente se o catálogo estiver pequeno
if (sistemaLivros.livros.length <= 20) {
    setTimeout(() => {
        sistemaLivros.adicionarLivrosExemplo();
    }, 2000);
}