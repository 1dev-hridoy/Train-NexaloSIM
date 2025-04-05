# Train-NexaloSIM

A Node.js script to bulk train the Nexalo SIM API with a stylish console interface featuring progress bars, color gradients, and abstract text designs.

## Features

- **Bulk Training**: Trains multiple question-answer pairs from a JSON file in one go.
- **Styled Console**: Displays training progress with:
  - Color gradients for logs (success: green-to-cyan, error: red-to-yellow, info: blue-to-magenta).
  - A cyan progress bar showing percentage, item count, and ETA.
  - Abstract headers and footers with rainbow gradients.
  - Boxed separation for each training item.
- **Error Handling**: Logs detailed errors to both console and a file (`training_log.txt`).
- **Configurable**: Easily adjust API key, JSON file path, and other settings.

## Prerequisites

- **Node.js**: Version 16.0.0 or higher.
- **Nexalo Account**: Required to obtain an API key.

## Getting Started

### 1. Obtain an API Key from Nexalo

To use this project, you need an API key from Nexalo. Follow these steps:

- **Sign Up**: Go to [Nexalo Dashboard](https://nexalo.xyz/dashboard/sign-up). Create an account by filling out the registration form.
- **Sign In**: After signing up, log in to your Nexalo account.
- **Create an API Key**: Navigate to [Nexalo API](https://nexalo.xyz/dashboard/api). Click on "Create API" or a similar option. Enter a project name (e.g., "BulkTrainSim") and generate the API key. Copy the API key provided (it will look something like `MAINPOINT` or a unique string).
- **Use the API Key**: Open your code editor (e.g., VS Code). In the `index.js` file, replace the `SIM_API_KEY` value (`'MAINPOINT'`) with your copied API key. **Do not share it in chat or public forums.**

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/bulk-train-sim.git
cd bulk-train-sim
```

Replace `your-username` with your GitHub username.

### 3. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

This installs `axios`, `chalk`, `gradient-string`, and `progress`.

### 4. Prepare Training Data

Edit the `training_data.json` file with your question-answer pairs. Example format:

```json
[
  {
    "question": "Kemon aco?",
    "answer": "Bhalo achi.",
    "response_type": "text",
    "language": "bn",
    "sentiment": "positive",
    "category": "greeting",
    "response": "Bhalo achi.",
    "type": "good"
  },
  {
    "question": "Ki dekho?",
    "answer": "",
    "response_type": "image",
    "language": "bn",
    "sentiment": "neutral",
    "category": "visual",
    "response": "",
    "type": "good",
    "image_url": "https://example.com/image.jpg"
  }
]
```

- **Required**: `question`.
- **Optional**: `answer`, `response_type` (defaults to `"text"`), `language` (defaults to `"bn"`), `sentiment` (defaults to `"neutral"`), `category` (defaults to `"general"`), `response` (defaults to `answer`), `type` (defaults to `"good"`), `image_url` (for `"image"` response type).

### 5. Run the Script

Start the training process:

```bash
npm start
```

Or:

```bash
node index.js
```

### Console Output

The script provides a visually appealing console experience:

#### Header:

```text
 B U L K   T R A I N I N G     
====================================
```

#### Progress Bar:

```text
Training [██████████░░░░░░░░░░░░] 33% | 1/3 | ETA: 2s
```

#### Training Item:

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│ Training Item 1/3 │ [2025-04-05T14:00:01.000Z] Successfully trained: Question: 'Kemon aco?' ... 
└────────────────────────────────────────────────────────────────────────────────┘
```

#### Footer:

```text
T R A I N I N G   C O M P L E T E D     
====================================
```

Logs are also saved to `training_log.txt`.

## Configuration

Edit `index.js` to customize:

- **SIM_API_BASE_URL**: Default is `'https://sim.api.nexalo.xyz/v1/train'`. Change if your API endpoint differs.
- **SIM_API_KEY**: Replace `'MAINPOINT'` with your Nexalo API key.
- **LANGUAGE**: Default is `'bn'` (Bangla). Adjust as needed (e.g., `'en'`, `'hi'`).
- **JSON_FILE_PATH**: Path to your JSON file (default: `'training_data.json'`).
- **LOG_FILE_PATH**: Path to the log file (default: `'training_log.txt'`).

## Troubleshooting

- **API Errors**: If you see "Invalid API key" or similar, ensure your API key is correct and active on Nexalo. If reCAPTCHA appears, contact Nexalo support for a bot-friendly key or endpoint.
- **Connection Issues**: Check your internet connection and the API URL.
- **Logs**: Review `training_log.txt` for detailed error messages.

## Contributing

Feel free to fork this repository, submit issues, or create pull requests to improve the project!

## License

This project is open-source and available under the [LICENSE](/LICENSE).

## Contact

For support or questions, reach out via [GitHub Issues](https://github.com/1dev-hridoy/Train-NexaloSIM/issues) or Nexalo’s support channels.