const API_URL = 'https://librarybackend-1ajw.onrender.com/books';

function fetchBooks() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    // Fetch the books from the API
    fetch(API_URL)
        .then(response => response.json())
        .then(books => {
            // Dynamically populate the category filter
            populateCategoryFilter(books);

            // Filter books based on search query and category
            let filteredBooks = books;

            // Search Filter
            if (searchQuery) {
                filteredBooks = filteredBooks.filter(book =>
                    book.title.toLowerCase().includes(searchQuery) ||
                    book.author.toLowerCase().includes(searchQuery)
                );
            }

            // Category Filter
            if (selectedCategory) {
                filteredBooks = filteredBooks.filter(book =>
                    book.genre && book.genre.toLowerCase() === selectedCategory.toLowerCase()
                );
            }

            // Sorting
            filteredBooks = filteredBooks.sort((a, b) => {
                if (sortBy === 'title') {
                    return a.title.localeCompare(b.title);
                } else if (sortBy === 'author') {
                    return a.author.localeCompare(b.author);
                } else if (sortBy === 'published_year') {
                    return a.published_year - b.published_year;
                }
                return 0;
            });

            // Render the filtered and sorted books
            const booksDiv = document.getElementById('books');
            booksDiv.innerHTML = filteredBooks.map((book, index) => {
                const backgroundColorClass = index % 2 === 0 ? 'white' : 'lightgrey'; // Alternating colors
                return `
                    <div class="${backgroundColorClass}">
                        <strong>${book.title}</strong>
                        <div>${book.author} (${book.published_year})</div> 
                        <div class="button-container">
                            <button onclick="deleteBook(${book.id})">Delete</button>
                            <button onclick="editBook(${book.id})">Edit</button>
                        </div>
                        <div>
                            K: ${book.kstatus} (${book.krates}), 
                            J: ${book.jstatus} (${book.jrates})
                        </div>
                        ${book.notes}
                    </div>
                `;
            }).join('');

        });
}

// Function to populate the category filter dynamically
function populateCategoryFilter(books) {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Get all unique categories from the books
    const categories = [...new Set(books.map(book => book.genre))];

    // Clear existing options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    // Add options for each unique category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const kstatus = document.getElementById('kstatus').value;
    const krates = document.getElementById('krates').value;
    const jstatus = document.getElementById('jstatus').value;
    const jrates = document.getElementById('jrates').value;
    const notes = document.getElementById('notes').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, genre, published_year: year, kstatus, krates, jstatus, jrates, notes })
    }).then(() => fetchBooks());
}

function deleteBook(id) {
    const userConfirmed = confirm("Are you sure you want to delete this book?");
    if (userConfirmed) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        }).then(() => fetchBooks())
          .catch(error => console.error('Error deleting the book:', error));
    } else {
        console.log("Delete action canceled.");
    }
}

function editBook(id) {
    // Fetch the current data of the book
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(data => {
            // Populate the input fields with the current data
            document.getElementById('title').value = data.title;
            document.getElementById('author').value = data.author;
            document.getElementById('genre').value = data.genre;
            document.getElementById('year').value = data.published_year;
            document.getElementById('krates').value = data.krates;
            document.getElementById('jrates').value = data.jrates;
            document.getElementById('kstatus').value = data.kstatus;
            document.getElementById('jstatus').value = data.jstatus;
            document.getElementById('notes').value = data.notes;
            
            // Update the form to show a commit button
            const commitButton = document.getElementById('commit-button');
            commitButton.style.display = 'inline-block';
            commitButton.onclick = function() {
                commitChanges(id);
            };
        })
        .catch(error => console.error('Error fetching book data:', error));
}

function commitChanges(id) {
    const updatedBook = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        published_year: document.getElementById('year').value,
        krates: document.getElementById('krates').value,
        jrates: document.getElementById('jrates').value,
        kstatus: document.getElementById('kstatus').value,
        jstatus: document.getElementById('jstatus').value,
        notes: document.getElementById('notes').value
    };

    // Send the updated data to the server
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    })
    .then(() => {
        alert('Book updated successfully!');
        fetchBooks();  // Refetch the list of books to reflect the changes
    })
    .catch(error => console.error('Error updating book:', error));
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
