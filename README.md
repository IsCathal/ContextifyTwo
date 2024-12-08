
# ContextifyTwo

ContextifyTwo is a browser extension that analyzes web page content, categorizes it, and provides explanations for text based on pre-defined categories. It leverages AI APIs to generate contextual insights and displays them in an intuitive floating helper widget.

## Features

- **Text Categorization**: Automatically categorizes sentences into pre-defined categories.
- **AI-Powered Explanations**: Fetches detailed explanations for categorized text using an AI language model.
- **Interactive Tooltips**: Displays tooltips with explanations when you click on categorized sentences.
- **Floating Helper Widget**: A draggable widget that shows explanations in a visually appealing way.
- **Customizable Styling**: Fully customizable tooltip and widget styling.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IsCathal/ContextifyTwo.git
   cd contextifytwo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Load the extension in your browser:
   - Open your browser's extensions page (e.g., `chrome://extensions` in Chrome).
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `dist` folder from the project directory.

## Usage

1. Navigate to any webpage with text content.
2. Sentences will be automatically categorized, and tooltips will appear on hover or click.
3. Click on a categorized sentence to see a detailed explanation in the floating helper widget.

## Development

To start a development server:
```bash
npm run dev
```

## Testing

Run tests with:
```bash
npm test
```

The project uses Jest for testing, with comprehensive test suites for all utilities and components.

## Project Structure

```plaintext
src/
├── __tests__/          # Test files
├── utils/              # Utility functions
│   ├── apiUtils.js     # Handles API interactions
│   ├── categoryInfo.js # Pre-defined category information
│   ├── categoryUtils.js # Categorization functions
│   ├── highlightUtils.js # Tooltip and DOM manipulation functions
├── popup.html          # HTML for the browser extension popup
├── popup.js            # JS logic for the popup
├── style.css           # Global styles
├── manifest.json       # Chrome extension manifest
```

## API Details

The project uses an AI language model API to generate explanations. Ensure the `ai` object is correctly configured and accessible in your environment.

### Key API Functions:

- `fetchExplanationFromAPIWithContext(sentence, title, description)`
- `generateExplanationWithPromptAPI(originalText, title, description)`

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.



### Author
[Cathal](https://github.com/isCathal)

---

Feel free to customize this README as needed!
