import { getCategoryInfo, categorizeSentence } from '../utils/categoryUtils';
import { categoryInfo } from '../utils/categoryInfo'; // Import the actual data

// Mock the categoryInfo module, but use the actual data by default
jest.mock('../utils/categoryInfo', () => {
  const actual = jest.requireActual('../utils/categoryInfo');
  return {
    ...actual, // Include all actual data
    categoryInfo: {
      ...actual.categoryInfo, // Spread the real categoryInfo data
      // Optionally, add or override for specific test cases if necessary
    },
  };
});

describe('getCategoryInfo', () => {
  it('should return category information if the category exists', () => {
    const category = 'Places & Spaces';

    // Use the actual data for the test
    const expected = categoryInfo[category];

    const result = getCategoryInfo(category);
    expect(result).toEqual(expected);
  });

  it('should return null if the category does not exist', () => {
    const category = 'Unknown Category';
    const result = getCategoryInfo(category);
    expect(result).toBeNull();
  });
});

describe('categorizeSentence', () => {
  it('should return the correct category if a keyword is found', () => {
    const sentence = 'here—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.';
    const result = categorizeSentence(sentence);
    expect(result).toBe('Places & Spaces');
  });

  it('should return null if no keywords match', () => {
    const sentence = 'This is a random sentence.';
    const result = categorizeSentence(sentence);
    expect(result).toBeNull();
  });

  it('should be case insensitive', () => {
    const sentence = 'Oh, that some encouraging voice would answer in the affirmative!';
    const result = categorizeSentence(sentence);
    expect(result).toBe("The Creator's Lens");
  });

  it('should match sentences with complex words from keywords', () => {
    const sentence = 'The urban infrastructure is improving in cities.';
    const result = categorizeSentence(sentence);
    expect(result).toBe('Places & Spaces');
  });

  it('should match sentences with multiple keywords from different categories', () => {
    const sentence = 'History and culture have shaped this place.';
    const result = categorizeSentence(sentence);
    expect(result).toBe('History & Society');
  });
});
