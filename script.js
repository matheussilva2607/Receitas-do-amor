// Variáveis globais
let ingredientes = [];
let receitas = [];
let ingredientesSelecionados = [];

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
});

// Carrega dados do JSON
async function carregarDados() {
    try {
        const response = await fetch('receitas.json');
        const dados = await response.json();
        
        ingredientes = dados.ingredientes;
        receitas = dados.receitas;
        
        inicializarInterface();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar as receitas. Por favor, recarregue a página.');
    }
}

// Inicializa a interface
function inicializarInterface() {
    const ingredientsContainer = document.getElementById('ingredients-container');
    const findRecipesBtn = document.getElementById('find-recipes');
    const backToIngredientsBtn = document.getElementById('back-to-ingredients');
    const resultsSection = document.getElementById('results-section');
    const recipesContainer = document.getElementById('recipes-container');
    
    // Carrega ingredientes na tela
    function carregarIngredientes() {
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
                    } else {
                        ingredientesSelecionados.push(id);
                    }
                });
                
                gridDiv.appendChild(item);
            });
            
            categoriaDiv.appendChild(gridDiv);
            ingredientsContainer.appendChild(categoriaDiv);
        }
    }
    
    // Formata nome da categoria para exibição
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
    
    // Encontra receitas com base nos ingredientes selecionados
    function encontrarReceitas() {
        if (ingredientesSelecionados.length === 0) {
            alert('Por favor, selecione pelo menos um ingrediente!');
            return;
        }
        
        const receitasEncontradas = receitas.filter(receita => {
            return receita.ingredientes.every(ing => ingredientesSelecionados.includes(ing));
        });
        
        exibirReceitas(receitasEncontradas);
    }
    
    // Exibe as receitas encontradas
    function exibirReceitas(receitasParaExibir) {
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
        resultsSection.classList.add('hidden');
        document.querySelector('.ingredients-section').classList.remove('hidden');
    }
    
    // Event listeners
    findRecipesBtn.addEventListener('click', encontrarReceitas);
    backToIngredientsBtn.addEventListener('click', voltarParaIngredientes);
    
    // Inicializa
    carregarIngredientes();
});