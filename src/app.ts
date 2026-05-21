import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middleware/error.middleware";
import { redirectToUrl } from "./controllers/url.controller";
import { logger } from "./middleware/logger.middleware";
import { connectRedis } from "./config/redis";
import { rateLimiterMiddleware} from "./middleware/rateLimit.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec }from "./config/swagger";

dotenv.config();

const app = express();

app.use(express.json());

app.use(logger);

app.use(rateLimiterMiddleware);

app.use( "/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);

app.use("/urls", urlRoutes);

app.get("/:shortCode", redirectToUrl);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

const startServer = async () => {

  await connectRedis();

  app.listen(PORT, () => {
    console.log(
      `Server running on port "http://localhost:${PORT}"`
    );
  });

};

startServer();