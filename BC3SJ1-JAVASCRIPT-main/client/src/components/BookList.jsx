import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/booklist.css";

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null); // Ajouter l'état pour l'ID de l'utilisateur
  const base = import.meta.env.VITE_BASE_API_URL || "/";

  useEffect(() => {
    fetch(base + "api/books", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Erreur:", error));
    fetch(base + "api/session", {
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error("Account not found");
      })
      .then((data) => {
        setUserRole(data.user.role || "Guest");
        setUserId(data.user.id); // Mettre à jour l'ID de l'utilisateur
      })
      .catch((error) => setUserRole("Guest"));
  }, []);

  const handleAddBook = () => {
    navigate("/add_book");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleBorrowBook = (bookId) => {
    fetch(base + `api/books/borrow/${bookId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Inclure l'ID de l'utilisateur dans le corps de la requête
    })
      .then((response) => {
        if (response.status === 200) {
          // Mettre à jour l'état du livre après l'emprunt
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === bookId ? { ...book, statut: "Emprunté" } : book
            )
          );
        } else {
          throw new Error("Erreur lors de l'emprunt du livre");
        }
      })
      .catch((error) => console.error("Erreur:", error));
  };

  return (
    <div className="container">
      <h2>Liste des Livres - Librairie XYZ</h2>
      {books.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Date de publication</th>
              <th>Statut</th>
              <th>Détails</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    className="book-image"
                    src={book.photo_url}
                    alt={book.titre}
                  />
                </td>
                <td>{book.titre}</td>
                <td>{book.auteur}</td>
                <td>{book.date_publication}</td>
                <td>{book.statut}</td>
                <td>
                  <a href={`${base}book/${book.id}`}>Voir les détails</a>
                </td>
                <td>
                  {book.statut === "disponible" && (
                    <button onClick={() => handleBorrowBook(book.id)}>
                      Emprunter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Erreur lors de la récupération des livres.</p>
      )}
      {userRole === "admin" && (
        <button onClick={handleAddBook}>Ajouter un livre</button>
      )}
      <button onClick={handleHome}>Retour à l'accueil</button>
    </div>
  );
};

export default BookList;
