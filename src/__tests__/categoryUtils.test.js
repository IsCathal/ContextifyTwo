import { getCategoryInfo, categorizeSentence } from '../utils/categoryUtils';


const mockCategoryInfo = {
  sports: {
    keywords: ['football', 'basketball', 'tennis']
  },
  technology: {
    keywords: ['computer', 'AI', 'robotics']
  }
};

jest.mock('../utils/categoryInfo', () => ({
  categoryInfo: {
    'History & Society': {
      keywords: [
        'history', 'society', 'politics', 'tradition', 'culture', 'social',
        'heritage', 'civilization', 'revolution', 'democracy', 'colonialism', 'ethnography',
        'customs', 'norms', 'rituals', 'governance', 'commemoration'
      ],
    },
    'Literature & Art': {
      keywords: [
        'literature', 'art', 'music', 'mythology', 'philosophy', 'biography',
        'poetry', 'novel', 'drama', 'painting', 'sculpture', 'iconography',
        'manuscript', 'allegory', 'aesthetics', 'opera', 'prose', 'narrative'
      ],
    },
    'Places & Spaces': {
      keywords: [
        'place', 'space', 'architecture', 'landmark', 'geography', 'location',
        'city', 'village', 'monument', 'region', 'terrain', 'infrastructure',
        'map', 'route', 'habitat', 'urban', 'rural', 'environment'
      ],
    },
    'Performance & Expression': {
      keywords: [
        'performance', 'expression', 'theater', 'dance', 'ritual', 'speech',
        'drama', 'song', 'acting', 'poetry slam', 'performance art', 'movement',
        'gesture', 'ceremony', 'improvisation', 'stage', 'costume', 'dialogue'
      ],
    },
    'The Human Experience': {
      keywords: [
        'emotion', 'relationship', 'health', 'dream', 'memory', 'mortality', 'body',
        'family', 'love', 'fear', 'hope', 'grief', 'joy',
        'hunger', 'illness', 'aging', 'birth', 'identity', 'spirituality'
      ],
    },
    "The Creator's Lens": {
      keywords: [
        'style', 'narrative', 'creative', 'interpret', 'technique', 'framework',
        'symbolism', 'metaphor', 'imagery', 'tone', 'voice', 'structure',
        'drafting', 'editing', 'perspective', 'context', 'genre', 'subtext'
      ],
    },
  },
}));


describe('getCategoryInfo', () => {
  it('should return category information if the category exists', () => {
    const category = 'Places & Spaces';

    const expected = {
      keywords: [
        'place',
        'space',
        'architecture',
        'landmark',
        'geography',
        'location',
        'city',
        'village',
        'monument',
        'region',
        'terrain',
        'infrastructure',
        'map',
        'route',
        'habitat',
        'urban',
        'rural',
        'environment',
      ],
    };

    const result = getCategoryInfo(category);
    expect(result).toEqual(expected); // Deep equality check
  });

  it('should return null if the category does not exist', () => {
    const category = 'Unknown Category';
    const result = getCategoryInfo(category);
    expect(result).toBeNull();
  });
});

describe('categorizeSentence', () => {
  it('should return the correct category if a keyword is found', () => {
    const result = categorizeSentence('I architecture exploring the architecture.');
    expect(result).toBe('Places & Spaces');
  });

  it('should return null if no keywords match', () => {
    const result = categorizeSentence('This is a random sentence.');
    expect(result).toBeNull();
  });

  it('should be case insensitive', () => {
    const result = categorizeSentence('These are my enticements, and they are sufficient to conquer all fear of danger or death and to induce me to commence this laborious voyage with the joy a child feels when he embarks in a little boat, with his holiday mates, on an expedition of discovery up his native river..');
    expect(result).toBe('The Human Experience');
  });
});
