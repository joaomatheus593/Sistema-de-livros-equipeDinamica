class SistemaLivros {
    constructor() {
        this.livros = this.carregarLivros();
        this.livrosFiltrados = [];
        this.filtrosAtivos = {};
        this.paginaAtual = 1;
        this.livrosPorPagina = 12;
        this.tamanhoExibicao = 'medio';
        this.ordenacaoAtual = 'relevancia';
        this.pesquisaTimeout = null;
        
        this.inicializarEventos();
        console.log('📚 Sistema de Livros inicializado com', this.livros.length, 'livros');
    }

    carregarLivros() {
        let livros = ArmazenamentoLocal.carregar('biblioteca_livros');
        
        if (!livros || livros.length === 0) {
            console.log('📖 Criando catálogo de livros profissional...');
            livros = this.criarCatalogoProfissional();
            ArmazenamentoLocal.salvar('biblioteca_livros', livros);
        }
        
        return livros;
    }

    criarCatalogoProfissional() {
        const imagens = [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1558901357-ca41e027e43a?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&w=400&h=500&fit=crop'
        ];

        return [
            {
                id: 'livro-001',
                titulo: 'Dom Casmurro',
                autor: 'Machado de Assis',
                genero: 'romance',
                ano: 1899,
                editora: 'Editora Garnier',
                paginas: 256,
                descricao: 'Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e Capitu com a famosa dúvida sobre traição. Uma obra-prima do realismo brasileiro que explora ciúmes, amor e sociedade.',
                imagem: imagens[0],
                estoque: 5,
                disponivel: true,
                isbn: '978-85-7232-144-9',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.8,
                totalAvaliacoes: 124,
                restricaoIdade: 12,
                tags: ['clássico', 'literatura brasileira', 'machado de assis', 'realismo', 'romance'],
                destaque: true,
                vezesEmprestado: 45
            },
            {
                id: 'livro-002',
                titulo: 'O Cortiço',
                autor: 'Aluísio Azevedo',
                genero: 'romance',
                ano: 1890,
                editora: 'Editora Garnier',
                paginas: 312,
                descricao: 'Romance naturalista que retrata a vida em um cortiço carioca do século XIX, mostrando as condições sociais da época e as relações humanas em um ambiente de pobreza e exploração.',
                imagem: imagens[1],
                estoque: 3,
                disponivel: true,
                isbn: '978-85-7232-145-6',
                valorEmprestimo: 2.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.5,
                totalAvaliacoes: 89,
                restricaoIdade: 14,
                tags: ['naturalismo', 'romance social', 'século xix', 'brasil império'],
                destaque: true,
                vezesEmprestado: 32
            },
            {
                id: 'livro-003',
                titulo: 'Vidas Secas',
                autor: 'Graciliano Ramos',
                genero: 'romance',
                ano: 1938,
                editora: 'Editora Record',
                paginas: 176,
                descricao: 'Obra-prima do modernismo brasileiro que retrata a vida difícil de uma família de retirantes no sertão nordestino, mostrando a luta pela sobrevivência em condições desumanas.',
                imagem: imagens[2],
                estoque: 4,
                disponivel: true,
                isbn: '978-85-010-6789-0',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.6,
                totalAvaliacoes: 78,
                restricaoIdade: 12,
                tags: ['modernismo', 'sertão', 'literatura social', 'nordeste'],
                destaque: true,
                vezesEmprestado: 28
            },
            {
                id: 'livro-004',
                titulo: 'O Alienista',
                autor: 'Machado de Assis',
                genero: 'ficcao',
                ano: 1882,
                editora: 'Editora Garnier',
                paginas: 96,
                descricao: 'Conto filosófico que questiona os limites entre sanidade e loucura através da história do Dr. Simão Bacamarte e seu ambicioso projeto de estudar a mente humana.',
                imagem: imagens[3],
                estoque: 6,
                disponivel: true,
                isbn: '978-85-7232-146-3',
                valorEmprestimo: 1.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 10,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.7,
                totalAvaliacoes: 67,
                restricaoIdade: 14,
                tags: ['conto', 'filosofia', 'psicologia', 'machado de assis'],
                destaque: false,
                vezesEmprestado: 21
            },
            {
                id: 'livro-005',
                titulo: 'Iracema',
                autor: 'José de Alencar',
                genero: 'romance',
                ano: 1865,
                editora: 'Editora B. L. Garnier',
                paginas: 200,
                descricao: 'Lenda do Ceará que narra o amor entre a índia Iracema e o português Martim, simbolizando o nascimento do povo cearense e a miscigenação brasileira.',
                imagem: imagens[4],
                estoque: 2,
                disponivel: true,
                isbn: '978-85-7232-147-0',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.3,
                totalAvaliacoes: 54,
                restricaoIdade: 10,
                tags: ['indianismo', 'romance histórico', 'século xix', 'amor'],
                destaque: true,
                vezesEmprestado: 19
            },
            {
                id: 'livro-006',
                titulo: 'O Guarani',
                autor: 'José de Alencar',
                genero: 'romance',
                ano: 1857,
                editora: 'Editora B. L. Garnier',
                paginas: 320,
                descricao: 'Romance indianista que conta a história de amor entre Peri, o índio guarani, e Ceci, a jovem portuguesa, em meio aos conflitos entre colonizadores e nativos.',
                imagem: imagens[5],
                estoque: 3,
                disponivel: true,
                isbn: '978-85-7232-148-7',
                valorEmprestimo: 2.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.4,
                totalAvaliacoes: 61,
                restricaoIdade: 12,
                tags: ['indianismo', 'aventura', 'romance histórico', 'brasil colônia'],
                destaque: false,
                vezesEmprestado: 23
            },
            {
                id: 'livro-007',
                titulo: 'Memórias Póstumas de Brás Cubas',
                autor: 'Machado de Assis',
                genero: 'romance',
                ano: 1881,
                editora: 'Editora Garnier',
                paginas: 368,
                descricao: 'O defunto autor Brás Cubas narra suas memórias desde sua morte, numa obra revolucionária que marca o realismo brasileiro com ironia e pessimismo.',
                imagem: imagens[6],
                estoque: 4,
                disponivel: true,
                isbn: '978-85-7232-149-4',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.9,
                totalAvaliacoes: 98,
                restricaoIdade: 14,
                tags: ['realismo', 'ironia', 'machado de assis', 'clássico'],
                destaque: true,
                vezesEmprestado: 38
            },
            {
                id: 'livro-008',
                titulo: 'O Mulato',
                autor: 'Aluísio Azevedo',
                genero: 'romance',
                ano: 1881,
                editora: 'Editora Garnier',
                paginas: 280,
                descricao: 'Romance naturalista que aborda o preconceito racial no Brasil do século XIX através da história de Raimundo, um jovem mestiço educado na Europa.',
                imagem: imagens[7],
                estoque: 2,
                disponivel: true,
                isbn: '978-85-7232-150-0',
                valorEmprestimo: 1.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.2,
                totalAvaliacoes: 45,
                restricaoIdade: 14,
                tags: ['naturalismo', 'preconceito racial', 'século xix', 'sociedade'],
                destaque: false,
                vezesEmprestado: 16
            },
            {
                id: 'livro-009',
                titulo: 'O Triste Fim de Policarpo Quaresma',
                autor: 'Lima Barreto',
                genero: 'romance',
                ano: 1915,
                editora: 'Editora Revista',
                paginas: 224,
                descricao: 'Sátira sobre o patriotismo exagerado do major Policarpo Quaresma, que propõe mudanças absurdas para o Brasil e enfrenta a burocracia e o conservadorismo.',
                imagem: imagens[8],
                estoque: 3,
                disponivel: true,
                isbn: '978-85-7232-151-7',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.5,
                totalAvaliacoes: 52,
                restricaoIdade: 12,
                tags: ['sátira', 'patriotismo', 'premodernismo', 'burocracia'],
                destaque: true,
                vezesEmprestado: 27
            },
            {
                id: 'livro-010',
                titulo: 'Clara dos Anjos',
                autor: 'Lima Barreto',
                genero: 'romance',
                ano: 1948,
                editora: 'Editora Mérito',
                paginas: 192,
                descricao: 'Romance que denuncia o preconceito racial e social através da história de Clara, uma jovem mulata seduzida e abandonada por um homem branco.',
                imagem: imagens[9],
                estoque: 1,
                disponivel: true,
                isbn: '978-85-7232-152-4',
                valorEmprestimo: 1.00,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.3,
                totalAvaliacoes: 38,
                restricaoIdade: 14,
                tags: ['preconceito', 'realismo social', 'lima barreto', 'drama'],
                destaque: false,
                vezesEmprestado: 14
            },
            {
                id: 'livro-011',
                titulo: 'A Moreninha',
                autor: 'Joaquim Manuel de Macedo',
                genero: 'romance',
                ano: 1844,
                editora: 'Editora Typ. de Paula Brito',
                paginas: 256,
                descricao: 'Considerado o primeiro romance romântico brasileiro, conta a história de amor entre Augusto e Carolina durante um fim de semana na Ilha de Paquetá.',
                imagem: imagens[10],
                estoque: 4,
                disponivel: true,
                isbn: '978-85-7232-153-1',
                valorEmprestimo: 0,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.1,
                totalAvaliacoes: 49,
                restricaoIdade: 10,
                tags: ['romantismo', 'amor', 'primeiro romance', 'século xix'],
                destaque: false,
                vezesEmprestado: 22
            },
            {
                id: 'livro-012',
                titulo: 'Senhora',
                autor: 'José de Alencar',
                genero: 'romance',
                ano: 1875,
                editora: 'Editora B. L. Garnier',
                paginas: 288,
                descricao: 'Romance que critica o casamento por interesse através da história de Aurélia, que compra seu antigo amor por dinheiro após herdar uma fortuna.',
                imagem: imagens[11],
                estoque: 3,
                disponivel: true,
                isbn: '978-85-7232-154-8',
                valorEmprestimo: 1.50,
                taxaJuros: 0.5,
                prazoEmprestimo: 14,
                dataCadastro: new Date().toISOString(),
                avaliacao: 4.4,
                totalAvaliacoes: 57,
                restricaoIdade: 12,
                tags: ['romantismo', 'crítica social', 'casamento', 'josé de alencar'],
                destaque: true,
                vezesEmprestado: 25
            }
        ];
    }

    inicializarEventos() {
        console.log('🔧 Inicializando eventos do sistema de livros...');
        
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
                    this.aplicarFiltros();
                }
            });
        }

        // Filtros
        const filtros = ['filtroGenero', 'filtroAno', 'filtroDisponibilidade', 'filtroIdade', 'filtroOrdenacao'];
        filtros.forEach(filtroId => {
            const elemento = document.getElementById(filtroId);
            if (elemento) {
                elemento.addEventListener('change', () => {
                    this.aplicarFiltros();
                });
            }
        });

        // Observar quando o sistema principal ficar visível
        this.inicializarObservador();
        
        console.log('✅ Eventos de livros inicializados');
    }

    inicializarObservador() {
        const sistemaPrincipal = document.getElementById('sistemaPrincipal');
        if (!sistemaPrincipal) {
            console.error('❌ Sistema principal não encontrado');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const displayStyle = sistemaPrincipal.style.display;
                    if (displayStyle !== 'none') {
                        console.log('🎯 Sistema principal ficou visível - carregando livros...');
                        setTimeout(() => {
                            this.carregarLivrosNaInterface();
                        }, 200);
                    }
                }
            });
        });

        observer.observe(sistemaPrincipal, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }

    carregarLivrosNaInterface() {
        console.log('📚 Carregando livros na interface...');
        
        if (!this.verificarElementosDOM()) {
            console.error('❌ Elementos DOM não encontrados');
            return;
        }

        this.carregarDestaques();
        this.aplicarFiltros();
        
        console.log('✅ Livros carregados com sucesso na interface');
    }

    verificarElementosDOM() {
        const elementosNecessarios = [
            'carrosselDestaques',
            'gradeLivros',
            'totalLivrosEncontrados'
        ];

        for (const elementoId of elementosNecessarios) {
            if (!document.getElementById(elementoId)) {
                console.error(`❌ Elemento não encontrado: ${elementoId}`);
                return false;
            }
        }

        return true;
    }

    carregarDestaques() {
        const container = document.getElementById('carrosselDestaques');
        if (!container) return;
    
        // Mostrar apenas livros marcados como destaque
        const destaques = this.livros
            .filter(livro => livro.destaque && livro.disponivel)
            .sort((a, b) => b.avaliacao - a.avaliacao)
            .slice(0, 6);
    
        if (destaques.length === 0) {
            container.innerHTML = `
                <div class="sem-destaques" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-star" style="font-size: 3rem; color: var(--cinza-medio); margin-bottom: 15px;"></i>
                    <h3 style="color: var(--cinza-medio); margin-bottom: 10px;">Nenhum livro em destaque</h3>
                    <p style="color: var(--cinza-medio);">Marque livros como destaque no painel administrativo para vê-los aqui.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = destaques.map(livro => `
            <div class="cartao-destaque" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <div class="container-imagem-destaque">
                    <img src="${livro.imagem}" alt="${livro.titulo}" 
                         onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'">
                    <div class="overlay-destaque"></div>
                    <div class="badge-destaque">
                        <i class="fas fa-star"></i>
                        Destaque
                    </div>
                </div>
                <div class="info-destaque">
                    <h3>${Formatadores.limitarTexto(livro.titulo, 40)}</h3>
                    <p class="autor-destaque">${livro.autor}</p>
                    <div class="avaliacao-destaque">
                        <div class="estrelas">
                            ${this.gerarEstrelas(livro.avaliacao)}
                        </div>
                        <span>${livro.avaliacao.toFixed(1)}</span>
                    </div>
                    <div class="status-destaque ${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                        <i class="fas fa-${livro.disponivel ? 'check' : 'times'}"></i>
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
        const restricaoIdade = document.getElementById('filtroIdade')?.value || '';

        console.log('🔍 Aplicando filtros:', { termoPesquisa, genero, ano, disponibilidade, ordenacao, restricaoIdade });

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
        this.ordenacaoAtual = ordenacao;
        
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
            case 'popularidade':
                this.livrosFiltrados.sort((a, b) => b.vezesEmprestado - a.vezesEmprestado);
                break;
            case 'relevancia':
            default:
                // Ordem padrão: disponíveis primeiro, depois por avaliação
                this.livrosFiltrados.sort((a, b) => {
                    if (a.disponivel !== b.disponivel) {
                        return a.disponivel ? -1 : 1;
                    }
                    return b.avaliacao - a.avaliacao;
                });
                break;
        }
    }

    atualizarGradeLivros() {
        const container = document.getElementById('gradeLivros');
        const totalElement = document.getElementById('totalLivrosEncontrados');
        
        if (!container) {
            console.error('❌ Container gradeLivros não encontrado');
            return;
        }

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
        if (livrosPagina.length === 0) {
            container.innerHTML = `
                <div class="sem-dados" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-book-open" style="font-size: 4rem; color: var(--cinza-medio); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--cinza-medio); margin-bottom: 15px; font-size: 1.5rem;">Nenhum livro encontrado</h3>
                    <p style="color: var(--cinza-medio); font-size: 1.1rem; max-width: 400px; margin: 0 auto;">
                        Tente ajustar os filtros de pesquisa ou verificar os termos digitados.
                    </p>
                    <button class="botao botao-primario" onclick="sistemaLivros.limparFiltros()" style="margin-top: 20px;">
                        <i class="fas fa-times"></i>
                        Limpar Filtros
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = livrosPagina.map(livro => this.criarCartaoLivro(livro)).join('');
        }

        // Atualizar paginação
        this.atualizarPaginacao();
        
        console.log('✅ Grade de livros atualizada:', this.livrosFiltrados.length, 'livros encontrados');
    }

    criarCartaoLivro(livro) {
        const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
        const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);
        
        return `
            <div class="cartao-livro" onclick="sistemaLivros.abrirDetalhesLivro('${livro.id}')">
                <div class="container-imagem-livro">
                    <img src="${livro.imagem}" alt="${livro.titulo}" 
                         class="imagem-livro"
                         onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop'">
                    <div class="overlay-imagem"></div>
                    ${livro.destaque ? `
                        <div class="badge-destaque-livro">
                            <i class="fas fa-star"></i>
                            Destaque
                        </div>
                    ` : ''}
                    ${livro.estoque <= 2 && livro.estoque > 0 ? `
                        <div class="badge-estoque-baixo">
                            <i class="fas fa-exclamation-triangle"></i>
                            Estoque Baixo
                        </div>
                    ` : ''}
                    ${livro.estoque === 0 ? `
                        <div class="badge-indisponivel">
                            <i class="fas fa-times"></i>
                            Indisponível
                        </div>
                    ` : ''}
                </div>
                <div class="info-livro">
                    <h3 class="titulo-livro">${Formatadores.limitarTexto(livro.titulo, 50)}</h3>
                    <p class="autor-livro">${livro.autor}</p>
                    <div class="meta-livro">
                        <span class="genero-livro">${this.obterNomeGenero(livro.genero)}</span>
                        <span class="restricao-idade ${restricaoClasse}" title="${restricaoTexto}">
                            ${livro.restricaoIdade === 0 ? 'L' : livro.restricaoIdade}+
                        </span>
                    </div>
                    <div class="avaliacao-livro">
                        <div class="estrelas">
                            ${this.gerarEstrelas(livro.avaliacao)}
                        </div>
                        <span class="nota-livro">${livro.avaliacao.toFixed(1)} (${livro.totalAvaliacoes})</span>
                    </div>
                    <div class="status-livro ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                        <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${livro.disponivel ? `Disponível - ${livro.estoque} unidade(s)` : 'Indisponível'}
                    </div>
                    ${livro.disponivel ? `
                        <div class="acoes-livro">
                            <button class="botao botao-primario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                <i class="fas fa-hand-holding"></i>
                                Emprestar
                            </button>
                            <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.agendarRetirada('${livro.id}')">
                                <i class="fas fa-calendar-check"></i>
                                Agendar
                            </button>
                        </div>
                    ` : `
                        <div class="acoes-livro">
                            <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.notificarDisponibilidade('${livro.id}')">
                                <i class="fas fa-bell"></i>
                                Notificar
                            </button>
                            <button class="botao botao-secundario botao-pequeno" onclick="event.stopPropagation(); sistemaLivros.adicionarAosFavoritos('${livro.id}')">
                                <i class="fas fa-heart"></i>
                                Favoritar
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    gerarEstrelas(avaliacao) {
        const estrelasCheias = Math.floor(avaliacao);
        const meiaEstrela = avaliacao % 1 >= 0.5;
        const estrelasVazias = 5 - estrelasCheias - (meiaEstrela ? 1 : 0);
        
        let html = '';
        
        // Estrelas cheias
        for (let i = 0; i < estrelasCheias; i++) {
            html += '<i class="fas fa-star estrela-cheia"></i>';
        }
        
        // Meia estrela
        if (meiaEstrela) {
            html += '<i class="fas fa-star-half-alt estrela-meia"></i>';
        }
        
        // Estrelas vazias
        for (let i = 0; i < estrelasVazias; i++) {
            html += '<i class="far fa-star estrela-vazia"></i>';
        }
        
        return html;
    }

    obterNomeGenero(genero) {
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
        return generos[genero] || genero;
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
            paginacaoHTML += `
                <button class="pagina pagina-anterior" onclick="sistemaLivros.irParaPagina(${this.paginaAtual - 1})">
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                </button>
            `;
        }

        // Páginas
        const paginasParaMostrar = this.calcularPaginasParaMostrar(this.paginaAtual, totalPaginas);
        
        paginasParaMostrar.forEach(pagina => {
            if (pagina === '...') {
                paginacaoHTML += `<span class="pagina separador">...</span>`;
            } else {
                paginacaoHTML += `
                    <button class="pagina ${pagina === this.paginaAtual ? 'ativa' : ''}" 
                            onclick="sistemaLivros.irParaPagina(${pagina})">
                        ${pagina}
                    </button>
                `;
            }
        });

        // Botão próximo
        if (this.paginaAtual < totalPaginas) {
            paginacaoHTML += `
                <button class="pagina pagina-proxima" onclick="sistemaLivros.irParaPagina(${this.paginaAtual + 1})">
                    Próxima
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        container.innerHTML = paginacaoHTML;
    }

    calcularPaginasParaMostrar(paginaAtual, totalPaginas) {
        const paginas = [];
        const maxPaginas = 5;
        
        if (totalPaginas <= maxPaginas) {
            for (let i = 1; i <= totalPaginas; i++) {
                paginas.push(i);
            }
        } else {
            if (paginaAtual <= 3) {
                for (let i = 1; i <= 4; i++) {
                    paginas.push(i);
                }
                paginas.push('...');
                paginas.push(totalPaginas);
            } else if (paginaAtual >= totalPaginas - 2) {
                paginas.push(1);
                paginas.push('...');
                for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
                    paginas.push(i);
                }
            } else {
                paginas.push(1);
                paginas.push('...');
                for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) {
                    paginas.push(i);
                }
                paginas.push('...');
                paginas.push(totalPaginas);
            }
        }
        
        return paginas;
    }

    irParaPagina(pagina) {
        this.paginaAtual = pagina;
        this.atualizarGradeLivros();
        
        // Scroll suave para o topo da grade
        const gradeLivros = document.getElementById('gradeLivros');
        if (gradeLivros) {
            gradeLivros.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    abrirDetalhesLivro(livroId) {
        console.log('📖 Abrindo detalhes do livro:', livroId);
        
        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        const modal = document.getElementById('modalDetalhesLivro');
        const conteudo = document.getElementById('conteudoDetalhesLivro');

        if (!modal || !conteudo) {
            console.error('❌ Modal de detalhes não encontrado');
            return;
        }

        const restricaoClasse = this.obterClasseRestricaoIdade(livro.restricaoIdade);
        const restricaoTexto = this.obterTextoRestricaoIdade(livro.restricaoIdade);

        conteudo.innerHTML = `
            <div class="detalhes-livro-profissional">
                <div class="detalhes-header">
                    <div class="detalhes-imagem-container">
                        <img src="${livro.imagem}" alt="${livro.titulo}" 
                             class="detalhes-imagem"
                             onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop'">
                        <div class="detalhes-badges">
                            ${livro.destaque ? `
                                <span class="badge badge-destaque">
                                    <i class="fas fa-star"></i>
                                    Livro em Destaque
                                </span>
                            ` : ''}
                            <span class="badge badge-genero">
                                ${this.obterNomeGenero(livro.genero)}
                            </span>
                            <span class="badge ${restricaoClasse}">
                                ${livro.restricaoIdade === 0 ? 'LIVRE' : `${livro.restricaoIdade}+ ANOS`}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detalhes-info-principal">
                        <h1 class="detalhes-titulo">${livro.titulo}</h1>
                        <p class="detalhes-autor">por <strong>${livro.autor}</strong></p>
                        
                        <div class="detalhes-avaliacao">
                            <div class="estrelas-grandes">
                                ${this.gerarEstrelas(livro.avaliacao)}
                            </div>
                            <div class="avaliacao-info">
                                <span class="nota">${livro.avaliacao.toFixed(1)}</span>
                                <span class="total-avaliacoes">(${livro.totalAvaliacoes} avaliações)</span>
                            </div>
                        </div>
                        
                        <div class="detalhes-status ${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                            <i class="fas ${livro.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            <span>
                                ${livro.disponivel ? 
                                    `<strong>Disponível para empréstimo</strong> - ${livro.estoque} unidade(s) em estoque` : 
                                    'Indisponível no momento'
                                }
                            </span>
                        </div>
                        
                        <div class="detalhes-metricas">
                            <div class="metrica">
                                <i class="fas fa-history"></i>
                                <span>${livro.vezesEmprestado} empréstimos</span>
                            </div>
                            <div class="metrica">
                                <i class="fas fa-calendar-alt"></i>
                                <span>Publicado em ${livro.ano}</span>
                            </div>
                            <div class="metrica">
                                <i class="fas fa-file-alt"></i>
                                <span>${livro.paginas} páginas</span>
                            </div>
                        </div>
                        
                        <div class="detalhes-acoes">
                            ${livro.disponivel ? `
                                <button class="botao botao-primario botao-grande" onclick="sistemaLivros.solicitarEmprestimo('${livro.id}')">
                                    <i class="fas fa-hand-holding"></i>
                                    Solicitar Empréstimo
                                </button>
                                <button class="botao botao-secundario botao-grande" onclick="sistemaLivros.agendarRetirada('${livro.id}')">
                                    <i class="fas fa-calendar-check"></i>
                                    Agendar Retirada
                                </button>
                            ` : `
                                <button class="botao botao-secundario botao-grande" onclick="sistemaLivros.notificarDisponibilidade('${livro.id}')">
                                    <i class="fas fa-bell"></i>
                                    Avise-me quando disponível
                                </button>
                            `}
                            <button class="botao botao-secundario" onclick="sistemaLivros.adicionarAosFavoritos('${livro.id}')">
                                <i class="fas fa-heart"></i>
                                Adicionar aos Favoritos
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="detalhes-conteudo">
                    <div class="detalhes-secao">
                        <h3><i class="fas fa-book-open"></i> Sinopse</h3>
                        <p class="detalhes-descricao">${livro.descricao}</p>
                    </div>
                    
                    <div class="detalhes-grid">
                        <div class="detalhes-secao">
                            <h3><i class="fas fa-info-circle"></i> Informações do Livro</h3>
                            <div class="info-lista">
                                <div class="info-item">
                                    <span class="info-label">Editora:</span>
                                    <span class="info-valor">${livro.editora}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">ISBN:</span>
                                    <span class="info-valor isbn">${livro.isbn}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Páginas:</span>
                                    <span class="info-valor">${livro.paginas}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Ano de Publicação:</span>
                                    <span class="info-valor">${livro.ano}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Classificação:</span>
                                    <span class="info-valor ${restricaoClasse}">${restricaoTexto}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detalhes-secao">
                            <h3><i class="fas fa-tags"></i> Tags e Categorias</h3>
                            <div class="tags-container">
                                ${livro.tags.map(tag => `
                                    <span class="tag">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="detalhes-secao">
                        <h3><i class="fas fa-file-invoice-dollar"></i> Condições de Empréstimo</h3>
                        <div class="condicoes-grid">
                            <div class="condicao-card">
                                <i class="fas fa-calendar-day"></i>
                                <div class="condicao-info">
                                    <span class="condicao-titulo">Prazo de Empréstimo</span>
                                    <span class="condicao-valor">${livro.prazoEmprestimo} dias</span>
                                </div>
                            </div>
                            <div class="condicao-card">
                                <i class="fas fa-money-bill-wave"></i>
                                <div class="condicao-info">
                                    <span class="condicao-titulo">Valor do Empréstimo</span>
                                    <span class="condicao-valor">
                                        ${livro.valorEmprestimo > 0 ? 
                                            Formatadores.formatarMoeda(livro.valorEmprestimo) : 
                                            '<span style="color: var(--verde);">Grátis</span>'
                                        }
                                    </span>
                                </div>
                            </div>
                            <div class="condicao-card">
                                <i class="fas fa-percentage"></i>
                                <div class="condicao-info">
                                    <span class="condicao-titulo">Taxa de Juros Diária</span>
                                    <span class="condicao-valor">${livro.taxaJuros}% ao dia</span>
                                </div>
                            </div>
                            <div class="condicao-card">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div class="condicao-info">
                                    <span class="condicao-titulo">Multa por Atraso</span>
                                    <span class="condicao-valor">10% do valor + juros</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detalhes-secao" id="secao-comentarios">
                        <h3><i class="fas fa-comments"></i> Avaliações e Comentários</h3>
                        <div id="lista-comentarios-livro" class="comentarios-container">
                            <div class="carregando-comentarios">
                                <i class="fas fa-spinner fa-spin"></i>
                                Carregando comentários...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Carregar comentários
        if (typeof sistemaComentarios !== 'undefined') {
            setTimeout(() => {
                sistemaComentarios.carregarComentariosLivro(livroId);
            }, 100);
        }

        // Abrir modal
        this.abrirModal('modalDetalhesLivro');
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

    // MÉTODOS DE AÇÃO DOS LIVROS
    solicitarEmprestimo(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        if (!livro.disponivel) {
            mensagens.erro('Este livro não está disponível para empréstimo.');
            return;
        }

        const usuario = sistemaAuth.getUsuarioLogado();
        if (!usuario) {
            mensagens.erro('Você precisa estar logado para solicitar empréstimos.');
            sistemaAuth.mostrarLogin();
            return;
        }

        if (usuario.tipo === 'convidado') {
            mensagens.erro('Usuários convidados não podem solicitar empréstimos.');
            return;
        }

        // Verificar se o usuário já tem este livro emprestado
        const emprestimosAtivos = ArmazenamentoLocal.carregar('biblioteca_emprestimos') || [];
        const emprestimoAtivo = emprestimosAtivos.find(e => 
            e.livroId === livroId && 
            e.usuarioId === usuario.id && 
            e.status === 'ativo'
        );

        if (emprestimoAtivo) {
            mensagens.erro('Você já tem um empréstimo ativo para este livro.');
            return;
        }

        // Criar empréstimo
        const novoEmprestimo = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            usuarioNome: usuario.nome,
            livroTitulo: livro.titulo,
            livroAutor: livro.autor,
            livroImagem: livro.imagem,
            dataEmprestimo: new Date().toISOString(),
            dataDevolucaoPrevista: UtilitariosData.adicionarDias(new Date(), livro.prazoEmprestimo).toISOString(),
            dataDevolucao: null,
            valorEmprestimo: livro.valorEmprestimo,
            taxaJuros: livro.taxaJuros,
            status: 'pendente',
            multa: 0,
            diasAtraso: 0
        };

        emprestimosAtivos.push(novoEmprestimo);
        ArmazenamentoLocal.salvar('biblioteca_emprestimos', emprestimosAtivos);

        // Notificação
        sistemaNotificacoes.adicionar(
            'Empréstimo Solicitado',
            `Sua solicitação de empréstimo para "${livro.titulo}" foi enviada para aprovação.`,
            'info'
        );

        mensagens.sucesso(`Empréstimo solicitado com sucesso! Aguarde a aprovação.`);
    }

    agendarRetirada(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (!livro) {
            mensagens.erro('Livro não encontrado.');
            return;
        }

        if (!livro.disponivel) {
            mensagens.erro('Este livro não está disponível para agendamento.');
            return;
        }

        if (typeof sistemaBibliotecaFisica !== 'undefined') {
            sistemaBibliotecaFisica.agendarRetirada(livroId);
        } else {
            mensagens.info('Sistema de agendamento será implementado em breve.');
        }
    }

    adicionarAosFavoritos(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        const usuario = sistemaAuth.getUsuarioLogado();

        if (!usuario || usuario.tipo === 'convidado') {
            mensagens.erro('Você precisa estar logado para adicionar livros aos favoritos.');
            sistemaAuth.mostrarLogin();
            return;
        }

        let favoritos = ArmazenamentoLocal.carregar('biblioteca_favoritos') || [];
        
        // Verificar se já está nos favoritos
        const jaFavoritado = favoritos.find(f => f.livroId === livroId && f.usuarioId === usuario.id);
        
        if (jaFavoritado) {
            mensagens.info('Este livro já está nos seus favoritos.');
            return;
        }

        const novoFavorito = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            dataAdicao: new Date().toISOString()
        };

        favoritos.push(novoFavorito);
        ArmazenamentoLocal.salvar('biblioteca_favoritos', favoritos);

        mensagens.sucesso(`"${livro.titulo}" foi adicionado aos seus favoritos! 💖`);
    }

    notificarDisponibilidade(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        const usuario = sistemaAuth.getUsuarioLogado();

        if (!usuario) {
            mensagens.erro('Você precisa estar logado para receber notificações.');
            sistemaAuth.mostrarLogin();
            return;
        }

        let notificacoes = ArmazenamentoLocal.carregar('biblioteca_notificacoes_disponibilidade') || [];
        
        const notificacaoExistente = notificacoes.find(n => 
            n.livroId === livroId && n.usuarioId === usuario.id
        );

        if (notificacaoExistente) {
            mensagens.info('Você já será notificado quando este livro estiver disponível.');
            return;
        }

        const novaNotificacao = {
            id: GeradorID.gerar(),
            livroId: livroId,
            usuarioId: usuario.id,
            dataSolicitacao: new Date().toISOString(),
            notificado: false
        };

        notificacoes.push(novaNotificacao);
        ArmazenamentoLocal.salvar('biblioteca_notificacoes_disponibilidade', notificacoes);

        mensagens.sucesso(`Você será notificado quando "${livro.titulo}" estiver disponível! 🔔`);
    }

    // MÉTODOS UTILITÁRIOS
    limparFiltros() {
        document.getElementById('campoPesquisa').value = '';
        document.getElementById('filtroGenero').value = '';
        document.getElementById('filtroAno').value = '';
        document.getElementById('filtroDisponibilidade').value = '';
        document.getElementById('filtroIdade').value = '';
        document.getElementById('filtroOrdenacao').value = 'relevancia';
        
        this.aplicarFiltros();
        mensagens.info('Filtros limpos com sucesso!');
    }

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

    getLivrosDestaque() {
        return this.livros.filter(livro => livro.destaque);
    }

    // 🔧 MÉTODO PARA ADICIONAR LIVRO VIA FORMULÁRIO
    adicionarLivroFormulario(event) {
        event.preventDefault();
        
        console.log('📝 Iniciando processo de adicionar livro...');
        
        // Coletar dados do formulário
        const dadosLivro = {
            titulo: document.getElementById('tituloLivro').value.trim(),
            autor: document.getElementById('autorLivro').value.trim(),
            genero: document.getElementById('generoLivro').value,
            ano: parseInt(document.getElementById('anoLivro').value),
            editora: document.getElementById('editoraLivro').value.trim(),
            paginas: parseInt(document.getElementById('paginasLivro').value) || 0,
            descricao: document.getElementById('descricaoLivro').value.trim(),
            imagem: document.getElementById('imagemLivro').value.trim(),
            estoque: parseInt(document.getElementById('estoqueLivro').value),
            restricaoIdade: parseInt(document.getElementById('restricaoIdade').value),
            tags: document.getElementById('tagsLivro').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            valorEmprestimo: parseFloat(document.getElementById('valorEmprestimo').value) || 0,
            taxaJuros: parseFloat(document.getElementById('taxaJuros').value) || 0.5,
            prazoEmprestimo: parseInt(document.getElementById('prazoEmprestimo').value) || 14,
            destaque: false // Por padrão, não é destaque
        };

        console.log('📖 Dados coletados:', dadosLivro);

        // Validação básica
        if (!dadosLivro.titulo || !dadosLivro.autor || !dadosLivro.genero || !dadosLivro.ano) {
            mensagens.erro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (dadosLivro.ano < 1000 || dadosLivro.ano > new Date().getFullYear()) {
            mensagens.erro('Ano de publicação inválido.');
            return;
        }

        if (dadosLivro.estoque < 0) {
            mensagens.erro('Estoque não pode ser negativo.');
            return;
        }

        // Adicionar livro
        if (this.adicionarLivro(dadosLivro)) {
            mensagens.sucesso(`Livro "${dadosLivro.titulo}" adicionado com sucesso!`);
            
            // Limpar formulário
            this.limparFormularioLivro();
            
            // Voltar para lista de livros
            if (typeof sistemaAdmin !== 'undefined') {
                sistemaAdmin.abrirPainelAdmin('livros');
            }
        }
    }

    // 🔧 MÉTODO CORRIGIDO PARA ADICIONAR LIVRO
    adicionarLivro(novoLivro) {
        console.log('➕ Adicionando novo livro:', novoLivro.titulo);
        
        if (!this.validarLivro(novoLivro)) {
            return false;
        }

        // Imagem padrão se não for fornecida
        const imagensPadrao = [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&w=400&h=500&fit=crop'
        ];

        const livroCompleto = {
            ...novoLivro,
            id: GeradorID.gerar(),
            dataCadastro: new Date().toISOString(),
            avaliacao: 0,
            totalAvaliacoes: 0,
            vezesEmprestado: 0,
            restricaoIdade: novoLivro.restricaoIdade || 0,
            tags: novoLivro.tags || [],
            destaque: novoLivro.destaque || false,
            disponivel: novoLivro.estoque > 0,
            imagem: novoLivro.imagem || imagensPadrao[Math.floor(Math.random() * imagensPadrao.length)]
        };

        console.log('✅ Livro completo:', livroCompleto);

        this.livros.push(livroCompleto);
        this.salvarLivros();

        sistemaNotificacoes.adicionar(
            'Novo Livro Adicionado',
            `"${livroCompleto.titulo}" foi adicionado ao catálogo.`,
            'sucesso'
        );

        // Atualizar interface
        this.carregarDestaques();
        this.aplicarFiltros();

        return true;
    }

    // 🔧 MÉTODO PARA LIMPAR FORMULÁRIO
    limparFormularioLivro() {
        const form = document.getElementById('formAdicionarLivro');
        if (form) {
            form.reset();
            document.getElementById('estoqueLivro').value = 1;
            document.getElementById('valorEmprestimo').value = 0;
            document.getElementById('taxaJuros').value = 0.5;
            document.getElementById('prazoEmprestimo').value = 14;
            document.getElementById('restricaoIdade').value = 0;
        }
    }

    // ⭐ MÉTODO PARA ALTERNAR DESTAQUE
    alternarDestaque(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (livro) {
            livro.destaque = !livro.destaque;
            this.salvarLivros();
            
            mensagens.sucesso(`Livro ${livro.destaque ? 'adicionado aos' : 'removido dos'} destaques!`);
            this.carregarDestaques();
            
            if (typeof sistemaAdmin !== 'undefined') {
                sistemaAdmin.carregarTabelaLivros();
            }
        }
    }

    // 📊 MÉTODOS DE CONTROLE DE ESTOQUE
    atualizarEstoque(livroId, novaQuantidade) {
        const livro = this.livros.find(l => l.id === livroId);
        if (livro) {
            const estoqueAnterior = livro.estoque;
            livro.estoque = Math.max(0, novaQuantidade);
            livro.disponivel = livro.estoque > 0;
            
            this.salvarLivros();
            
            // Notificar se estoque ficou baixo
            if (estoqueAnterior > 2 && livro.estoque <= 2 && livro.estoque > 0) {
                sistemaNotificacoes.adicionar(
                    'Estoque Baixo',
                    `"${livro.titulo}" está com estoque baixo (${livro.estoque} unidades).`,
                    'aviso'
                );
            }
            
            // Notificar se ficou disponível
            if (estoqueAnterior === 0 && livro.estoque > 0) {
                this.notificarDisponibilidadeEstoque(livroId);
            }
            
            return true;
        }
        return false;
    }

    notificarDisponibilidadeEstoque(livroId) {
        const notificacoes = ArmazenamentoLocal.carregar('biblioteca_notificacoes_disponibilidade') || [];
        const notificacoesLivro = notificacoes.filter(n => n.livroId === livroId && !n.notificado);
        
        notificacoesLivro.forEach(notificacao => {
            sistemaNotificacoes.adicionar(
                'Livro Disponível',
                `"${this.livros.find(l => l.id === livroId)?.titulo}" está disponível para empréstimo!`,
                'sucesso'
            );
            notificacao.notificado = true;
        });
        
        // Remover notificações processadas
        ArmazenamentoLocal.salvar('biblioteca_notificacoes_disponibilidade', 
            notificacoes.filter(n => !n.notificado)
        );
    }

    registrarEmprestimo(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (livro && livro.estoque > 0) {
            livro.estoque--;
            livro.vezesEmprestado++;
            livro.disponivel = livro.estoque > 0;
            this.salvarLivros();
            return true;
        }
        return false;
    }

    registrarDevolucao(livroId) {
        const livro = this.livros.find(l => l.id === livroId);
        if (livro) {
            livro.estoque++;
            livro.disponivel = true;
            this.salvarLivros();
            return true;
        }
        return false;
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

    salvarLivros() {
        ArmazenamentoLocal.salvar('biblioteca_livros', this.livros);
    }

    // Estatísticas para dashboard
    getEstatisticas() {
        return {
            totalLivros: this.getTotalLivros(),
            livrosDisponiveis: this.getLivrosDisponiveis(),
            livrosIndisponiveis: this.getTotalLivros() - this.getLivrosDisponiveis(),
            livrosPorGenero: this.getLivrosPorGenero(),
            livrosDestaque: this.getLivrosDestaque().length,
            totalEmprestimos: this.livros.reduce((total, livro) => total + livro.vezesEmprestado, 0)
        };
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
                <div class="sugestao-conteudo">
                    <div class="sugestao-termo">${sugestao.termo}</div>
                    <div class="sugestao-tipo">${sugestao.tipo}</div>
                </div>
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

// Conectar formulário de adicionar livro
document.addEventListener('DOMContentLoaded', function() {
    const formAdicionarLivro = document.getElementById('formAdicionarLivro');
    if (formAdicionarLivro) {
        formAdicionarLivro.addEventListener('submit', function(e) {
            sistemaLivros.adicionarLivroFormulario(e);
        });
    }
});

// Funções globais
function alterarTamanhoExibicao(tamanho) {
    sistemaLivros.tamanhoExibicao = tamanho;
    
    // Atualizar botões ativos
    document.querySelectorAll('.botao-tamanho').forEach(botao => {
        botao.classList.remove('ativo');
    });
    const botaoAtivo = document.querySelector(`.botao-tamanho[data-tamanho="${tamanho}"]`);
    if (botaoAtivo) {
        botaoAtivo.classList.add('ativo');
    }
    
    sistemaLivros.atualizarGradeLivros();
}

function realizarPesquisa() {
    sistemaLivros.aplicarFiltros();
}

function aplicarFiltros() {
    sistemaLivros.aplicarFiltros();
}

function limparFiltros() {
    sistemaLivros.limparFiltros();
}

// Exportar para uso global
window.sistemaLivros = sistemaLivros;
window.buscaInteligente = buscaInteligente;
window.alterarTamanhoExibicao = alterarTamanhoExibicao;
window.realizarPesquisa = realizarPesquisa;
window.aplicarFiltros = aplicarFiltros;
window.limparFiltros = limparFiltros;

console.log('📚 Sistema de Livros carregado com sucesso!');
console.log('🔍 Busca Inteligente ativa');