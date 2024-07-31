const express = require("express");
const router = express.Router();
const db = require("./../services/database");
const { authenticateToken } = require("./../middlewares/auth");

router

  .get("/", (_, res) => {
    const sql = "SELECT * FROM livres";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  })

  .post("/", (req, res) => {
    const {
      title,
      author,
      date_publication,
      isbn,
      description,
      status,
      cover,
    } = req.body;
    const sql =
      "INSERT INTO livres (titre, auteur, date_publication, isbn, description, statut, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        title,
        author,
        date_publication,
        isbn,
        description,
        status || "disponible",
        cover,
      ],
      (err) => {
        if (err) res.status(400).send("Erreur d'envoi");
        res.send("Livre ajouté");
      }
    );
  })

  .get("/:id", (req, res) => {
    const sql = "SELECT * FROM livres WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })

  .put("/:id", (req, res) => {
    const {
      title,
      author,
      published_date,
      isbn,
      description,
      status,
      photo_url,
    } = req.body;
    const sql =
      "UPDATE livres SET titre = ?, auteur = ?, date_publication = ?, isbn = ?, description = ?, statut = ?, photo_url = ? WHERE id = ?";
    db.query(
      sql,
      [
        title,
        author,
        published_date,
        isbn,
        description,
        status,
        photo_url,
        req.params.id,
      ],
      (err, result) => {
        if (err) throw err;
        res.send("Livre mis à jour");
      }
    );
  })

  .delete("/:id", (req, res) => {
    const sql = "DELETE FROM livres WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
      if (err) throw err;
      res.send("Livre supprimé");
    });
  })

  .post("/borrow/:id", authenticateToken, (req, res) => {
    const { userId } = req.body;
    const bookId = req.params.id;
    const dateEmprunt = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const dateRetourPrev = new Date();
    dateRetourPrev.setDate(dateRetourPrev.getDate() + 30); // Add 30 days
    const dateRetourPrevFormatted = dateRetourPrev.toISOString().split("T")[0];

    const borrowSql =
      'UPDATE livres SET statut = "emprunté", emprunte_par = ?, date_emprunt = ? WHERE id = ? AND statut = "disponible"';
    db.query(borrowSql, [userId, dateEmprunt, bookId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'emprunt du livre");
      } else if (result.affectedRows === 0) {
        res.status(400).send("Livre non disponible ou déjà emprunté");
      } else {
        const insertBorrowSql =
          "INSERT INTO emprunts (livre_id, utilisateur_id, date_emprunt, date_retour_prev) VALUES (?, ?, ?, ?)";
        db.query(
          insertBorrowSql,
          [bookId, userId, dateEmprunt, dateRetourPrevFormatted],
          (err) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .send("Erreur lors de l'enregistrement de l'emprunt");
            } else {
              res.send("Livre emprunté avec succès");
            }
          }
        );
      }
    });
  })

  .get("/borrow/history", authenticateToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
      SELECT l.titre AS bookTitle, b.date_emprunt AS borrowDate, b.date_retour AS returnDate, b.date_retour_prev AS returnPrevDate, b.id
      FROM livres AS l
      JOIN emprunts AS b ON l.id = b.livre_id
      WHERE b.utilisateur_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send("Erreur lors de la récupération de l'historique des emprunts");
      } else {
        res.json(results);
      }
    });
  })

  .post("/return/:id", authenticateToken, (req, res) => {
    const borrowId = req.params.id;
    const userId = req.user.id;
    const sqlUpdateEmprunt =
      "UPDATE emprunts SET date_retour = NOW() WHERE id = ? AND utilisateur_id = ?";
    const sqlUpdateLivre =
      "UPDATE livres SET statut = 'disponible', emprunte_par = NULL, date_emprunt = NULL WHERE id = (SELECT livre_id FROM emprunts WHERE id = ?) AND emprunte_par = ?";

    db.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erreur lors du retour du livre");
      }

      db.query(sqlUpdateEmprunt, [borrowId, userId], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).send("Erreur lors du retour du livre");
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res
              .status(400)
              .send(
                "Emprunt non trouvé ou vous n'êtes pas autorisé à retourner ce livre"
              );
          });
        }

        db.query(sqlUpdateLivre, [borrowId, userId], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).send("Erreur lors de la mise à jour du livre");
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res
                  .status(500)
                  .send("Erreur lors de la validation de la transaction");
              });
            }

            res.send("Livre retourné avec succès");
          });
        });
      });
    });
  });

module.exports = router;
