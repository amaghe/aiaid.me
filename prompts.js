
document.addEventListener("DOMContentLoaded", function() {
  const promptsContainer = document.getElementById("prompts-container");
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const modal = document.getElementById("promptModal");
  const span = document.getElementsByClassName("close")[0];
  const copyPromptBtn = document.getElementById("copyPromptBtn");
  let currentPromptContent = "";
  let allPrompts = [];

  // Fetch AI prompts data from a JSON file
  fetch("prompts.json")
    .then(response => response.json())
    .then(prompts => {
      allPrompts = prompts;
      generatePromptCards(allPrompts);
    });

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // Copy prompt functionality
  copyPromptBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(currentPromptContent).then(() => {
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="material-icons text-sm mr-2">check</span>Copied!';
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 2000);
    });
  });

  // Function to truncate text
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  // Function to generate prompt cards
  function generatePromptCards(prompts) {
    promptsContainer.innerHTML = '';

    prompts.forEach(prompt => {
      const title = prompt.filename.replace('.md', '').replace(/%20/g, ' ').replace(/_/g, ' ');
      const description = prompt.description || truncateText(prompt.content, 150);

      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden prompt-card';
      card.innerHTML = `
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 bg-primary-light dark:bg-primary-dark text-white text-sm rounded-full capitalize">${prompt.category.replace(/-/g, ' ')}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">ChatGPT</span>
          </div>
          <h3 class="text-lg font-bold text-text-light dark:text-text-dark mb-3">${title}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${description}</p>
          <button class="w-full px-4 py-2 bg-primary-light hover:bg-opacity-90 dark:bg-primary-dark dark:hover:bg-opacity-90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center view-prompt-btn" data-title="${title}" data-content="${prompt.content.replace(/"/g, '&quot;')}">
            <span class="material-icons text-sm mr-2">visibility</span>
            View Prompt
          </button>
        </div>
      `;
      promptsContainer.appendChild(card);
    });

    // Add event listeners to view prompt buttons
    document.querySelectorAll('.view-prompt-btn').forEach(button => {
      button.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const content = this.getAttribute('data-content');
        currentPromptContent = content;

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').textContent = content;
        modal.style.display = "block";
      });
    });
  }

  // Filter functionality
  function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredPrompts = allPrompts.filter(prompt => {
      const title = prompt.filename.replace('.md', '').replace(/%20/g, ' ').toLowerCase();
      const content = prompt.content.toLowerCase();
      const description = (prompt.description || '').toLowerCase();

      const matchesSearch = searchTerm === '' ||
        title.includes(searchTerm) ||
        content.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchesCategory = selectedCategory === '' ||
        prompt.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    generatePromptCards(filteredPrompts);
  }

  searchInput.addEventListener('input', filterPrompts);
  categoryFilter.addEventListener('change', filterPrompts);
});
