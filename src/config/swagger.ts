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
        url: "https://url-shortner-r77j.onrender.com"
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