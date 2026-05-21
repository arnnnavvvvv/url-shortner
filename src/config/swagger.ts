import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description:
        "Production-ready URL Shortener API"
    },

    servers: [
      {
        url: "http://localhost:5000"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ["./dist/routes/*.js"]
};

export const swaggerSpec =
  swaggerJsdoc(options);