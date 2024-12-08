import { marked } from 'marked';
import { categorizeSentence, getCategoryInfo } from './categoryUtils';
import { fetchExplanationFromAPIWithContext } from './apiUtils'; // Create a new file for API utilities


export function updateParagraphs(paragraphUpdates) {
  paragraphUpdates.forEach(({ para, newHTML }) => {
    para.innerHTML = newHTML;
  });
}

export function processParagraphsDebounced() {
  const paragraphs = document.querySelectorAll('p');
  const paragraphUpdates = [];

  for (let para of paragraphs) {
    const sentences = para.innerText.match(/[^.!?]+[.!?]+/g) || [para.innerText];
    let newHTML = '';

    for (let sentence of sentences) {
      const category = categorizeSentence(sentence);
      const categoryData = getCategoryInfo(category);

      if (categoryData) {
        newHTML += `<span class="tooltip ${categoryData.color}" data-category="${category}" data-description="${categoryData.description}">${sentence}</span>`;
      } else {
        newHTML += sentence;
      }
    }

    paragraphUpdates.push({ para, newHTML });
  }

  

  updateParagraphs(paragraphUpdates);
}

export function addClickEventToTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');

  tooltips.forEach((tooltip) => {
    tooltip.addEventListener('click', async (event) => {
      const sentence = event.target.innerText;
      const title = event.target.getAttribute('data-category');
      const description = event.target.getAttribute('data-description');

      const rect = event.target.getBoundingClientRect();
      showFloatingHelper(rect.x + window.scrollX, rect.y + window.scrollY);

      try {
        const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);
        showFloatingHelper(rect.x + window.scrollX, rect.y + window.scrollY, explanation);
      } catch (error) {
        showFloatingHelper(rect.x + window.scrollX, rect.y + window.scrollY, 'Error fetching explanation.');
      }
    });
  });
}

export function createFloatingHelper() {
  const helper = document.createElement('div');
  helper.id = 'floating-helper';
  helper.style.position = 'absolute';
  helper.style.zIndex = '1000';
  helper.style.padding = '15px';
  helper.style.borderRadius = '8px';
  helper.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  helper.style.backgroundColor = '#fff';
  helper.style.cursor = 'move';
  helper.style.display = 'none';

  const content = document.createElement('div');
  content.id = 'helper-content';
  content.textContent = 'Processing...';
  helper.appendChild(content);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.padding = '10px 20px';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.backgroundColor = '#007BFF';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    helper.style.display = 'none';
  });

  helper.appendChild(closeButton);
  document.body.appendChild(helper);

  makeElementDraggable(helper);
}

function makeElementDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function showFloatingHelper(x, y, content = 'Processing...') {
  const helper = document.getElementById('floating-helper');
  const helperContent = document.getElementById('helper-content');

  // Convert Markdown to HTML if content is in Markdown
  helperContent.innerHTML = typeof content === 'string' ? marked(content) : content;

  helper.style.left = `${x}px`;
  helper.style.top = `${y}px`;
  helper.style.display = 'block';
}

// Initialize highlighting process
processParagraphsDebounced();
createFloatingHelper();
addClickEventToTooltips();
