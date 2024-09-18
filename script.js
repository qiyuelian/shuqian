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
    const json = JSON.stringify(bookmarks);
    // In a real app, you'd send this to a server or API
    console.log('Bookmarks saved:', json);
    // For demo purposes, we'll just update the file in the repo
    // This won't actually work in the browser, it's just to show the concept
    // You'd need to implement a server-side solution to actually update the file
}

function renderBookmarks() {
    const list = document.getElementById('bookmarkList');
    list.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
        const li = document.createElement('li');
        li.className = 'bookmark';
        li.innerHTML = `
            <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
            <button onclick="deleteBookmark(${index})">Delete</button>
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
    renderBookmarks();
    event.target.reset();
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarks();
    renderBookmarks();
}

document.getElementById('bookmarkForm').addEventListener('submit', addBookmark);
loadBookmarks();