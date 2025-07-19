const {
    Client,
    Environment,
    LogLevel,
    OrdersController,
} = require("@paypal/paypal-server-sdk");
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = require("../config");

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_SECRET_KEY,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: {
            logBody: true,
        },
        logResponse: {
            logHeaders: true,
        },
    },
});

const ordersController = new OrdersController(client);

module.exports = { ordersController };
