export async function fetchExplanationFromAPIWithContext(sentence, title, description) {
  try {
    const response = await generateExplanationWithPromptAPI(sentence, title, description);
    console.log('Generating explanation using Prompt API...');
    console.log(`Sentence: "${sentence}"`);
    console.log(`Category Title: "${title}"`);
    console.log(`Category Description: "${description}"`);
    return response.explanation; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return 'An error occurred while fetching the explanation.';
  }
}

async function generateExplanationWithPromptAPI(originalText, title, description) {
  console.log('Generating explanation using Prompt API...');

  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  const { available } = await ai.languageModel.capabilities();
  console.log('AI Model Capabilities:', available);

  if (available !== 'no') {
    const temperature = 1;
    const topK = 3;

    const systemPrompt = `
      You are an expert in the domain of "${title}". The category is described as: "${description}".
      Based on this context:
      - Explain why the following text belongs to the category "${title}".
      - Highlight specific elements in the text that align with the description of the category.
      - Provide a concise yet detailed explanation that makes the connection clear.
      - Return only the explanation.
    `;

    console.log('System Prompt:', systemPrompt);

    const session = await ai.languageModel.create({
      temperature,
      topK,
      systemPrompt,
    });

    try {
      const explanation = await session.prompt(originalText);
      session.destroy();
      return { explanation: explanation.trim() };
    } catch (error) {
      console.error('Error during prompting:', error);
      session.destroy();
      throw error;
    }
  } else {
    throw new Error('The AI Language Model API is not available.');
  }
}
