import BookList from "../src/components/BookList"; // Assurez-vous que le chemin est correct
import { act, cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const booksMock = [
  {
    id: 1,
    titre: "Livre 1",
    auteur: "Auteur 1",
    date_publication: "2023-01-01",
    statut: "disponible",
    photo_url: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    titre: "Livre 2",
    auteur: "Auteur 2",
    date_publication: "2023-01-02",
    statut: "emprunté",
    photo_url: "https://via.placeholder.com/150",
  },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(booksMock),
  })
);

describe("Composant BookList", () => {
  beforeEach(() => {
    cleanup();
    global.alert = vi.fn();
  });

  it("doit rendre le composant BookList correctement", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      );
    });

    expect(
      screen.getByText("Liste des Livres - Librairie XYZ")
    ).toBeInTheDocument();
  });

  it("doit rendre la liste des livres", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Livre 1")).toBeInTheDocument();
    expect(screen.getByText("Livre 2")).toBeInTheDocument();
    expect(screen.getByText("Auteur 1")).toBeInTheDocument();
    expect(screen.getByText("Auteur 2")).toBeInTheDocument();
  });

  it("doit afficher le bouton 'Emprunter'", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Emprunter")).toBeInTheDocument();
  });
});
