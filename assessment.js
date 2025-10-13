
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

  // Fetch assessment data
  fetch('assessment.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      assessmentData = data;
      initAssessment();
    })
    .catch(error => {
      console.error('Error fetching assessment data:', error);
      if (questionContainer) {
        questionContainer.innerHTML = `<p class="text-red-500 text-center">Error loading assessment questions. Please check the console for details and try refreshing the page.</p>`;
      }
    });

  // Initialize the assessment
  function initAssessment() {
    if (!assessmentData.questions || assessmentData.questions.length === 0) {
        console.error("No questions found in assessment data.");
        if (questionContainer) {
            questionContainer.innerHTML = `<p class="text-red-500 text-center">Assessment data is missing questions. Please check the assessment.json file.</p>`;
        }
        return;
    }
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
        document.querySelectorAll(`.option-button[data-question="${button.dataset.question}"]`).forEach(btn => {
          btn.classList.remove('selected');
        });
        button.classList.add('selected');
        answers[button.dataset.question] = parseInt(button.dataset.value);
        
        setTimeout(() => {
          if (currentQuestionIndex < assessmentData.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
            updateProgressBar();
            updateNavigationButtons();
          } else {
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
    Object.values(answers).forEach(value => {
      totalScore += value;
    });
    
    let level = assessmentData.scoring.levels[0]; // Default to first level
    for (const scoringLevel of assessmentData.scoring.levels) {
      const [min, max] = scoringLevel.range;
      if (totalScore >= min && totalScore <= max) {
        level = scoringLevel;
        break;
      }
    }
    
    return {
      score: totalScore,
      level: level
    };
  }

  // Show results
  function showResults() {
    if (Object.keys(answers).length < assessmentData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    const results = calculateResults();
    
    document.getElementById('score-display').textContent = results.score;
    document.getElementById('level-display').textContent = results.level.label;
    document.getElementById('description-display').textContent = results.level.description;
    document.getElementById('cta-display').innerHTML = results.level.cta;
    
    document.querySelector('form').classList.add('hidden');
    resultsContainer.classList.remove('hidden');
  }

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevQuestion);
  }
});
