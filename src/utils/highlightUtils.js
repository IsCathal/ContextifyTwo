import { categorizeSentence, getCategoryInfo } from './categoryUtils';

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

// Initialize highlighting process
processParagraphsDebounced();