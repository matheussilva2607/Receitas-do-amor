// Banco de dados de ingredientes e receitas
const ingredients = [
    { id: 1, name: "Ovo", icon: "🥚" },
    { id: 2, name: "Leite", icon: "🥛" },
    { id: 3, name: "Farinha", icon: "🌾" },
    { id: 4, name: "Açúcar", icon: "🍚" },
    { id: 5, name: "Manteiga", icon: "🧈" },
    { id: 6, name: "Chocolate", icon: "🍫" },
    { id: 7, name: "Morango", icon: "🍓" },
    { id: 8, name: "Banana", icon: "🍌" },
    { id: 9, name: "Maçã", icon: "🍎" },
    { id: 10, name: "Queijo", icon: "🧀" },
    { id: 11, name: "Pão", icon: "🍞" },
    { id: 12, name: "Frango", icon: "🍗" },
    { id: 13, name: "Arroz", icon: "🍚" },
    { id: 14, name: "Feijão", icon: "🥫" },
    { id: 15, name: "Tomate", icon: "🍅" },
    { id: 16, name: "Alface", icon: "🥬" },
    { id: 17, name: "Cenoura", icon: "🥕" },
    { id: 18, name: "Batata", icon: "🥔" },
    { id: 19, name: "Cebola", icon: "🧅" },
    { id: 20, name: "Alho", icon: "🧄" }
];

// Receitas (você pode expandir isso)
const recipes = [
    {
        id: 1,
        name: "Omelete Simples",
        ingredients: [1, 10, 19, 20],
        instructions: "1. Bata os ovos\n2. Misture com queijo ralado\n3. Refogue cebola e alho\n4. Despeje os ovos e cozinhe"
    },
    {
        id: 2,
        name: "Panqueca",
        ingredients: [1, 2, 3, 5],
        instructions: "1. Misture todos os ingredientes\n2. Aqueça a frigideira\n3. Despeje a massa e vire quando formar bolhas"
    },
    {
        id: 3,
        name: "Sanduíche de Queijo",
        ingredients: [10, 11],
        instructions: "1. Corte o pão\n2. Coloque o queijo\n3. Leve ao forno até derreter"
    },
    {
        id: 4,
        name: "Salada Simples",
        ingredients: [15, 16, 17, 19],
        instructions: "1. Lave todos os vegetais\n2. Corte em pedaços pequenos\n3. Misture e tempere a gosto"
    }
];

// Variáveis globais
let selectedIngredients = [];

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const ingredientsContainer = document.getElementById('ingredients-container');
    const findRecipesBtn = document.getElementById('find-recipes');
    const resultsSection = document.getElementById('results-section');
    const backToIngredientsBtn = document.getElementById('back-to-ingredients');
    const recipesContainer = document.getElementById('recipes-container');
    
    // Carrega os ingredientes na tela
    function loadIngredients() {
        ingredientsContainer.innerHTML = '';
        ingredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div');
            ingredientElement.className = 'ingredient-item';
            ingredientElement.innerHTML = `
                <span style="font-size: 2rem">${ingredient.icon}</span>
                <span>${ingredient.name}</span>
            `;
            
            ingredientElement.addEventListener('click', () => {
                ingredientElement.classList.toggle('selected');
                const ingredientId = ingredient.id;
                
                if (selectedIngredients.includes(ingredientId)) {
                    selectedIngredients = selectedIngredients.filter(id => id !== ingredientId);
                } else {
                    selectedIngredients.push(ingredientId);
                }
            });
            
            ingredientsContainer.appendChild(ingredientElement);
        });
    }
    
    // Encontra receitas com base nos ingredientes selecionados
    function findRecipes() {
        if (selectedIngredients.length === 0) {
            alert('Por favor, selecione pelo menos um ingrediente!');
            return;
        }
        
        const matchedRecipes = recipes.filter(recipe => {
            return recipe.ingredients.every(ing => selectedIngredients.includes(ing));
        });
        
        displayRecipes(matchedRecipes);
    }
    
    // Mostra as receitas encontradas
    function displayRecipes(recipesToShow) {
        recipesContainer.innerHTML = '';
        
        if (recipesToShow.length === 0) {
            recipesContainer.innerHTML = '<p>Nenhuma receita encontrada com esses ingredientes. Que tal tentar uma combinação diferente?</p>';
        } else {
            recipesToShow.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.className = 'recipe-card';
                
                // Pega os nomes dos ingredientes
                const ingredientNames = recipe.ingredients.map(ingId => {
                    const ing = ingredients.find(i => i.id === ingId);
                    return ing ? ing.name : '';
                });
                
                recipeElement.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p><strong>Ingredientes:</strong> ${ingredientNames.join(', ')}</p>
                    <p><strong>Modo de preparo:</strong></p>
                    <p>${recipe.instructions.replace(/\n/g, '<br>')}</p>
                `;
                
                recipesContainer.appendChild(recipeElement);
            });
        }
        
        // Mostra a seção de resultados
        document.querySelector('.ingredients-section').classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }
    
    // Volta para a seleção de ingredientes
    function backToIngredients() {
        resultsSection.classList.add('hidden');
        document.querySelector('.ingredients-section').classList.remove('hidden');
    }
    
    // Event listeners
    findRecipesBtn.addEventListener('click', findRecipes);
    backToIngredientsBtn.addEventListener('click', backToIngredients);
    
    // Inicializa a página
    loadIngredients();
});