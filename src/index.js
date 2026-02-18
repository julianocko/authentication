import express from "express";
import axios from "axios";
import { generateClientAssertion } from "./jwtService.js";

import devConfig from "../config/dev.js";
import stagingConfig from "../config/staging.js";
import productionConfig from "../config/production.js";

const app = express();
app.use(express.json());

const environments = {
    dev: devConfig,
    staging: stagingConfig,
    production: productionConfig
};

app.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

app.get("/access-token", async (req, res) => {

    const envName = req.query.env;

    if (!envName || !environments[envName]) {
        return res.status(400).json({
            error: "INVALID_ENVIRONMENT",
            message: "Use ?env=dev | staging | production"
        });
    }

    const config = environments[envName];

    try {

        const clientAssertion = generateClientAssertion(config);

        const response = await axios.post(
            config.tokenUrl,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: config.clientId,
                client_assertion_type:
                    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                client_assertion: clientAssertion,
                scope: config.scopes
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }
        );

        res.json({
            environment: envName,
            access_token: response.data.access_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type
        });

    } catch (error) {

        console.error("Erro ao obter token:", error.response?.data || error.message);

        res.status(500).json({
            error: "TOKEN_REQUEST_FAILED",
            details: error.response?.data || error.message
        });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Token Broker multi-ambiente rodando na porta ${port}`);
});
