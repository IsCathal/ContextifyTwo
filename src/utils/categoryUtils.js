import nlp from 'compromise';
import { categoryInfo } from './categoryInfo';

export function getCategoryInfo(category) {
  const info = categoryInfo[category] || null;
  console.log(`Category info for "${category}":`, info);
  return info;
}


export function categorizeSentence(sentence) {
  const doc = nlp(sentence);
  const terms = doc.terms().out('array').map((word) => word.toLowerCase());

  for (const [category, data] of Object.entries(categoryInfo)) {
    const { keywords } = data;
    for (const keyword of keywords) {
      if (terms.includes(keyword)) {
       // console.log(`Keyword matched: "${keyword}" in category "${category}"`);
        return category;
      }
    }
  }

  return null;
}