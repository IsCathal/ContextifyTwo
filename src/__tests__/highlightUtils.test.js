import { updateParagraphs, processParagraphsDebounced } from '../utils/highlightUtils';
import { categorizeSentence, getCategoryInfo } from '../utils/categoryUtils';

jest.mock('../utils/categoryUtils', () => ({
  categorizeSentence: jest.fn(),
  getCategoryInfo: jest.fn(),
}));

describe('updateParagraphs', () => {
  it('should update the innerHTML of paragraphs based on provided updates', () => {
    const mockParagraph = document.createElement('p');
    mockParagraph.innerHTML = 'Original text.';
    const paragraphUpdates = [
      { para: mockParagraph, newHTML: '<span>Updated text.</span>' },
    ];

    updateParagraphs(paragraphUpdates);

    expect(mockParagraph.innerHTML).toBe('<span>Updated text.</span>');
  });
});

describe('processParagraphsDebounced', () => {
  beforeEach(() => {
    // Set up the DOM with paragraphs and define innerText
    const paragraph1 = document.createElement('p');
    paragraph1.innerText = 'This is a test sentence. Another sentence follows.';

    const paragraph2 = document.createElement('p');
    paragraph2.innerText = 'More text here.';

    document.body.append(paragraph1, paragraph2);

    // Mock `categorizeSentence` and `getCategoryInfo`
    categorizeSentence.mockImplementation((sentence) => {
      if (sentence.includes('test')) return 'Test Category';
      return null;
    });

    getCategoryInfo.mockImplementation((category) => {
      if (category === 'Test Category') {
        return {
          color: 'blue',
          description: 'A test category description',
        };
      }
      return null;
    });
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  it('should process paragraphs and add tooltips for categorized sentences', () => {
    processParagraphsDebounced();

    const paragraphs = document.querySelectorAll('p');
    expect(paragraphs[0].innerHTML).toContain(
      `<span class="tooltip blue" data-category="Test Category" data-description="A test category description">This is a test sentence.</span>`
    );
    expect(paragraphs[0].innerHTML).toContain('Another sentence follows.');
    expect(paragraphs[1].innerHTML).toBe('More text here.');
  });

  it('should leave sentences without categories unchanged', () => {
    categorizeSentence.mockReturnValue(null);
    getCategoryInfo.mockReturnValue(null);

    processParagraphsDebounced();

    const paragraphs = document.querySelectorAll('p');
    expect(paragraphs[0].innerHTML).toBe('This is a test sentence. Another sentence follows.');
    expect(paragraphs[1].innerHTML).toBe('More text here.');
  });
});
