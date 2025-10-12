
document.addEventListener('DOMContentLoaded', function() {
  let assessmentData = {};
  let currentQuestionIndex = 0;
  let answers = {};

  // DOM Elements
  const questionContainer = document.getElementById('question-container');
  const prevBtn = document.getElementById('prev-btn');
  const progressBar = document.getElementById('progress-bar');
  const currentQuestionEl = document.getElementById('current-question');
  const resultsContainer = document.getElementById('results-container');
  const contactBtn = document.getElementById('contact-btn');

  // Fetch assessment data
  fetch('assessment.json')
    .then(response => response.json())
    .then(data => {
      assessmentData = data;
      initAssessment();
    });

  // Initialize the assessment
  function initAssessment() {
    renderQuestion(currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
  }

  // Render a question
  function renderQuestion(index) {
    const question = assessmentData.questions[index];
    let selectedValue = answers[question.id] || null;

    let optionsHtml = '';
    question.options.forEach(option => {
      const isSelected = selectedValue == option.value;
      optionsHtml += `
        <button 
          type="button"
          id="${question.id}-${option.value}" 
          data-question="${question.id}"
          data-value="${option.value}"
          class="option-button w-full text-left p-4 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark ${isSelected ? 'selected' : ''}"
        >
          ${option.label}
        </button>
      `;
    });

    questionContainer.innerHTML = `
      <div class="bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold text-text-light dark:text-text-dark mb-6">
          ${index + 1}. ${question.text}
        </h3>
        <div class="space-y-2">
          ${optionsHtml}
        </div>
      </div>
    `;

    // Add event listeners to option buttons
    document.querySelectorAll('.option-button').forEach(button => {
      button.addEventListener('click', () => {
        // Remove selected class from all buttons in this question
        document.querySelectorAll(`.option-button[data-question="${button.dataset.question}"]`).forEach(btn => {
          btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        button.classList.add('selected');
        
        // Save the answer
        answers[button.dataset.question] = parseInt(button.dataset.value);
        
        // Move to next question or show results after a short delay
        setTimeout(() => {
          if (currentQuestionIndex < assessmentData.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
            updateProgressBar();
            updateNavigationButtons();
          } else {
            // Last question - show results
            showResults();
          }
        }, 300);
      });
    });
  }

  // Update progress bar
  function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / assessmentData.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
  }

  // Update navigation buttons
  function updateNavigationButtons() {
    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
  }

  // Previous button handler
  function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
      updateProgressBar();
      updateNavigationButtons();
    }
  }

  // Calculate score and determine level
  function calculateResults() {
    let totalScore = 0;
    
    // Sum all answer values
    Object.values(answers).forEach(value => {
      totalScore += value;
    });
    
    // Find the matching level based on scoring ranges
    let level = null;
    for (const scoringLevel of assessmentData.scoring.levels) {
      const [min, max] = scoringLevel.range;
      if (totalScore >= min && totalScore <= max) {
        level = scoringLevel;
        break;
      }
    }
    
    // Fallback if no level found
    if (!level) {
      level = assessmentData.scoring.levels[0];
    }
    
    return {
      score: totalScore,
      level: level
    };
  }

  // Show results
  function showResults() {
    // Check if all questions are answered
    if (Object.keys(answers).length < assessmentData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    const results = calculateResults();
    
    document.getElementById('score-display').textContent = results.score;
    document.getElementById('level-display').textContent = results.level.label;
    document.getElementById('description-display').textContent = results.level.description;
    document.getElementById('cta-display').innerHTML = `<p class="text-blue-800 dark:text-blue-200">${results.level.cta}</p>`;
    
    document.querySelector('form').classList.add('hidden');
    resultsContainer.classList.remove('hidden');
  }

  // Event Listeners
  prevBtn.addEventListener('click', goToPrevQuestion);
});
