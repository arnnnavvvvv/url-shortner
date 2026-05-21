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

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});



app.use(errorHandler);

const PORT =
  Number(process.env.PORT) || 5000;

const startServer = async () => {

  try {

    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

      }
    );

    try {

      await connectRedis();

    } catch (redisError) {

      console.error(
        "Redis connection failed:",
        redisError
      );

    }

  } catch (error) {

    console.error(error);

  }

};

startServer();