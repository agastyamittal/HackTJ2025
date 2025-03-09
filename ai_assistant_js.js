const apiKey = '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'; // Replace with your actual API key
const submitBtn = document.getElementById('submitBtn');
const promptInput = document.getElementById('promptInput');
const chatContainer = document.getElementById('chatContainer');

submitBtn.addEventListener('click', () => {
    const prompt = promptInput.value;

    if (prompt.trim() === '') {
        return;
    }

    // Append user message to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-blue-100 p-2 rounded-lg mb-2 self-end';
    userMessage.textContent = prompt;
    chatContainer.appendChild(userMessage);

    // Clear the input
    promptInput.value = '';

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Append loading message
    const loadingMessage = createMessageElement('Generating response...', true);
    chatContainer.appendChild(loadingMessage);

    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-instruct', // or another suitable model
            prompt: prompt,
            max_tokens: 2047 // Adjust as needed
        })
    })
    .then(response => response.json())
    .then(data => {
        chatContainer.removeChild(loadingMessage);

        // In ai_assistant_js.js, replace the AI response creation code with:
if (data.choices && data.choices.length > 0) {
    const responseMessage = createMessageElement(data.choices[0].text.trim(), true);
    chatContainer.appendChild(responseMessage);
} else {
    const errorMessage = createMessageElement('Error: Could not retrieve response.', true);
    chatContainer.appendChild(errorMessage);
}

        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
        chatContainer.removeChild(loadingMessage);

        // Append error message to chat
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bg-red-100 p-2 rounded-lg mb-2 self-start';
        errorMessage.textContent = 'An error occurred. Please try again.';
        chatContainer.appendChild(errorMessage);

        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
});