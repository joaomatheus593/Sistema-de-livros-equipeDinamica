// Sistema de Mensagens Toast Melhorado
class SistemaMensagens {
    constructor() {
        this.container = document.getElementById('sistemaMensagens');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'sistemaMensagens';
            this.container.className = 'sistema-mensagens';
            document.body.appendChild(this.container);
        }
        this.contador = 0;
    }

    mostrar(mensagem, tipo = 'info', duracao = 5000) {
        this.contador++;
        const mensagemId = `mensagem-${this.contador}`;
        
        const mensagemElement = document.createElement('div');
        mensagemElement.id = mensagemId;
        mensagemElement.className = `mensagem ${tipo}`;
        
        const icones = {
            'sucesso': 'fas fa-check-circle',
            'erro': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle',
            'aviso': 'fas fa-exclamation-triangle'
        };

        mensagemElement.innerHTML = `
            <i class="${icones[tipo] || icones.info}"></i>
            <span>${mensagem}</span>
            <button class="fechar-mensagem" onclick="mensagens.fechar('${mensagemId}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(mensagemElement);

        // Animação de entrada
        setTimeout(() => {
            mensagemElement.style.animation = 'slideInRight 0.3s ease-out';
        }, 100);

        // Auto-remover após a duração
        if (duracao > 0) {
            setTimeout(() => {
                this.fechar(mensagemId);
            }, duracao);
        }

        return mensagemId;
    }

    fechar(mensagemId) {
        const mensagemElement = document.getElementById(mensagemId);
        if (mensagemElement) {
            mensagemElement.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (mensagemElement.parentNode) {
                    mensagemElement.parentNode.removeChild(mensagemElement);
                }
            }, 300);
        }
    }

    sucesso(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'sucesso', duracao);
    }

    erro(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'erro', duracao);
    }

    info(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'info', duracao);
    }

    aviso(mensagem, duracao = 5000) {
        return this.mostrar(mensagem, 'aviso', duracao);
    }

    loading(mensagem = 'Carregando...') {
        const loadingId = this.mostrar(`
            <div class="loading-mensagem">
                <i class="fas fa-spinner carregando"></i>
                <span>${mensagem}</span>
            </div>
        `, 'info', 0);
        
        return loadingId;
    }

    fecharLoading(loadingId) {
        this.fechar(loadingId);
    }
}

// Instância global do sistema de mensagens
const mensagens = new SistemaMensagens();

// Utilitários de Data Melhorados
class UtilitariosData {
    static formatarData(data, incluirHora = false) {
        const dataObj = new Date(data);
        const opcoes = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        
        if (incluirHora) {
            opcoes.hour = '2-digit';
            opcoes.minute = '2-digit';
        }
        
        return dataObj.toLocaleDateString('pt-BR', opcoes);
    }

    static formatarDataExtenso(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static calcularDiferencaDias(data1, data2) {
        const umDia = 24 * 60 * 60 * 1000;
        const primeiraData = new Date(data1);
        const segundaData = new Date(data2);
        return Math.round(Math.abs((primeiraData - segundaData) / umDia));
    }

    static adicionarDias(data, dias) {
        const resultado = new Date(data);
        resultado.setDate(resultado.getDate() + dias);
        return resultado;
    }

    static adicionarMeses(data, meses) {
        const resultado = new Date(data);
        resultado.setMonth(resultado.getMonth() + meses);
        return resultado;
    }

    static ehFuturo(data) {
        return new Date(data) > new Date();
    }

    static ehPassado(data) {
        return new Date(data) < new Date();
    }

    static obterDataAtual() {
        return new Date().toISOString().split('T')[0];
    }

    static obterHoraAtual() {
        return new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static compararDatas(data1, data2) {
        const d1 = new Date(data1);
        const d2 = new Date(data2);
        return d1.getTime() - d2.getTime();
    }
}

// Utilitários de localStorage Melhorados
class ArmazenamentoLocal {
    static salvar(chave, dados) {
        try {
            // Compactar dados grandes
            let dadosParaSalvar = dados;
            if (typeof dados === 'object' && dados !== null) {
                dadosParaSalvar = JSON.stringify(dados);
            }
            
            localStorage.setItem(chave, dadosParaSalvar);
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('localStorageAlterado', {
                detail: { chave, dados }
            }));
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            
            // Tentar limpar espaço se estiver cheio
            if (error.name === 'QuotaExceededError') {
                mensagens.erro('Armazenamento cheio. Limpe alguns dados ou faça backup.');
                this.limparDadosTemporarios();
            }
            
            return false;
        }
    }

    static carregar(chave) {
        try {
            const dados = localStorage.getItem(chave);
            if (!dados) return null;
            
            // Tentar parsear como JSON, se falhar retornar como string
            try {
                return JSON.parse(dados);
            } catch {
                return dados;
            }
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    static remover(chave) {
        try {
            localStorage.removeItem(chave);
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('localStorageAlterado', {
                detail: { chave, dados: null }
            }));
            
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    static limpar() {
        try {
            // Manter dados essenciais se necessário
            const dadosEssenciais = {
                tema: localStorage.getItem('tema'),
                usuario_logado: localStorage.getItem('usuario_logado')
            };
            
            localStorage.clear();
            
            // Restaurar dados essenciais
            if (dadosEssenciais.tema) {
                localStorage.setItem('tema', dadosEssenciais.tema);
            }
            if (dadosEssenciais.usuario_logado) {
                localStorage.setItem('usuario_logado', dadosEssenciais.usuario_logado);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    static limparDadosTemporarios() {
        const chavesParaManter = [
            'biblioteca_livros',
            'biblioteca_usuarios',
            'biblioteca_emprestimos',
            'usuario_logado',
            'tema'
        ];
        
        const todasChaves = Object.keys(localStorage);
        const chavesParaRemover = todasChaves.filter(chave => 
            !chavesParaManter.includes(chave)
        );
        
        chavesParaRemover.forEach(chave => {
            localStorage.removeItem(chave);
        });
        
        return chavesParaRemover.length;
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

    static obterTodasChaves() {
        return Object.keys(localStorage);
    }
}

// Validações Melhoradas
class Validacoes {
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarSenha(senha) {
        // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(senha);
    }

    static calcularForcaSenha(senha) {
        let forca = 0;
        
        if (senha.length >= 8) forca++;
        if (senha.length >= 12) forca++;
        if (/[a-z]/.test(senha)) forca++;
        if (/[A-Z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[^A-Za-z0-9]/.test(senha)) forca++;
        
        return Math.min(forca, 5); // Máximo 5
    }

    static obterTextoForcaSenha(forca) {
        const textos = [
            'Muito fraca',
            'Fraca', 
            'Moderada',
            'Forte',
            'Muito forte',
            'Excelente'
        ];
        return textos[forca] || 'Muito fraca';
    }

    static validarISBN(isbn) {
        // Validação básica de ISBN (10 ou 13 dígitos)
        const regex = /^(?:\d{9}[\dX]|\d{13})$/;
        return regex.test(isbn.replace(/[- ]/g, ''));
    }

    static validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    static validarTelefone(telefone) {
        const regex = /^(\+55)?[\s]?\(?(\d{2})\)?[\s-]?(\d{4,5})[\s-]?(\d{4})$/;
        return regex.test(telefone);
    }

    static validarURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static validarNumeroPositivo(numero) {
        return !isNaN(numero) && numero >= 0;
    }

    static validarData(data) {
        return !isNaN(Date.parse(data));
    }

    static sanitizarHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    static validarTamanhoTexto(texto, min = 0, max = Infinity) {
        return texto.length >= min && texto.length <= max;
    }
}

// Gerador de IDs Únicos Melhorado
class GeradorID {
    static gerar() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `${timestamp}-${random}`;
    }

    static gerarISBN() {
        // Gera um ISBN-13 fictício para demonstração
        const parte1 = '978'; // Prefixo para livros
        const parte2 = Math.floor(10 + Math.random() * 90); // Grupo de registro
        const parte3 = Math.floor(1000 + Math.random() * 9000); // Registrante
        const parte4 = Math.floor(1000 + Math.random() * 9000); // Publicação
        
        const isbnSemDigito = `${parte1}${parte2}${parte3}${parte4}`;
        const digito = this.calcularDigitoISBN13(isbnSemDigito);
        
        return `${parte1}-${parte2}-${parte3}-${parte4}-${digito}`;
    }

    static calcularDigitoISBN13(isbn12) {
        let soma = 0;
        for (let i = 0; i < 12; i++) {
            const digito = parseInt(isbn12[i]);
            soma += digito * (i % 2 === 0 ? 1 : 3);
        }
        const resto = soma % 10;
        return resto === 0 ? 0 : 10 - resto;
    }

    static gerarCodigoBarras() {
        return Math.random().toString(36).substr(2, 12).toUpperCase();
    }

    static gerarSenha(tamanho = 12) {
        const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const minusculas = 'abcdefghijklmnopqrstuvwxyz';
        const numeros = '0123456789';
        const especiais = '@$!%*?&';
        
        let senha = '';
        senha += maiusculas[Math.floor(Math.random() * maiusculas.length)];
        senha += minusculas[Math.floor(Math.random() * minusculas.length)];
        senha += numeros[Math.floor(Math.random() * numeros.length)];
        senha += especiais[Math.floor(Math.random() * especiais.length)];
        
        const todosCaracteres = maiusculas + minusculas + numeros + especiais;
        for (let i = 4; i < tamanho; i++) {
            senha += todosCaracteres[Math.floor(Math.random() * todosCaracteres.length)];
        }
        
        return senha.split('').sort(() => 0.5 - Math.random()).join('');
    }
}

// Utilitários de Formatação Melhorados
class Formatadores {
    static formatarMoeda(valor, moeda = 'BRL') {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: moeda
        }).format(valor);
    }

    static formatarNumero(numero, casasDecimais = 0) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        }).format(numero);
    }

    static formatarPorcentagem(valor, casasDecimais = 1) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        }).format(valor / 100);
    }

    static limitarTexto(texto, limite, sufixo = '...') {
        if (texto.length <= limite) return texto;
        return texto.substr(0, limite - sufixo.length) + sufixo;
    }

    static capitalizarTexto(texto) {
        return texto.replace(/\b\w/g, l => l.toUpperCase());
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

    static formatarDataInput(data) {
        // Converte de YYYY-MM-DD para DD/MM/YYYY
        if (!data) return '';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    static converterParaDataInput(data) {
        // Converte de DD/MM/YYYY para YYYY-MM-DD
        if (!data) return '';
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    static obterIniciais(nome) {
        return nome
            .split(' ')
            .map(palavra => palavra[0])
            .join('')
            .toUpperCase()
            .substr(0, 2);
    }

    static formatarTempoDecorrido(data) {
        const agora = new Date();
        const dataPassada = new Date(data);
        const diferenca = agora - dataPassada;
        
        const segundos = Math.floor(diferenca / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
        
        if (dias > 0) return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
        if (horas > 0) return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
        if (minutos > 0) return `${minutos} minuto${minutos > 1 ? 's' : ''} atrás`;
        return 'Agora mesmo';
    }
}

// Utilitários de Performance
class Performance {
    static temporizadores = new Map();

    static iniciar(nome) {
        this.temporizadores.set(nome, performance.now());
    }

    static parar(nome) {
        const inicio = this.temporizadores.get(nome);
        if (inicio) {
            const fim = performance.now();
            this.temporizadores.delete(nome);
            return fim - inicio;
        }
        return 0;
    }

    static medir(funcao, nome) {
        this.iniciar(nome);
        const resultado = funcao();
        const tempo = this.parar(nome);
        console.log(`${nome} executou em ${tempo.toFixed(2)}ms`);
        return resultado;
    }
}

// Utilitários de Arrays e Objetos
class ManipuladoresDados {
    static ordenarPorPropriedade(array, propriedade, ordem = 'asc') {
        return array.sort((a, b) => {
            let valorA = a[propriedade];
            let valorB = b[propriedade];
            
            // Converter para número se possível
            if (!isNaN(valorA) && !isNaN(valorB)) {
                valorA = parseFloat(valorA);
                valorB = parseFloat(valorB);
            }
            
            if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
            if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
            return 0;
        });
    }

    static filtrarPorTermo(array, termo, propriedades) {
        if (!termo) return array;
        
        const termoLower = termo.toLowerCase();
        return array.filter(item => {
            return propriedades.some(prop => {
                const valor = item[prop];
                return valor && valor.toString().toLowerCase().includes(termoLower);
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

    static removerDuplicatas(array, propriedade) {
        const visto = new Set();
        return array.filter(item => {
            const chave = propriedade ? item[propriedade] : JSON.stringify(item);
            if (visto.has(chave)) {
                return false;
            }
            visto.add(chave);
            return true;
        });
    }

    static paginar(array, pagina, itensPorPagina) {
        const inicio = (pagina - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        return {
            dados: array.slice(inicio, fim),
            paginaAtual: pagina,
            totalPaginas: Math.ceil(array.length / itensPorPagina),
            totalItens: array.length
        };
    }

    static embaralhar(array) {
        const embaralhado = [...array];
        for (let i = embaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
        }
        return embaralhado;
    }
}

// Exportar utilitários para uso global
window.mensagens = mensagens;
window.UtilitariosData = UtilitariosData;
window.ArmazenamentoLocal = ArmazenamentoLocal;
window.Validacoes = Validacoes;
window.GeradorID = GeradorID;
window.Formatadores = Formatadores;
window.Performance = Performance;
window.ManipuladoresDados = ManipuladoresDados;

// Inicialização de utilitários
document.addEventListener('DOMContentLoaded', function() {
    // Configurar observador de armazenamento
    window.addEventListener('storage', function(e) {
        console.log('Armazenamento alterado:', e.key);
        // Atualizar interface se necessário
    });

    // Configurar observador de performance
    if ('performance' in window) {
        Performance.iniciar('carregamentoPagina');
    }
});

// Utilitário para debounce (evitar múltiplas execuções)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utilitário para throttle (limitar execução)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exportar funções auxiliares
window.debounce = debounce;
window.throttle = throttle;