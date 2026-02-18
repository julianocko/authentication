# JWT Assertion Service

Enterprise-ready service to generate OAuth2 Client Assertion (Private Key JWT - RS256).

## 🚀 How to Use

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure environment

Copy:

```bash
cp .env.example .env
```

Edit `.env` and set:

- CLIENT_ID
- TOKEN_URL
- PRIVATE_KEY_PATH
- PORT

### 3️⃣ Add your RSA Private Key

Place your private key file in the project root (e.g. private.pem).

### 4️⃣ Start the service

```bash
npm start
```

---

## 🔐 Endpoint

### GET /client-assertion

Returns:

```json
{
  "client_assertion": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🩺 Health Check

```
GET /health
```

---

## 🏗 Architecture

This service isolates private key usage from Postman or frontend applications.

Recommended for:

- Keycloak
- Open Banking
- Open Finance
- Enterprise OAuth2 flows

---

## 🔒 Security Recommendation

- Store private key securely
- Use Vault in production
- Restrict service access to internal network
