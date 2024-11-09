// Fonction asynchrone pour rechercher des livres
async function searchBooks() {
    const query = document.getElementById("bookFinderInput").value.trim();
    const language = document.getElementById("languageSelector").value;
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "<div class='loading-spinner'></div>";

    if (query === "") {
        bookList.innerHTML = "<p>Veuillez entrer un nom de livre.</p>";
        return;
    }

    let apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    if (language) {
        apiUrl += `&language=${language}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        bookList.innerHTML = "";

        if (data.docs.length === 0) {
            bookList.innerHTML = "<p>Aucun livre trouvé.</p>";
            return;
        }

        data.docs.slice(0, 10).forEach(book => {
            const title = book.title || "Titre inconnu";
            const author = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
            const publishDate = book.first_publish_year || "Date inconnue";
            const coverId = book.cover_i;
            const url = `https://openlibrary.org${book.key}`;

            const bookItem = document.createElement("div");
            bookItem.className = "book-item";

            const coverImg = document.createElement("img");
            coverImg.src = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "https://via.placeholder.com/80";
            coverImg.alt = `Couverture de ${title}`;

            const bookDetails = document.createElement("div");
            bookDetails.className = "book-details";
            bookDetails.innerHTML = `
                <h3>${title}</h3>
                <p>Auteur(s): ${author}</p>
                <p>Publié en: ${publishDate}</p>
                <a href="${url}" target="_blank" class="more-info-link">Plus d'informations</a>
            `;

            bookItem.appendChild(coverImg);
            bookItem.appendChild(bookDetails);
            bookList.appendChild(bookItem);
        });
    } catch (error) {
        bookList.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
        console.error("Error fetching books:", error);
    }
}

