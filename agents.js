
document.addEventListener("DOMContentLoaded", function() {
  const agentsContainer = document.getElementById("agents-container");

  // Fetch AI agents data from a JSON file
  fetch("agents.json")
    .then(response => response.json())
    .then(agents => {
      agents.forEach(agent => {
        const agentCard = `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center mb-4">
                <span class="material-icons text-white">${agent.icon}</span>
              </div>
              <h3 class="text-xl font-bold text-text-light dark:text-text-dark mb-2">${agent.name}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">${agent.description}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary-light dark:text-primary-dark font-semibold">${agent.price}</span>
                <button class="px-4 py-2 bg-primary-light hover:bg-opacity-90 dark:bg-primary-dark dark:hover:bg-opacity-90 text-white rounded-lg text-sm font-medium transition-colors">
                  Try Demo
                </button>
              </div>
            </div>
          </div>
        `;
        agentsContainer.innerHTML += agentCard;
      });
    });
});
