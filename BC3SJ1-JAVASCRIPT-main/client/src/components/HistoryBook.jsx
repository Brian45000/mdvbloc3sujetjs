import React, { useState, useEffect } from "react";

const HistoryBook = () => {
  const [history, setHistory] = useState([]);
  const base = import.meta.env.VITE_BASE_API_URL || "/";

  useEffect(() => {
    fetch(base + "api/books/borrow/history", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleReturnBook = (borrowId) => {
    fetch(base + `api/books/return/${borrowId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          setHistory((prevHistory) =>
            prevHistory.map((borrow) =>
              borrow.id === borrowId
                ? {
                    ...borrow,
                    returnDate: new Date().toISOString().split("T")[0],
                  }
                : borrow
            )
          );
        } else {
          throw new Error("Erreur lors du retour du livre");
        }
      })
      .catch((error) => console.error("Erreur:", error));
  };

  const isOverdue = (returnPrevDate) => {
    const today = new Date().toISOString().split("T")[0];
    return returnPrevDate < today;
  };

  return (
    <div className="container">
      <h2>Historique des Emprunts</h2>
      {history.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date d'emprunt</th>
              <th>Date de retour prévue</th>
              <th>Date de retour</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((book) => (
              <tr key={book.id}>
                <td>{book.bookTitle}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.returnPrevDate).toLocaleDateString()}</td>
                <td>
                  {book.returnDate
                    ? new Date(book.returnDate).toLocaleDateString()
                    : "Non retourné"}
                </td>

                <td>
                  {!book.returnDate ? (
                    <button onClick={() => handleReturnBook(book.id)}>
                      Retourner
                    </button>
                  ) : (
                    "Livre rendu"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Vous n'avez pas encore emprunté de livres.</p>
      )}
      {history.some(
        (borrow) => !borrow.returnDate && isOverdue(borrow.returnPrevDate)
      ) && (
        <div className="alert">
          <p style={{ color: "red" }}>
            Vous avez des livres dont la date de retour est dépassée. Merci de
            les retourner dès que possible.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryBook;
