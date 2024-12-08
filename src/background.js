// background.js
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item when text is selected
  chrome.contextMenus.create({
    id: 'rewriteText',
    title: 'Rephrase for Today',
    contexts: ['selection'],
  });
});

// Handle clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'rewriteText') {
    const selectedText = info.selectionText;
    if (selectedText) {
      // Use chrome.scripting.executeScript to run code in the page context
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [selectedText],
        func: rewriteTextInPageContext,
      });
    }
  }
});

// Function to be executed in the page context
function rewriteTextInPageContext(selectedText) {
  let originalText = selectedText;
  let session = null;
  let modalOverlay = null;
  let modal = null;
  let rewrittenTextDiv = null;
  let loadingIcon = null;
  let errorMessageDiv = null;
  let retryButton = null;
  let cancelButton = null;

  (async () => {
    try {
      console.log('Attempting to rewrite text:', originalText);

      // Show the modal with loading icon immediately
      showLoadingModal();

      // Use the Prompt API to rewrite the text
      let rewrittenText = await generateRewrittenTextWithPromptAPI(originalText);

      // Update the modal with the rewritten text and options
      updateModalWithResult(rewrittenText);

    } catch (error) {
      console.error('Error using Prompt API:', error);

      // Show error modal
      showErrorInModal('An error occurred while rewriting the text.');
    }
  })();

// Function to generate rewritten text using the Prompt API
async function generateRewrittenTextWithPromptAPI(originalText) {
  console.log('Generating rewritten text using Prompt API...');

  // Check if 'ai' and 'ai.languageModel' are available
  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  // Check the capabilities of the language model
  const { available } = await ai.languageModel.capabilities();

  if (available !== 'no') {
    // Set temperature and topK
    const temperature = 1;
    const topK = 3;

    // Construct the system prompt
    const systemPrompt = `
      You are an English tutor specializing in literature. Rewrite the following text in modern English to make it accessible and engaging for contemporary students.
      - Simplify archaic language and clarify complex sentences where necessary.
      - Preserve the original meaning and literary elements.
      - Return only the text of the Rewrite
    `;

    // Create a language model session with specific parameters and system prompt
    const session = await ai.languageModel.create({
      temperature: temperature,
      topK: topK,
      systemPrompt: systemPrompt,
    });
    console.log(
      'Language model session created with temperature:',
      temperature,
      'and topK:',
      topK
    );

    try {
      // Prompt the model with the original text
      const rewrittenText = await session.prompt(originalText);
      console.log(
        'Rewritten text received from Prompt API:',
        rewrittenText.trim()
      );

      // Destroy the session
      session.destroy();

      // Return both original and rewritten text
      return {
        originalText: originalText,
        rewrittenText: rewrittenText.trim(),
      };
    } catch (error) {
      console.error('Error during prompting:', error);

      // Destroy the session in case of error
      session.destroy();
      throw error;
    }
  } else {
    throw new Error('The AI Language Model API is not available.');
  }
}


  // Function to show the modal with loading icon
  function showLoadingModal() {
    // Remove existing modal if any
    removeModal();

    // Create modal elements
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'rewriteModalOverlay';

    modal = document.createElement('div');
    modal.id = 'rewriteModal';

    const title = document.createElement('h2');
    title.innerText = 'Processing...';

    loadingIcon = document.createElement('div');
    loadingIcon.id = 'loadingIcon';
    loadingIcon.innerHTML = '⏳'; // You can replace this with a loading spinner if desired

    modal.appendChild(title);
    modal.appendChild(loadingIcon);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
  }

  function updateModalWithResult(result) {
    const { originalText, rewrittenText } = result;
  
    // Clear the modal content
    modal.innerHTML = '';
  
    // Create and append "Original Text" section
    const originalTitle = document.createElement('h2');
    originalTitle.innerText = 'Original Text';
  
    const originalTextDiv = document.createElement('div');
    originalTextDiv.id = 'originalText';
    originalTextDiv.innerText = originalText;
    originalTextDiv.style.marginBottom = '10px';
  
    // Create and append "Rewritten Text" section
    const rewrittenTitle = document.createElement('h2');
    rewrittenTitle.innerText = 'Rewritten Text';
  
    const rewrittenTextDiv = document.createElement('div');
    rewrittenTextDiv.id = 'rewrittenText';
    rewrittenTextDiv.innerText = rewrittenText;
  
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
  
    const acceptButton = document.createElement('button');
    acceptButton.id = 'acceptButton';
    acceptButton.title = 'Insert';
  
    const acceptIcon = document.createElement('span');
    acceptIcon.innerHTML = '&#8681;'; // Unicode down arrow
    acceptIcon.style.fontSize = '24px';
    acceptIcon.style.color = 'green';
  
    acceptButton.appendChild(acceptIcon);
  
    const retryButton = document.createElement('button');
    retryButton.id = 'retryButton';
    retryButton.title = 'Retry';
  
    const retryIcon = document.createElement('span');
    retryIcon.innerHTML = '&#8635;'; // Unicode clockwise gapped circle arrow
    retryIcon.style.fontSize = '24px';
  
    retryButton.appendChild(retryIcon);
  
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.title = 'Cancel';
  
    const cancelIcon = document.createElement('span');
    cancelIcon.innerHTML = '&#10005;'; // Unicode multiplication sign
    cancelIcon.style.fontSize = '24px';
    cancelIcon.style.color = 'red';
  
    cancelButton.appendChild(cancelIcon);
  
    // Append elements
    buttonContainer.appendChild(acceptButton);
    buttonContainer.appendChild(retryButton);
    buttonContainer.appendChild(cancelButton);
  
    modal.appendChild(originalTitle);
    modal.appendChild(originalTextDiv);
    modal.appendChild(rewrittenTitle);
    modal.appendChild(rewrittenTextDiv);
    modal.appendChild(buttonContainer);
  
    // Event Listeners
    acceptButton.onclick = () => {
      insertRewrittenTextBelowSelection(rewrittenText);
      removeModal();
      destroyResources();
    };
  
    retryButton.onclick = async () => {
      // Show loading icon
      showLoadingModal();
      try {
        let result = await generateRewrittenTextWithPromptAPI(originalText);
        updateModalWithResult(result);
      } catch (error) {
        console.error('Error rewriting text on retry:', error);
        // Show error modal
        showErrorInModal('An error occurred while rewriting the text.');
      }
    };
  
    cancelButton.onclick = () => {
      removeModal();
      destroyResources();
    };
  }
  

  // Function to insert the rewritten text below the selected text
function insertRewrittenTextBelowSelection(rewrittenText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const endNode = range.endContainer;
  const endOffset = range.endOffset;

  // Create a new range starting at the end of the selection
  const newRange = document.createRange();
  newRange.setStart(endNode, endOffset);
  newRange.setEnd(endNode, endOffset);

  // Create a line break
  const lineBreak = document.createElement('br');

  // Create a span for the rewritten text
  const span = document.createElement('span');
  span.innerText = rewrittenText;
  span.classList.add('highlighted-text');

  // Insert the line break and the new text
  const fragment = document.createDocumentFragment();
  fragment.appendChild(lineBreak);
  fragment.appendChild(span);

  newRange.insertNode(fragment);

  // Optionally, scroll to the inserted text
  span.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

  

  // Function to show generic error message in modal
  function showErrorInModal(message) {
    // Clear the modal content
    modal.innerHTML = '';

    const title = document.createElement('h2');
    title.innerText = 'Error';

    errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'errorMessage';
    errorMessageDiv.innerText = message;

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';

    cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.title = 'Close';

    const cancelIcon = document.createElement('span');
    cancelIcon.innerHTML = '&#10005;'; // Unicode multiplication sign
    cancelIcon.style.fontSize = '24px';
    cancelIcon.style.color = 'red';

    cancelButton.appendChild(cancelIcon);

    // Append elements
    buttonContainer.appendChild(cancelButton);

    modal.appendChild(title);
    modal.appendChild(errorMessageDiv);
    modal.appendChild(buttonContainer);

    // Event Listeners
    cancelButton.onclick = () => {
      removeModal();
      destroyResources();
    };
  }

  // Function to remove the modal from the page
  function removeModal() {
    if (modalOverlay) {
      modalOverlay.remove();
      modalOverlay = null;
      modal = null;
    }
  }

  // Function to destroy resources
  function destroyResources() {
    if (session) {
      session.destroy();
      session = null;
      console.log('Language model session destroyed');
    }
  }

  // Function to replace the selected text on the page
  function replaceSelectedText(replacementText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const span = document.createElement('span');
    span.innerText = replacementText;
    span.classList.add('highlighted-text');

    range.insertNode(span);

    // Optionally, re-apply the selection to the new text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
  }
}