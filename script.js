// Variáveis globais
let ingredientes = [];
let receitas = [];
let ingredientesSelecionados = [];

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - Iniciando aplicação');
    inicializarAplicacao();
});

// Função principal de inicialização
async function inicializarAplicacao() {
    try {
        // Carrega os dados
        await carregarDados();
        
        // Inicializa a interface
        inicializarInterface();
        
        // Configura eventos
        configurarEventos();
        
        console.log('Aplicação inicializada com sucesso');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        mostrarErro('Ocorreu um erro ao carregar o aplicativo. Por favor, recarregue a página.');
    }
}

// Carrega dados do JSON
async function carregarDados() {
    try {
        console.log('Iniciando carregamento do JSON...');
        const response = await fetch('./receitas.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dados = await response.json();
        console.log('Dados brutos carregados:', dados);
        
        // Valida a estrutura dos dados
        if (!dados.ingredientes || !dados.receitas) {
            throw new Error('Estrutura do JSON inválida');
        }
        
        ingredientes = dados.ingredientes;
        receitas = dados.receitas;
        
        console.log(`Carregados ${ingredientes.length} ingredientes e ${receitas.length} receitas`);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error; // Re-lança o erro para tratamento superior
    }
}

// Inicializa a interface
function inicializarInterface() {
    console.log('Inicializando interface...');
    carregarIngredientes();
}

// Carrega ingredientes na tela
function carregarIngredientes() {
    const ingredientsContainer = document.getElementById('ingredients-container');
    if (!ingredientsContainer) {
        throw new Error('Container de ingredientes não encontrado');
    }
    
    ingredientsContainer.innerHTML = '';
    
    // Agrupa ingredientes por categoria
    const categorias = {};
    ingredientes.forEach(ing => {
        if (!categorias[ing.categoria]) {
            categorias[ing.categoria] = [];
        }
        categorias[ing.categoria].push(ing);
    });
    
    // Cria seções por categoria
    for (const [categoria, itens] of Object.entries(categorias)) {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'category-section';
        categoriaDiv.innerHTML = `<h3>${formatarCategoria(categoria)}</h3>`;
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'ingredients-grid';
        
        itens.forEach(ingrediente => {
            const item = document.createElement('div');
            item.className = 'ingredient-item';
            item.dataset.id = ingrediente.id;
            item.innerHTML = `
                <span class="ingredient-icon">${ingrediente.icon}</span>
                <span class="ingredient-name">${ingrediente.nome}</span>
            `;
            
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                const id = parseInt(item.dataset.id);
                
                if (ingredientesSelecionados.includes(id)) {
                    ingredientesSelecionados = ingredientesSelecionados.filter(i => i !== id);
                    console.log(`Ingrediente ${id} removido`);
                } else {
                    ingredientesSelecionados.push(id);
                    console.log(`Ingrediente ${id} adicionado`);
                }
                
                console.log('Ingredientes selecionados:', ingredientesSelecionados);
            });
            
            gridDiv.appendChild(item);
        });
        
        categoriaDiv.appendChild(gridDiv);
        ingredientsContainer.appendChild(categoriaDiv);
    }
}

// Configura os eventos
function configurarEventos() {
    const findRecipesBtn = document.getElementById('find-recipes');
    const backToIngredientsBtn = document.getElementById('back-to-ingredients');
    
    if (!findRecipesBtn || !backToIngredientsBtn) {
        throw new Error('Botões não encontrados');
    }
    
    findRecipesBtn.addEventListener('click', encontrarReceitas);
    backToIngredientsBtn.addEventListener('click', voltarParaIngredientes);
    
    console.log('Eventos configurados com sucesso');
}

// Encontra receitas com base nos ingredientes selecionados
function encontrarReceitas() {
    console.log('Buscando receitas...');
    
    if (ingredientesSelecionados.length === 0) {
        mostrarAviso('Por favor, selecione pelo menos um ingrediente!');
        return;
    }
    
    console.log('Ingredientes selecionados:', ingredientesSelecionados);
    
    const receitasEncontradas = receitas.filter(receita => {
        const temTodos = receita.ingredientes.every(ing => ingredientesSelecionados.includes(ing));
        console.log(`Receita "${receita.nome}": ${temTodos ? 'Compatível' : 'Não compatível'}`);
        return temTodos;
    });
    
    console.log(`Encontradas ${receitasEncontradas.length} receitas`);
    exibirReceitas(receitasEncontradas);
}

// Exibe as receitas encontradas
function exibirReceitas(receitasParaExibir) {
    const recipesContainer = document.getElementById('recipes-container');
    const resultsSection = document.getElementById('results-section');
    
    if (!recipesContainer || !resultsSection) {
        throw new Error('Elementos de exibição não encontrados');
    }
    
    recipesContainer.innerHTML = '';
    
    if (receitasParaExibir.length === 0) {
        recipesContainer.innerHTML = `
            <div class="no-recipes">
                <p>Nenhuma receita encontrada com esses ingredientes.</p>
                <p>Que tal tentar uma combinação diferente?</p>
            </div>
        `;
    } else {
        // Agrupa receitas por categoria
        const receitasPorCategoria = {};
        receitasParaExibir.forEach(receita => {
            if (!receitasPorCategoria[receita.categoria]) {
                receitasPorCategoria[receita.categoria] = [];
            }
            receitasPorCategoria[receita.categoria].push(receita);
        });
        
        // Cria seções para cada categoria
        for (const [categoria, receitas] of Object.entries(receitasPorCategoria)) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'recipe-category';
            categoriaDiv.innerHTML = `<h3>${formatarCategoria(categoria)}</h3>`;
            
            receitas.forEach(receita => {
                const card = criarCardReceita(receita);
                categoriaDiv.appendChild(card);
            });
            
            recipesContainer.appendChild(categoriaDiv);
        }
    }
    
    // Mostra a seção de resultados
    document.querySelector('.ingredients-section').classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

// Cria o card de uma receita
function criarCardReceita(receita) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    // Pega os nomes dos ingredientes
    const nomesIngredientes = receita.ingredientes.map(id => {
        const ing = ingredientes.find(i => i.id === id);
        return ing ? `${ing.icon} ${ing.nome}` : '';
    });
    
    // Formata as tags
    const tagsHTML = receita.tags ? receita.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('') : '';
    
    card.innerHTML = `
        <div class="recipe-header">
            <h4>${receita.nome}</h4>
            <div class="recipe-meta">
                <span class="difficulty ${receita.dificuldade}">${receita.dificuldade}</span>
                <span class="time">⏱ ${receita.tempo}</span>
                <span class="servings">🍽 ${receita.porcoes} ${receita.porcoes > 1 ? 'porções' : 'porção'}</span>
            </div>
            ${tagsHTML}
        </div>
        <div class="recipe-content">
            <div class="ingredients">
                <h5>Ingredientes:</h5>
                <ul>
                    ${nomesIngredientes.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions">
                <h5>Modo de Preparo:</h5>
                <p>${receita.instrucoes.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
    
    return card;
}

// Volta para a seleção de ingredientes
function voltarParaIngredientes() {
    document.getElementById('results-section').classList.add('hidden');
    document.querySelector('.ingredients-section').classList.remove('hidden');
}

// Funções auxiliares
function formatarCategoria(categoria) {
    const formatos = {
        'laticinios': 'Laticínios',
        'frutas': 'Frutas',
        'vegetais': 'Vegetais',
        'carnes': 'Carnes',
        'graos': 'Grãos',
        'massas': 'Massas',
        'temperos': 'Temperos',
        'doces': 'Doces'
    };
    return formatos[categoria] || categoria;
}

function mostrarAviso(mensagem) {
    alert(mensagem);
    console.warn(mensagem);
}

function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensagem;
    document.body.prepend(errorDiv);
    console.error(mensagem);
}
