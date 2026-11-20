import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";
import { users } from "../src/db/schema";
import { UserAlreadyExistsError } from "../src/services/users-service";

describe("Users Feature", () => {
  it("schema users memiliki kolom yang sesuai", () => {
    expect(users.id).toBeDefined();
    expect(users.name).toBeDefined();
    expect(users.email).toBeDefined();
    expect(users.password).toBeDefined();
    expect(users.createdAt).toBeDefined();
  });

  it("password hash bcrypt berfungsi dengan baik", async () => {
    const rawPassword = "rahasia";
    const hash = await Bun.password.hash(rawPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });

    expect(hash.startsWith("$2b$") || hash.startsWith("$2a$")).toBe(true);
    expect(await Bun.password.verify(rawPassword, hash)).toBe(true);
    expect(await Bun.password.verify("salah", hash)).toBe(false);
  });

  it("error UserAlreadyExistsError memiliki pesan yang benar", () => {
    const error = new UserAlreadyExistsError();
    expect(error.message).toBe("Email sudah terdaftar");
  });

  it("endpoint POST /api/users menolak payload jika body kosong (validasi 422)", async () => {
    const app = new Elysia().use(usersRoute);

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(422);
  });
});
