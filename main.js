const umip = document.getElementById('umip');
const umis = document.getElementById('umis');
const umiso = document.getElementById('umiso');
const umisi = document.getElementById('umisi');
const sign_in_button = document.getElementById('sign_in_button');
const create_account_button = document.getElementById('create_account_button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const createUsernameInput = document.getElementById('new-username');
const createPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const colors = {
    primary: '#3B82F6',   // Blue-600
    secondary: '#1F2937', // Gray-800
    accent: '#10B981',    // Emerald-500
    error: '#EF4444',     // Red-500
    background: '#F3F4F6' // Gray-100
  };

umip.addEventListener('click', (e) => {
    window.location.href = "profile.html";
});

umis.addEventListener('click', (e) => {
    window.location.href = "settings.html";
});

umiso.addEventListener('click', (e) => {
    window.location.href = "sign_out.html";
});

umisi.addEventListener('click', () => {
        window.location.href = "sign_in.html";
    });
function signInFunction() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    console.log('Attempting login with:', { username, password }); // Debug log
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        if (users[username].password === password) {
            // Store current user info
            localStorage.setItem('currentUser', JSON.stringify({
                username: username,
                firstName: users[username].firstName,
                lastName: users[username].lastName
            }));
            
            console.log('Login successful, redirecting...'); // Debug log
            window.location.href = "homepage_afs.html";
        } else {
            console.log('Password mismatch'); // Debug log
            alert('Incorrect password');
        }
    } else {
        console.log('User not found:', username); // Debug log
        alert('Username not found');
    }
}
function updateProfilePicture(imageData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (!currentUser || !users || !currentUser.username) {
            console.error('User data not found');
            return false;
        }

        // Update profile picture in users object
        users[currentUser.username].profilePicture = imageData;
        localStorage.setItem('users', JSON.stringify(users));

        // Update ALL profile pictures immediately
        document.querySelectorAll(`
            img[src*="V4RclNb"],
            img[src*="VAn4QsU"],
            #profile-pic,
            .header-profile-pic,
            [alt="Profile Picture"],
            [alt="User Avatar"],
            [alt="AI"],
            [alt=""],
            #user-menu-button img,
            button[type="button"] img
        `).forEach(img => {
            img.src = imageData;
            img.onerror = function() {
                this.src = 'https://i.imgur.com/V4RclNb.jpeg';
            };
        });

        // Add load event listener to update images when page loads
        window.addEventListener('load', function updateAllImages() {
            document.querySelectorAll(`
                img[src*="V4RclNb"],
                img[src*="VAn4QsU"],
                #profile-pic,
                .header-profile-pic,
                [alt="Profile Picture"],
                [alt="User Avatar"],
                [alt="AI"],
                [alt=""],
                #user-menu-button img,
                button[type="button"] img
            `).forEach(img => {
                img.src = imageData;
                img.onerror = function() {
                    this.src = 'https://i.imgur.com/V4RclNb.jpeg';
                };
            });
        });

        // Add page visibility change listener
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                document.querySelectorAll(`
                    img[src*="V4RclNb"],
                    img[src*="VAn4QsU"],
                    #profile-pic,
                    .header-profile-pic,
                    [alt="Profile Picture"],
                    [alt="User Avatar"],
                    [alt="AI"],
                    [alt=""],
                    #user-menu-button img,
                    button[type="button"] img
                `).forEach(img => {
                    img.src = imageData;
                    img.onerror = function() {
                        this.src = 'https://i.imgur.com/V4RclNb.jpeg';
                    };
                });
            }
        });

        return true;
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return false;
    }
}
function createAccountFunction() {
    try {
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;

        // Input validation
        if (!newUsername || !newPassword || !confirmPassword || !firstName || !lastName) {
            alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Get existing users
        let users = JSON.parse(localStorage.getItem('users') || '{}');

        if (users[newUsername]) {
            alert('Username already exists');
            return;
        }

        // Add new user with default placeholder image
        users[newUsername] = {
            password: newPassword,
            firstName: firstName,
            lastName: lastName,
            skills: [],
            interests: [],
            bio: "Hello!",
            profession: "Unemployed",
            connections: [],
            connectionRequests: [],
            profilePicture: 'https://i.imgur.com/V4RclNb.png' // Default placeholder image
        };

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Create current user object
        const currentUser = {
            username: newUsername,
            firstName: firstName,
            lastName: lastName
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = "homepage_afs.html";
        alert('Account created successfully!');
        
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account: ' + error.message);
    }
}
 
// Add event listener
document.addEventListener('DOMContentLoaded', function() {
    const create_account_button = document.getElementById('create_account_button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const profilePictures = document.querySelectorAll('img[src*="V4RclNb.jpeg"]');

    if (currentUser && users && users[currentUser.username] && users[currentUser.username].profilePicture) {
        updateProfilePicture(users[currentUser.username].profilePicture);
    }
    if (create_account_button) {
        create_account_button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked, form values:', {
                username: document.getElementById('new-username').value,
                firstName: document.getElementById('fname').value,
                lastName: document.getElementById('lname').value
            });
            createAccountFunction();
        });
    }
    if (currentUser && users && users[currentUser.username] && users[currentUser.username].profilePicture) {
        profilePictures.forEach(img => {
            img.src = users[currentUser.username].profilePicture;
            
            // Add error handler to fall back to default if load fails
            img.onerror = function() {
                img.src = 'https://i.imgur.com/V4RclNb.jpeg';
            };
        });
    }
});

// Replace or update the existing sign-in button listener
sign_in_button.addEventListener('click', (e) => {
    e.preventDefault();  // Prevent the default action
    e.stopPropagation(); // Stop event bubbling
    signInFunction();
});

// Update create account button listener if it exists
if (create_account_button) {
    create_account_button.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent the default action
        e.stopPropagation(); // Stop event bubbling
        createAccountFunction();
    });
}

function deleteAccountFunction() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));

        if (!currentUser || !users || !currentUser.username) {
            console.error('User data not found');
            alert('User data not found');
            return;
        }

        // Delete the current user's data
        delete users[currentUser.username];

        // Save the updated users object back to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Remove currentUser from localStorage
        localStorage.removeItem('currentUser');

        alert('Account deleted successfully!');
        window.location.href = "homepage_bfs.html";
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account: ' + error.message);
    }
}

