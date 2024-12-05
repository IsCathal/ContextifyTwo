
import nlp from 'compromise';


export const categoryInfo = {
  'History & Society': {
    color: 'green',
    description:
      'Refers to topics like historical events, cultural practices, social structures, politics, geography, and local traditions.',
    keywords: [
      'history', 'society', 'politics', 'tradition', 'culture', 'social',
      'heritage', 'civilization', 'revolution', 'democracy', 'colonialism', 'ethnography',
      'customs', 'norms', 'rituals', 'governance', 'commemoration'
    ],
  },
  'Literature & Art': {
    color: 'orange',
    description:
      'Points to references from literature, art, music, mythology, philosophical texts, religious scriptures, biographies, and other cultural works.',
    keywords: [
      'literature', 'art', 'music', 'mythology', 'philosophy', 'biography',
      'poetry', 'novel', 'drama', 'painting', 'sculpture', 'iconography',
      'manuscript', 'allegory', 'aesthetics', 'opera', 'prose', 'narrative'
    ],
  },
  'Places & Spaces': {
    color: 'brown',
    description:
      'Highlights geographical locations, architecture, infrastructure, landmarks, and public spaces, as well as their significance in the narrative.',
    keywords: [
      'place', 'space', 'architecture', 'landmark', 'geography', 'location',
      'city', 'village', 'monument', 'region', 'terrain', 'infrastructure',
      'map', 'route', 'habitat', 'urban', 'rural', 'environment'
    ],
  },
  'Performance & Expression': {
    color: 'purple',
    description:
      'Indicates connections to performance arts like music, theater, dance, rituals, public speaking, rhetorical styles, and creative expression in daily life.',
    keywords: [
      'performance', 'expression', 'theater', 'dance', 'ritual', 'speech',
      'drama', 'song', 'acting', 'poetry slam', 'performance art', 'movement',
      'gesture', 'ceremony', 'improvisation', 'stage', 'costume', 'dialogue'
    ],
  },
  'The Human Experience': {
    color: 'red',
    description:
      'Addresses themes related to the human body, emotions, relationships, food, health, memory, dreams, and mortality.',
    keywords: [
      'emotion', 'relationship', 'health', 'dream', 'memory', 'mortality', 'body',
      'family', 'love', 'fear', 'hope', 'grief', 'joy',
      'hunger', 'illness', 'aging', 'birth', 'identity', 'spirituality'
    ],
  },
  "The Creator's Lens": {
    color: 'blue',
    description:
      'Focuses on stylistic elements, narrative techniques, textual analysis, creative processes, and interpretive frameworks.',
    keywords: [
      'style', 'narrative', 'creative', 'interpret', 'technique', 'framework',
      'symbolism', 'metaphor', 'imagery', 'tone', 'voice', 'structure',
      'drafting', 'editing', 'perspective', 'context', 'genre', 'subtext'
    ],
  },
};

// Function to retrieve category information
function getCategoryInfo(category) {
  return categoryInfo[category] || null;
}


// Function to categorize a sentence based on keywords
function categorizeSentence(sentence) {
  const doc = nlp(sentence);
  const terms = doc.terms().out('array').map((word) => word.toLowerCase());

  for (const [category, data] of Object.entries(categoryInfo)) {
    const { keywords } = data;
    for (const keyword of keywords) {
      if (terms.includes(keyword)) {
        console.log(`Keyword matched: "${keyword}" in category "${category}"`);
        return category;
      }
    }
  }

  return null;
}

// Function to update paragraphs with new HTML
function updateParagraphs(paragraphUpdates) {
  paragraphUpdates.forEach(({ para, newHTML }) => {
    para.innerHTML = newHTML;
  });
}

// Function to process paragraphs and highlight categorized content
function processParagraphsDebounced() {
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
