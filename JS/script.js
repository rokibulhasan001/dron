// DOM Elements
const title = document.getElementById("titleOverlay");
let titleTimeout;
let currentUserToken = localStorage.getItem('userToken');

// Handle Title Visibility
function hideTitle() {
    if (title) {
        title.classList.add("hidden");
    }
}

function showTitle() {
    if (title) {
        title.classList.remove("hidden");
    }
}

// Automatically hide and show title overlay
titleTimeout = setTimeout(hideTitle, 4000);
setTimeout(showTitle, 42000);

// Fetch and Display User Info
async function fetchUserInfo() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${currentUserToken}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            displayUserInfo(result.data.user);
            return true;
        } else {
            localStorage.removeItem('userToken');
            currentUserToken = null;
            return false;
        }
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        return false;
    }
}

// Logout Functionality
function logout() {
    localStorage.removeItem('userToken');
    currentUserToken = null;
    location.reload();
}

// Signup Popup Controls
function showPopup() {
    const popup = document.getElementById("signup-popup");
    if (popup) popup.style.display = "flex";
}

function hidePopup() {
    const popup = document.getElementById("signup-popup");
    if (popup) popup.style.display = "none";
}

// Add this function to handle form submission
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        message: document.getElementById('contact-message').value
    };

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: '5f4564d4-ecc8-43bb-b502-efb6eccd6248',
                ...formData
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Message sent successfully!');
            event.target.reset();
        } else {
            throw new Error(data.message || 'Failed to send message');
        }
    } catch (error) {
        alert('Error sending message. Please try again later.');
        console.error('Error:', error);
    }
}

// DOM Ready Event
document.addEventListener('DOMContentLoaded', async () => {
    const signupPopup = document.getElementById('signup-popup');
    const investorsBtn = document.getElementById('investors');
    const closePopupBtn = document.querySelector('.close-popup');

    // If user is logged in, fetch and display info
    if (currentUserToken) {
        const isValidUser = await fetchUserInfo();
        if (isValidUser && investorsBtn) {
            investorsBtn.style.display = 'none';
        }
    }

    // Open popup on button click
    if (investorsBtn) {
        investorsBtn.addEventListener('click', showPopup);
    }

    // Close popup on 'X' click
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hidePopup);
    }

    // Close popup on outside click
    if (signupPopup) {
        signupPopup.addEventListener('click', (e) => {
            if (e.target === signupPopup) {
                hidePopup();
            }
        });
    }

    // Responsive Sidebar Navigation
    const menuIcon = document.querySelector('.menu_icon');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const closeSidebarBtn = document.querySelector('.sidebar-close');
    const body = document.body;

    // Open Sidebar
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            sidebar.style.transform = 'translateX(0)';
            body.style.overflow = 'hidden'; 
        });
    }

    // Close Sidebar
    function closeSidebar() {
        sidebar.style.transform = 'translateX(100%)';
        body.style.overflow = '';
    }

    // Close on sidebar link click
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Close on close button click
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    // Close on outside click
    document.addEventListener('mousedown', (e) => {
        if (
            sidebar.style.transform === 'translateX(0)' &&
            !sidebar.contains(e.target) &&
            !menuIcon.contains(e.target)
        ) {
            closeSidebar();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});