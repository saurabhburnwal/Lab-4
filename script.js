let feedbackSubmissions = [];

const form = document.querySelector('form');
const commentsTextarea = document.getElementById('comments');
const counterSpan = document.getElementById('counter');

commentsTextarea.addEventListener('input', function() {
    const currentLength = this.value.length;
    const maxLength = 50;
    
    counterSpan.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength) {
        this.value = this.value.substring(0, maxLength);
        counterSpan.textContent = `${maxLength}/${maxLength}`;
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comments = document.getElementById('comments').value;
    
    if (!name || !email || !department || !rating) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    const feedback = {
        id: Date.now(),
        name: name,
        email: email,
        department: department,
        rating: parseInt(rating),
        comments: comments
    };
    
    feedbackSubmissions.push(feedback);
    localStorage.setItem('feedbackSubmissions', JSON.stringify(feedbackSubmissions));
    
    showMessage('Thank you, ' + name + '! Feedback submitted successfully.', 'success');
    
    form.reset();
    counterSpan.textContent = '0/50';
    
    showFeedbacks();
});

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    messageDiv.className = 'fixed top-4 right-4 ' + bgColor + ' text-white px-6 py-3 rounded-lg z-50';
    messageDiv.textContent = text;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}

function showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'fixed top-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-lg z-50';
    welcomeDiv.textContent = 'Welcome Back! Thanks for returning.';
    
    document.body.appendChild(welcomeDiv);
    
    setTimeout(() => {
        document.body.removeChild(welcomeDiv);
    }, 3000);
}

function getDepartmentName(code) {
    if (code === 'ca') return 'Computer Applications';
    if (code === 'cs') return 'Computer Science';
    if (code === 'ps') return 'Psychology';
    if (code === 'co') return 'Commerce';
    return code;
}

function loadFeedbacks() {
    const stored = localStorage.getItem('feedbackSubmissions');
    if (stored) {
        feedbackSubmissions = JSON.parse(stored);
    }
}

function showFeedbacks() {
    let feedbackDisplay = document.getElementById('feedback-display');
    
    if (!feedbackDisplay) {
        feedbackDisplay = document.createElement('div');
        feedbackDisplay.id = 'feedback-display';
        feedbackDisplay.className = 'max-w-lg mx-auto mt-8';
        form.parentNode.insertBefore(feedbackDisplay, form.nextSibling);
    }
    
    feedbackDisplay.innerHTML = '';
    
    if (feedbackSubmissions.length === 0) {
        feedbackDisplay.innerHTML = '<div class="bg-white bg-opacity-50 rounded-lg p-6 text-center"><h2 class="text-xl font-bold text-purple-700 mb-4">Previous Feedback</h2><p class="text-gray-600">No feedback yet.</p></div>';
        return;
    }
    
    let html = '<div class="bg-white bg-opacity-50 rounded-lg p-6 mb-4"><h2 class="text-xl font-bold text-purple-700">Previous Feedback (' + feedbackSubmissions.length + ')</h2></div>';
    
    for (let i = feedbackSubmissions.length - 1; i >= 0; i--) {
        const feedback = feedbackSubmissions[i];
        
        html += `<div class="bg-white bg-opacity-50 rounded-lg p-4 mb-4 border-l-4 border-purple-500">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-bold text-gray-800">${feedback.name}</h3>
                    <p class="text-sm text-gray-600">${feedback.email}</p>
                    <p class="text-sm text-purple-600">${getDepartmentName(feedback.department)}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm font-medium">Rating: ${feedback.rating}/5</div>
                </div>
            </div>`;
        
        if (feedback.comments) {
            html += '<div class="bg-gray-50 rounded p-3"><p class="text-sm text-gray-700"><strong>Comments:</strong> ' + feedback.comments + '</p></div>';
        }
        
        html += '</div>';
    }
    
    html += '<div class="text-center"><button onclick="clearAllFeedbacks()" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">Clear All Feedback</button></div>';
    
    feedbackDisplay.innerHTML = html;
}

function clearAllFeedbacks() {
    if (confirm('Are you sure you want to clear all feedback?')) {
        feedbackSubmissions = [];
        localStorage.removeItem('feedbackSubmissions');
        showFeedbacks();
    }
}

window.clearAllFeedbacks = clearAllFeedbacks;

document.addEventListener('DOMContentLoaded', function() {
    loadFeedbacks();
    showFeedbacks();
    
    const hasVisited = sessionStorage.getItem('hasVisitedForm');
    
    if (hasVisited) {
        setTimeout(() => {
            showWelcomeMessage();
        }, 500);
    } else {
        sessionStorage.setItem('hasVisitedForm', 'true');
    }
});
