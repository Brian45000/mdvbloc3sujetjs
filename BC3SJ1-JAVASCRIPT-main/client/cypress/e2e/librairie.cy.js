describe("Librairie", () => {
  it("login", function () {
    cy.visit("http://localhost:5173/");
    cy.get(":nth-child(1) > a").click();
    cy.get('[type="text"]').clear("jo");
    cy.get('[type="text"]').type("john@smith.com");
    cy.get('[type="password"]').clear("a");
    cy.get('[type="password"]').type("azerty");
    cy.get("button").click();
  });

  it("liste des livres", function () {
    cy.visit("http://localhost:5173/");
    cy.get(":nth-child(1) > a").click();
    cy.get('[type="text"]').clear("jo");
    cy.get('[type="text"]').type("john@smith.com");
    cy.get('[type="password"]').clear();
    cy.get('[type="password"]').type("azerty");
    cy.get("button").click();
    cy.visit("http://localhost:5173/books");
  });

  it("emprunt d'un livre", function () {
    cy.visit("http://localhost:5173/");
    cy.get(":nth-child(1) > a").click();
    cy.get('[type="text"]').clear("jo");
    cy.get('[type="text"]').type("john@smith.com");
    cy.get('[type="password"]').clear();
    cy.get('[type="password"]').type("azerty");
    cy.get("button").click();
    cy.visit("http://localhost:5173/books");
    cy.get(":nth-child(2) > :nth-child(7) > button").click();
  });

  it("retour d'un livre", function () {
    cy.visit("http://localhost:5173/");
    cy.get(":nth-child(1) > a").click();
    cy.get('[type="text"]').clear("jo");
    cy.get('[type="text"]').type("john@smith.com");
    cy.get('[type="password"]').clear();
    cy.get('[type="password"]').type("azerty");
    cy.get("button").click();
    cy.visit("http://localhost:5173/history_books");
  });
});
