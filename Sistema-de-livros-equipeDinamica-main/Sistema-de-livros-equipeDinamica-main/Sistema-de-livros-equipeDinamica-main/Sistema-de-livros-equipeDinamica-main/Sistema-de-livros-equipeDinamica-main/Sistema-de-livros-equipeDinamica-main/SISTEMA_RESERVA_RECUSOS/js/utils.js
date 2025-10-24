// ========== SISTEMA DE ARMAZENAMENTO LOCAL ==========
class ArmazenamentoLocal {
    static salvar(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    static carregar(chave) {
        try {
            const dados = localStorage.getItem(chave);
            return dados ? JSON.parse(dados) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    static remover(chave) {
        try {
            localStorage.removeItem(chave);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    static limpar() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    static obterEspacoUtilizado() {
        let total = 0;
        for (let chave in localStorage) {
            if (localStorage.hasOwnProperty(chave)) {
                total += localStorage[chave].length;
            }
        }
        return total;
    }

    static obterEspacoDisponivel() {
        // Estimativa - navegadores geralmente permitem 5-10MB
        return 5 * 1024 * 1024; // 5MB em bytes
    }
}

// ========== GERADOR DE IDS ÚNICOS ==========
class GeradorID {
    static gerar() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    static gerarISBN() {
        // Gerar ISBN fictício no formato XXX-XX-XXXXX-XX-X
        const partes = [
            Math.floor(100 + Math.random() * 900), // 100-999
            Math.floor(10 + Math.random() * 90),   // 10-99
            Math.floor(10000 + Math.random() * 90000), // 10000-99999
            Math.floor(10 + Math.random() * 90),   // 10-99
            Math.floor(1 + Math.random() * 9)      // 1-9
        ];
        return partes.join('-');
    }

    static gerarCodigoBarras() {
        // Gerar código de barras fictício de 13 dígitos
        let codigo = '';
        for (let i = 0; i < 13; i++) {
            codigo += Math.floor(Math.random() * 10);
        }
        return codigo;
    }
}

// ========== VALIDAÇÕES AVANÇADAS ==========
class Validacoes {
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarSenha(senha) {
        // Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(senha);
    }

    static calcularForcaSenha(senha) {
        let forca = 0;
        
        // Comprimento
        if (senha.length >= 8) forca += 1;
        if (senha.length >= 12) forca += 1;
        
        // Complexidade
        if (/[a-z]/.test(senha)) forca += 1;
        if (/[A-Z]/.test(senha)) forca += 1;
        if (/[0-9]/.test(senha)) forca += 1;
        if (/[^A-Za-z0-9]/.test(senha)) forca += 1;
        
        return Math.min(forca, 5); // Máximo 5
    }

    static obterTextoForcaSenha(forca) {
        const textos = [
            'Muito fraca',
            'Fraca', 
            'Regular',
            'Forte',
            'Muito forte',
            'Excelente'
        ];
        return textos[forca] || 'Muito fraca';
    }

    static validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let resto = soma % 11;
        let digito1 = resto < 2 ? 0 : 11 - resto;
        
        if (digito1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        resto = soma % 11;
        let digito2 = resto < 2 ? 0 : 11 - resto;
        
        return digito2 === parseInt(cpf.charAt(10));
    }

    static validarTelefone(telefone) {
        const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        return regex.test(telefone);
    }

    static validarData(data) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(data)) return false;
        
        const date = new Date(data);
        return date instanceof Date && !isNaN(date);
    }

    static validarURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static validarISBN(isbn) {
        // Validação básica de ISBN (10 ou 13 dígitos)
        const regex = /^(?:\d{9}[\dX]|\d{13})$/;
        return regex.test(isbn.replace(/[- ]/g, ''));
    }
}

// ========== FORMATADORES ==========
class Formatadores {
    static formatarMoeda(valor, moeda = 'BRL') {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: moeda
        }).format(valor);
    }

    static formatarNumero(numero) {
        return new Intl.NumberFormat('pt-BR').format(numero);
    }

    static formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    static formatarDataHora(data) {
        return new Date(data).toLocaleString('pt-BR');
    }

    static formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    static limitarTexto(texto, limite, sufixo = '...') {
        if (texto.length <= limite) return texto;
        return texto.substr(0, limite).trim() + sufixo;
    }

    static capitalizarTexto(texto) {
        return texto.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    static formatarBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static gerarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
}

// ========== UTILITÁRIOS DE DATA E HORA ==========
class UtilitariosData {
    static obterDataAtual() {
        return new Date().toISOString().split('T')[0];
    }

    static obterHoraAtual() {
        return new Date().toLocaleTimeString('pt-BR');
    }

    static obterDataHoraAtual() {
        return new Date().toISOString();
    }

    static formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    static formatarDataCompleta(data) {
        const opcoes = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    }

    static formatarDataRelativa(data) {
        const agora = new Date();
        const dataObj = new Date(data);
        const diffMs = agora - dataObj;
        const diffSegundos = Math.floor(diffMs / 1000);
        const diffMinutos = Math.floor(diffSegundos / 60);
        const diffHoras = Math.floor(diffMinutos / 60);
        const diffDias = Math.floor(diffHoras / 24);

        if (diffSegundos < 60) {
            return 'agora há pouco';
        } else if (diffMinutos < 60) {
            return `há ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
        } else if (diffHoras < 24) {
            return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
        } else if (diffDias < 7) {
            return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
        } else {
            return this.formatarData(data);
        }
    }

    static calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        
        if (mesAtual < mesNascimento || 
            (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }

    static adicionarDias(data, dias) {
        const resultado = new Date(data);
        resultado.setDate(resultado.getDate() + dias);
        return resultado;
    }

    static calcularDiferencaDias(data1, data2) {
        const umDia = 24 * 60 * 60 * 1000;
        const primeiraData = new Date(data1);
        const segundaData = new Date(data2);
        
        return Math.round(Math.abs((primeiraData - segundaData) / umDia));
    }

    static ehFimDeSemana(data) {
        const diaSemana = new Date(data).getDay();
        return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
    }
}

// ========== SISTEMA DE MENSAGENS TOAST UNIFICADO ==========
class SistemaMensagens {
    constructor() {
        this.container = null;
        this.criarContainer();
    }

    criarContainer() {
        // Verificar se já existe um container
        this.container = document.getElementById('sistema-mensagens');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'sistema-mensagens';
            this.container.className = 'sistema-mensagens';
            document.body.appendChild(this.container);
        }
    }

    mostrar(mensagem, tipo = 'info', duracao = 5000) {
        const id = 'msg-' + Date.now();
        const icones = {
            sucesso: 'fas fa-check-circle',
            erro: 'fas fa-exclamation-circle',
            aviso: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const mensagemHTML = `
            <div class="mensagem mensagem-${tipo}" id="${id}">
                <div class="mensagem-icon">
                    <i class="${icones[tipo]}"></i>
                </div>
                <div class="mensagem-conteudo">
                    <div class="mensagem-texto">${mensagem}</div>
                </div>
                <button class="mensagem-fechar" onclick="mensagens.fechar('${id}')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="mensagem-progresso"></div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', mensagemHTML);

        const elemento = document.getElementById(id);
        const progresso = elemento.querySelector('.mensagem-progresso');

        // Animação de entrada
        setTimeout(() => elemento.classList.add('mostrar'), 10);

        // Barra de progresso
        if (duracao > 0) {
            progresso.style.animationDuration = (duracao / 1000) + 's';
            
            setTimeout(() => {
                this.fechar(id);
            }, duracao);
        }

        return id;
    }

    fechar(id) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.classList.remove('mostrar');
            setTimeout(() => {
                if (elemento.parentNode) {
                    elemento.parentNode.removeChild(elemento);
                }
            }, 300);
        }
    }

    sucesso(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'sucesso', duracao);
    }

    erro(mensagem, duracao = 7000) {
        return this.mostrar(mensagem, 'erro', duracao);
    }

    aviso(mensagem, duracao = 6000) {
        return this.mostrar(mensagem, 'aviso', duracao);
    }

    info(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'info', duracao);
    }

    limparTodas() {
        const mensagens = this.container.querySelectorAll('.mensagem');
        mensagens.forEach(msg => {
            msg.classList.remove('mostrar');
            setTimeout(() => {
                if (msg.parentNode) {
                    msg.parentNode.removeChild(msg);
                }
            }, 300);
        });
    }
}

// ========== SISTEMA DE CARREGAMENTO ==========
class SistemaCarregamento {
    constructor() {
        this.overlay = null;
        this.criarOverlay();
    }

    criarOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'loading-overlay';
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <div class="loading-text">Carregando...</div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    mostrar(texto = 'Carregando...') {
        this.overlay.querySelector('.loading-text').textContent = texto;
        this.overlay.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }

    esconder() {
        this.overlay.classList.remove('ativo');
        document.body.style.overflow = '';
    }

    async executarComLoading(acao, texto = 'Carregando...') {
        this.mostrar(texto);
        try {
            const resultado = await acao();
            return resultado;
        } finally {
            this.esconder();
        }
    }
}

// ========== SISTEMA DE MODAIS ==========
class SistemaModal {
    constructor() {
        this.modalAtual = null;
    }

    criar(titulo, conteudo, opcoes = {}) {
        const id = 'modal-' + Date.now();
        const {
            tamanho = 'medio', // pequeno, medio, grande, fullscreen
            fecharClickFora = true,
            fecharEsc = true,
            mostrarFechar = true,
            acaoFechar = null
        } = opcoes;

        const modalHTML = `
            <div class="modal-overlay" id="${id}">
                <div class="modal-container modal-${tamanho}">
                    <div class="modal-cabecalho">
                        <h3 class="modal-titulo">${titulo}</h3>
                        ${mostrarFechar ? `
                            <button class="modal-fechar" onclick="sistemaModal.fechar('${id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="modal-conteudo">
                        ${conteudo}
                    </div>
                    ${opcoes.rodape ? `
                        <div class="modal-rodape">
                            ${opcoes.rodape}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById(id);

        // Configurar eventos
        if (fecharClickFora) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fechar(id);
                }
            });
        }

        if (fecharEsc) {
            const fecharComEsc = (e) => {
                if (e.key === 'Escape') {
                    this.fechar(id);
                }
            };
            modal._fecharEsc = fecharComEsc;
            document.addEventListener('keydown', fecharComEsc);
        }

        if (acaoFechar) {
            modal._acaoFechar = acaoFechar;
        }

        // Animação de entrada
        setTimeout(() => modal.classList.add('ativo'), 10);

        this.modalAtual = id;
        return id;
    }

    fechar(id = null) {
        const modalId = id || this.modalAtual;
        if (!modalId) return;

        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Executar ação de fechamento se existir
        if (modal._acaoFechar) {
            modal._acaoFechar();
        }

        // Remover evento ESC
        if (modal._fecharEsc) {
            document.removeEventListener('keydown', modal._fecharEsc);
        }

        // Animação de saída
        modal.classList.remove('ativo');
        setTimeout(() => modal.remove(), 300);

        if (this.modalAtual === modalId) {
            this.modalAtual = null;
        }
    }

    confirmar(mensagem, acaoConfirmar, acaoCancelar = null) {
        const conteudo = `
            <div class="modal-confirmacao">
                <div class="confirmacao-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="confirmacao-mensagem">${mensagem}</div>
            </div>
        `;

        const rodape = `
            <button class="botao botao-secundario" onclick="sistemaModal.fechar()">
                Cancelar
            </button>
            <button class="botao botao-perigo" onclick="sistemaModal.fechar(); (${acaoConfirmar})()">
                Confirmar
            </button>
        `;

        return this.criar('Confirmação', conteudo, {
            tamanho: 'pequeno',
            rodape: rodape,
            acaoFechar: acaoCancelar
        });
    }

    alerta(mensagem, tipo = 'info') {
        const icones = {
            info: 'fas fa-info-circle',
            sucesso: 'fas fa-check-circle',
            erro: 'fas fa-exclamation-circle',
            aviso: 'fas fa-exclamation-triangle'
        };

        const conteudo = `
            <div class="modal-alerta modal-alerta-${tipo}">
                <div class="alerta-icon">
                    <i class="${icones[tipo]}"></i>
                </div>
                <div class="alerta-mensagem">${mensagem}</div>
            </div>
        `;

        const rodape = `
            <button class="botao botao-primario" onclick="sistemaModal.fechar()">
                OK
            </button>
        `;

        return this.criar(this.obterTituloAlerta(tipo), conteudo, {
            tamanho: 'pequeno',
            rodape: rodape
        });
    }

    obterTituloAlerta(tipo) {
        const titulos = {
            info: 'Informação',
            sucesso: 'Sucesso',
            erro: 'Erro',
            aviso: 'Aviso'
        };
        return titulos[tipo] || 'Alerta';
    }
}

// ========== UTILITÁRIOS DE ARRAYS E OBJETOS ==========
class UtilitariosArray {
    static ordenarPorPropriedade(array, propriedade, ordem = 'asc') {
        return array.sort((a, b) => {
            let valorA = a[propriedade];
            let valorB = b[propriedade];

            // Converter para string se for número para comparação consistente
            if (typeof valorA === 'number' && typeof valorB === 'number') {
                return ordem === 'asc' ? valorA - valorB : valorB - valorA;
            }

            valorA = String(valorA).toLowerCase();
            valorB = String(valorB).toLowerCase();

            if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
            if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
            return 0;
        });
    }

    static filtrarPorTermo(array, termo, propriedades) {
        if (!termo) return array;

        termo = termo.toLowerCase();
        return array.filter(item => {
            return propriedades.some(prop => {
                const valor = String(item[prop] || '').toLowerCase();
                return valor.includes(termo);
            });
        });
    }

    static agruparPor(array, propriedade) {
        return array.reduce((grupos, item) => {
            const chave = item[propriedade];
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(item);
            return grupos;
        }, {});
    }

    static removerDuplicatas(array, propriedade = null) {
        if (propriedade) {
            const valoresVistos = new Set();
            return array.filter(item => {
                const valor = item[propriedade];
                if (valoresVistos.has(valor)) {
                    return false;
                }
                valoresVistos.add(valor);
                return true;
            });
        } else {
            return [...new Set(array)];
        }
    }

    static embaralhar(array) {
        const novoArray = [...array];
        for (let i = novoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
        }
        return novoArray;
    }

    static obterAleatorio(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// ========== SISTEMA DE PERFORMANCE ==========
class SistemaPerformance {
    static temporizadores = new Map();

    static iniciarTempo(nome) {
        this.temporizadores.set(nome, {
            inicio: performance.now(),
            fim: null,
            duracao: null
        });
    }

    static pararTempo(nome) {
        const temporizador = this.temporizadores.get(nome);
        if (temporizador) {
            temporizador.fim = performance.now();
            temporizador.duracao = temporizador.fim - temporizador.inicio;
            return temporizador.duracao;
        }
        return null;
    }

    static obterTempo(nome) {
        const temporizador = this.temporizadores.get(nome);
        return temporizador ? temporizador.duracao : null;
    }

    static medirPerformance(funcao, nome) {
        this.iniciarTempo(nome);
        const resultado = funcao();
        const duracao = this.pararTempo(nome);
        console.log(`⏱️ ${nome} executou em ${duracao.toFixed(2)}ms`);
        return resultado;
    }
}

// ========== INICIALIZAÇÃO DOS SISTEMAS ==========
const mensagens = new SistemaMensagens();
const sistemaCarregamento = new SistemaCarregamento();
const sistemaModal = new SistemaModal();

// Exportar para uso global
window.mensagens = mensagens;
window.sistemaCarregamento = sistemaCarregamento;
window.sistemaModal = sistemaModal;
window.ArmazenamentoLocal = ArmazenamentoLocal;
window.GeradorID = GeradorID;
window.Validacoes = Validacoes;
window.Formatadores = Formatadores;
window.UtilitariosData = UtilitariosData;
window.UtilitariosArray = UtilitariosArray;
window.SistemaPerformance = SistemaPerformance;

console.log('🎯 Sistema de Utilitários Unificado inicializado com sucesso!');