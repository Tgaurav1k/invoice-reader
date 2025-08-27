// --- DOM Element References ---
const fileUpload = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');
const contentDisplay = document.getElementById('content-display');
const imagePreview = document.getElementById('image-preview');
const resultText = document.getElementById('result-text');
const totalAmountDisplay = document.getElementById('total-amount');
const extractButton = document.getElementById('extract-button');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const placeholderText = document.getElementById('placeholder-text');

let uploadedFile = null;

/**
 * Handles the file input change event.
 */
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    uploadedFile = file;
    fileNameDisplay.textContent = `Selected file: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      contentDisplay.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
    
    extractButton.disabled = false;
    resetResultState();
  }
}

/**
 * Resets the result display area to its initial state.
 */
function resetResultState() {
  loader.classList.add('hidden');
  resultText.classList.add('hidden');
  errorMessage.classList.add('hidden');
  placeholderText.classList.remove('hidden');
  totalAmountDisplay.textContent = '';
}

/**
 * Converts a File object to a base64 string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // strip prefix
    reader.onerror = error => reject(error);
  });
}

/**
 * Extracts the total amount using Gemini API.
 */
async function extractTotal() {
  if (!uploadedFile) {
    showError("Please upload an invoice image first.");
    return;
  }

  extractButton.disabled = true;
  placeholderText.classList.add('hidden');
  errorMessage.classList.add('hidden');
  resultText.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    const base64ImageData = await fileToBase64(uploadedFile);
    const apiKey = "AIzaSyD2r7jg6Tx3105PpwshShLmTUDXTd8c0Y4"; // replace with your Gemini API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [
          { text: "Analyze this invoice image and provide only the final total amount. Do not include any other text, currency symbols, or explanations. Just the numerical value." },
          {
            inlineData: {
              mimeType: uploadedFile.type,
              data: base64ImageData
            }
          }
        ]
      }]
    };

    const response = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API failed with ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      showResult(text.trim());
    } else {
      throw new Error("Could not extract the total amount from the invoice.");
    }

  } catch (error) {
    console.error("Error:", error);
    showError(error.message || "An unknown error occurred.");
  } finally {
    loader.classList.add('hidden');
    extractButton.disabled = false;
  }
}

/**
 * Retry fetch with exponential backoff.
 */
async function fetchWithRetry(url, options, retries = 3, backoff = 300) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status === 429) {
        throw new Error('Rate limited');
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
    }
  }
}

/**
 * Show extracted total.
 */
function showResult(amount) {
  totalAmountDisplay.textContent = amount;
  resultText.classList.remove('hidden');
  placeholderText.classList.add('hidden');
  errorMessage.classList.add('hidden');
}

/**
 * Show error in UI.
 */
function showError(message) {
  errorMessage.textContent = `Error: ${message}`;
  errorMessage.classList.remove('hidden');
  resultText.classList.add('hidden');
  placeholderText.classList.add('hidden');
  loader.classList.add('hidden');
}
