let allRecipes = [];

// 1. Daten laden
fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        allRecipes = data;
        displayRecipes(allRecipes); // Zeigt beim Start alle an
    })
    .catch(error => console.error("Fehler beim Laden:", error));


// 2. Such-Logik
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = allRecipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(searchTerm) || 
               recipe.ingredients.some(z => z.toLowerCase().includes(searchTerm));
    });
    
    displayRecipes(filtered);
});


// 3. Funktion um Rezepte anzuzeigen (Die "Gute" Version mit Klick-Event)
function displayRecipes(recipes) {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = ''; 

    if (recipes.length === 0) {
        grid.innerHTML = '<p class="text-gray-500">Keine Rezepte gefunden.</p>';
        return;
    }

    recipes.forEach(recipe => {
        // HTML erstellen
        const cardHTML = `
            <div class="recipe-card bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition hover:scale-[1.02]" 
                 data-id="${recipe.id}">
                <span class="text-xs font-bold text-orange-500 uppercase">${recipe.category}</span>
                <h2 class="text-xl font-bold mb-2">${recipe.name}</h2>
                 <div class="flex flex-wrap gap-1">
                 ${recipe.ingredients.map(z => `<span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">${z}</span>`).join('')} 
                 </div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>⏱ ${recipe.duration}</span>
                    <span class="text-orange-600 font-medium">Ansehen →</span>
                </div>
            </div>
        `;
        
        // Ins Grid einfügen
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Klick-Events an alle gerade erstellten Karten anhängen
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            // Hier wichtig: id ist ein String, deswegen == statt === nutzen, oder parseInt(id)
            const recipe = allRecipes.find(r => r.id == id);
            if (recipe) {
                openModal(recipe);
            }
        });
    });
}


// 4. Modal Funktionen
function openModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const content = document.getElementById('modalContent');

    // Sicherheitscheck, falls Felder in JSON fehlen
    const ingredientsHTML = recipe.ingredients 
        ? recipe.ingredients.map(z => `<li>${z}</li>`).join('') 
        : '<li>Keine Zutaten angegeben</li>';

    content.innerHTML = `
        <h2 class="text-3xl font-bold text-orange-600 mb-4">${recipe.name}</h2>
        <div class="mb-6">
            <h3 class="font-bold text-lg mb-2">Ingredients:</h3>
            <ul class="list-disc list-inside text-gray-700">
                ${ingredientsHTML}
            </ul>
        </div>
        <div>
            <h3 class="font-bold text-lg mb-2">Instructions:</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">${recipe.instructions || 'Keine Anleitung vorhanden.'}</p>
        </div>
    `;

    modal.classList.remove('hidden'); 
}

function closeModal() {
    document.getElementById('recipeModal').classList.add('hidden');
}

// Schließen beim Klick auf den Hintergrund
window.onclick = (event) => {
    const modal = document.getElementById('recipeModal');
    if (event.target == modal) {
        closeModal();
    }
}