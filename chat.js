let activeChat = null;
let isCometChatInitialized = false;

const appID = "2716640ff7030782";
const appRegion = "US";
const authKey = "f2788c25155b8bd59578a499f50d31db459c18bf";

function initiateChat() {
    console.log('CometChat SDK loaded, initializing chat...');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        console.log('Current user found:', currentUser);
        initializeChat(currentUser)
            .then(() => {
                console.log('Chat initialized, displaying connections');
                displayConnections();
            })
            .catch(error => console.error('Failed to initialize chat:', error));
    } else {
        console.error('No current user found');
    }
}

// Function to handle chat initialization
async function initializeChat(currentUser) {
    if (!currentUser?.username) {
        console.error('Invalid user data');
        return;
    }

    try {
        console.log('Attempting to initialize CometChat...');

        // Initialize CometChat
        const appSetting = new CometChat.AppSettingsBuilder().subscribePresence().setRegion(appRegion).build();
        CometChat.init(appID, appSetting).then(
            () => {
                console.log("Initialization completed successfully");
                isCometChatInitialized = true;

                // Login to CometChat
                CometChat.login(currentUser.username, authKey).then(
                    user => {
                        console.log("Login Successful:", { user });

                        // Set up message listener
                        CometChat.addMessageListener(
                            "UNIQUE_LISTENER_ID",
                            new CometChat.MessageListener({
                                onTextMessageReceived: textMessage => {
                                    console.log("Text message received:", textMessage);
                                    if (textMessage.sender.uid === activeChat) {
                                        addMessageToUI(textMessage.text, 'received');
                                    }
                                },
                            })
                        );
                    },
                    error => {
                        console.log("Login failed with exception:", { error });
                        isCometChatInitialized = false;
                    }
                );
            },
            error => {
                console.log("Initialization failed with error:", error);
                isCometChatInitialized = false;
            }
        );
    } catch (error) {
        console.error('CometChat initialization failed:', error);
        isCometChatInitialized = false; // Ensure this is set to false on failure
    }
}

// Function to send messages
function sendMessage() {
    if (!activeChat) {
        alert('Please select a connection first');
        return;
    }

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message) return;

    if (!isCometChatInitialized) {
        console.warn('CometChat not initialized. Message will not be sent.');
        alert('CometChat is not initialized. Please refresh the page.');
        return;
    }

    const receiverID = activeChat;
    const messageText = message;
    const receiverType = CometChat.RECEIVER_TYPE.USER;
    const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

    CometChat.sendMessage(textMessage).then(
        message => {
            console.log("Message sent successfully:", message);
            messageInput.value = '';
            addMessageToUI(message, 'sent');
        },
        error => {
            console.log("Message sending failed with error:", error);
        }
    );
}

// Function to add message to UI
function addMessageToUI(message, type) {
    const messagesContainer = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to handle key press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Function to display connections
function displayConnections() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const connectionsList = document.getElementById('connections-list');
    
    console.log('Displaying connections...');

    if (!connectionsList) {
        console.error('Connections list element not found');
        return;
    }
    
    if (!currentUser || !users[currentUser.username]) {
        console.error('Missing required data for connections');
        connectionsList.innerHTML = '<div class="text-center text-gray-500 py-4">Missing user data</div>';
        return;
    }
    
    connectionsList.innerHTML = '';
    const connections = users[currentUser.username]?.connections || [];
    console.log('Found connections:', connections); // Debug log
    
    if (connections.length === 0) {
        connectionsList.innerHTML = '<div class="text-center text-gray-500 py-4">No connections yet</div>';
        return;
    }

    connections.forEach(username => {
        const connection = users[username];
        if (!connection) {
            console.warn(`Connection ${username} not found in users`);
            return;
        }

        const connectionElement = document.createElement('div');
        connectionElement.className = 'flex items-center p-3 hover:bg-gray-100 cursor-pointer';
        connectionElement.innerHTML = `
            <img src="${connection.profilePicture || 'https://i.imgur.com/VAn4QsU.jpeg'}" 
                 alt="${connection.firstName}"
                 class="w-10 h-10 rounded-full mr-3">
            <div>
                <div class="font-medium">${connection.firstName} ${connection.lastName}</div>
                <div class="text-sm text-gray-500">
                    ${connection.skills ? `Skills: ${connection.skills.join(', ')}` : 'No skills listed'}
                </div>
            </div>
        `;
        connectionElement.addEventListener('click', () => {
            console.log(`Clicked on connection: ${username}`);
            startChat(username);
        });
        connectionsList.appendChild(connectionElement);
    });
}

// Initialize chat when document loads
initiateChat();

function startChat(username) {
    activeChat = username;
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];
    
    if (!user) {
        console.error(`User ${username} not found in users data`);
    }

    document.getElementById('active-user-image').src = user.profilePicture;
    document.getElementById('active-user-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('messages-container').innerHTML = '';
    
    // Enable message input
    const messageInput = document.getElementById('message-input');
    messageInput.disabled = false;
    messageInput.placeholder = 'Type your message...';
    messageInput.focus();

    // Attach event listener to send button
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', sendMessage);

    // Get conversation history if needed
    if (isCometChatInitialized) {
        // You can add code here to fetch previous messages if needed
        console.log(`Started chat with ${username}`);
    } else {
        console.warn('CometChat not initialized properly');
    }
}