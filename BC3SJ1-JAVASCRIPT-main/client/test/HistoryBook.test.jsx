import HistoryBook from "../src/components/HistoryBook"; // Assurez-vous que le chemin est correct
import { act, cleanup, render, screen } from "@testing-library/react";

const borrowHistoryMock = [
  {
    id: 1,
    bookTitle: "Livre 1",
    borrowDate: "2023-01-01",
    returnPrevDate: "2023-01-31",
    returnDate: null,
  },
  {
    id: 2,
    bookTitle: "Livre 2",
    borrowDate: "2023-01-02",
    returnPrevDate: "2023-02-01",
    returnDate: "2023-02-02",
  },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(borrowHistoryMock),
  })
);

describe("Composant HistoryBook", () => {
  beforeEach(() => {
    cleanup();
    global.alert = vi.fn();
  });

  it("doit rendre le composant HistoryBook correctement", async () => {
    await act(async () => {
      render(<HistoryBook />);
    });

    expect(screen.getByText("Historique des Emprunts")).toBeInTheDocument();
  });

  it("doit rendre la liste des emprunts", async () => {
    await act(async () => {
      render(<HistoryBook />);
    });

    expect(screen.getByText("Livre 1")).toBeInTheDocument();
    expect(screen.getByText("Livre 2")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
  });

  it("doit afficher le bouton 'Retourner'", async () => {
    await act(async () => {
      render(<HistoryBook />);
    });

    expect(screen.getByText("Retourner")).toBeInTheDocument();
  });

  it("doit afficher 'Livre rendu' pour les livres rendus", async () => {
    await act(async () => {
      render(<HistoryBook />);
    });

    expect(screen.getByText("Livre rendu")).toBeInTheDocument();
  });
});
