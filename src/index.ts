import { Elysia } from "elysia";
import { checkDatabaseConnection } from "./db";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    status: "ok",
    message: "Server ElysiaJS + Bun berjalan dengan baik!",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", async ({ set }) => {
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      set.status = 503;
      return {
        status: "degraded",
        server: "running",
        database: "disconnected",
        message: "Database MySQL belum terhubung atau server database belum aktif",
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: "healthy",
      server: "running",
      database: "connected",
      message: "Server dan koneksi MySQL berjalan dengan sehat",
      timestamp: new Date().toISOString(),
    };
  })
  .use(usersRoute)
  .listen(port);

console.log(
  `🚀 Server Elysia berjalan di http://${app.server?.hostname || "localhost"}:${app.server?.port || port}`
);

export type App = typeof app;
