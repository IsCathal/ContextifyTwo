import { fetchExplanationFromAPIWithContext } from '../utils/apiUtils';

// Mock the `ai` object
global.ai = {
  languageModel: {
    capabilities: jest.fn(),
    create: jest.fn(),
  },
};

describe('fetchExplanationFromAPIWithContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the explanation if the API call is successful', async () => {
    // Mock `ai.languageModel.capabilities` and `ai.languageModel.create`
    ai.languageModel.capabilities.mockResolvedValue({ available: 'yes' });
    const mockSession = {
      prompt: jest.fn().mockResolvedValue('This is a test explanation.'),
      destroy: jest.fn(),
    };
    ai.languageModel.create.mockResolvedValue(mockSession);

    const sentence = 'This is a test sentence.';
    const title = 'Test Category';
    const description = 'This is a test description.';

    const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);

    expect(ai.languageModel.capabilities).toHaveBeenCalled();
    expect(mockSession.prompt).toHaveBeenCalledWith(sentence);
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(explanation).toBe('This is a test explanation.');
  });

  it('should return an error message if the AI API is unavailable', async () => {
    ai.languageModel.capabilities.mockResolvedValue({ available: 'no' });

    const sentence = 'This is a test sentence.';
    const title = 'Test Category';
    const description = 'This is a test description.';

    const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);

    expect(ai.languageModel.capabilities).toHaveBeenCalled();
    expect(explanation).toBe('An error occurred while fetching the explanation.');
  });

  it('should handle errors during the explanation generation process', async () => {
    ai.languageModel.capabilities.mockResolvedValue({ available: 'yes' });
    const mockSession = {
      prompt: jest.fn().mockRejectedValue(new Error('Test error')),
      destroy: jest.fn(),
    };
    ai.languageModel.create.mockResolvedValue(mockSession);

    const sentence = 'This is a test sentence.';
    const title = 'Test Category';
    const description = 'This is a test description.';

    const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);

    expect(ai.languageModel.capabilities).toHaveBeenCalled();
    expect(mockSession.prompt).toHaveBeenCalledWith(sentence);
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(explanation).toBe('An error occurred while fetching the explanation.');
  });
});
