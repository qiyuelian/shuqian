let bookmarks = [];

function loadBookmarks() {
    fetch('bookmarks.json')
        .then(response => response.json())
        .then(data => {
            bookmarks = data;
            renderBookmarks();
        })
        .catch(() => {
            console.log('No bookmarks found or error loading bookmarks.');
        });
}

function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
}

function renderBookmarks() {
    const list = document.getElementById('bookmarkList');
    list.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
        const li = document.createElement('li');
        li.className = 'bg-white shadow-md rounded-md p-4';
        li.innerHTML = `
            <div class="flex justify-between items-center">
                <a href="${bookmark.url}" target="_blank" class="text-blue-600 hover:underline">${bookmark.title}</a>
                <button onclick="deleteBookmark(${index})" class="text-red-500 hover:text-red-700">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function addBookmark(event) {
    event.preventDefault();
    const title = document.getElementById('bookmarkTitle').value;
    const url = document.getElementById('bookmarkUrl').value;
    bookmarks.push({ title, url });
    saveBookmarks();
    event.target.reset();
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarks();
}

function backupToGitHub() {
    const token = prompt("Please enter your GitHub personal access token:");
    if (!token) return;

    const content = btoa(JSON.stringify(bookmarks, null, 2));
    const date = new Date().toISOString().split('T')[0];
    const commitMessage = `Backup bookmarks ${date}`;

    fetch('https://api.github.com/repos/你的用户名/你的仓库名/contents/bookmarks.json', {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: commitMessage,
            content: content,
            sha: '', // 如果文件已存在，你需要提供当前文件的SHA
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            alert('Backup successful!');
        } else {
            alert('Backup failed. Please check your token and try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during backup. Please try again.');
    });
}

document.getElementById('bookmarkForm').addEventListener('submit', addBookmark);
document.getElementById('backupButton').addEventListener('click', backupToGitHub);

// Load bookmarks from localStorage on page load
const savedBookmarks = localStorage.getItem('bookmarks');
if (savedBookmarks) {
    bookmarks = JSON.parse(savedBookmarks);
    renderBookmarks();
} else {
    loadBookmarks();
}
