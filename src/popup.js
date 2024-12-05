import nlp from 'compromise';

const doc = nlp('Hello World');
console.log(doc.out('text'));
