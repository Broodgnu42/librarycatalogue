const API_URL = 'https://librarybackend-1ajw.onrender.com/books';

function fetchBooks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(books => {
            const booksDiv = document.getElementById('books');
            booksDiv.innerHTML = books.map(book => `
                <div>
                    <strong>${book.title}</strong> by ${book.author} (${book.published_year})
                    <button onclick="deleteBook(${book.id})">Delete</button>
                </div>
            `).join('');
        });
}

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, genre, published_year: year })
    }).then(() => fetchBooks());
}

function deleteBook(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    }).then(() => fetchBooks());
}

document.addEventListener('DOMContentLoaded', fetchBooks);

document.getElementById('download-db-btn').addEventListener('click', function() {
    // Trigger the download of the database
    const API_URL = 'https://librarybackend-1ajw.onrender.com/download-db';
    
    // Create a link element
    const link = document.createElement('a');
    link.href = API_URL;
    link.download = 'library.db';  // Optional: Specify a custom filename for the download
    
    // Trigger the link click to initiate download
    link.click();
});
