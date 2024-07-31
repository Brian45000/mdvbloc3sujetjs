const request = require("supertest");
const app = require("../server"); //

describe("API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "john@smith.com", password: "azerty" });
    token = res.body.token;
  });

  it("devrait retourner la liste des livres", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Cookie", `token=${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  it("devrait retourner la liste des utilisateurs", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Cookie", `token=${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  it("devrait emprunter un livre", async () => {
    const res = await request(app)
      .post("/api/books/borrow/4")
      .set("Cookie", `token=${token}`)
      .send({ userId: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Livre emprunté avec succès");
  });

  it("devrait retourner un livre", async () => {
    const res = await request(app)
      .post("/api/books/return/9")
      .set("Cookie", `token=${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Livre retourné avec succès");
  });
});
