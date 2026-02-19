# 🚀 JWT Assertion Service

### Token Broker OAuth2 Corporativo (Private Key JWT - RS256)

------------------------------------------------------------------------

## 📌 Visão Geral

O **jwt-assertion-service** é um Token Broker OAuth2 de nível
corporativo responsável por:

1.  🔐 Gerar um `client_assertion` assinado com **RS256**
2.  🔄 Enviar o assertion para o Keycloak
3.  🎟️ Receber o `access_token`
4.  📤 Retornar o token assinado pronto para consumo pelas APIs

Ele implementa o padrão:

> OAuth2 Client Credentials com Private Key JWT

Muito utilizado em:

-   Open Banking
-   Open Finance
-   Integrações B2B
-   Arquiteturas Zero Trust
-   Ambientes corporativos regulados

------------------------------------------------------------------------

# 🏗 Arquitetura

    Postman / Cliente
            ↓
    JWT Assertion Service
            ↓
    Keycloak (OIDC)
            ↓
    Access Token Assinado
            ↓
    API Protegida

------------------------------------------------------------------------

# 🌍 Suporte Multiambiente

O serviço suporta múltiplos ambientes via parâmetro de query:

    GET /access-token?env=dev
    GET /access-token?env=staging
    GET /access-token?env=production

Cada ambiente define:

-   PRIVATE_KEY_PATH
-   TOKEN_URL
-   CLIENT_ID
-   SCOPES

Arquivos de configuração:

    /config
       ├── dev.js
       ├── staging.js
       └── production.js

------------------------------------------------------------------------

# 📁 Estrutura do Projeto

    jwt-assertion-service
     ├── src
     │    ├── index.js
     │    └── jwtService.js
     ├── config
     ├── keys
     ├── Dockerfile
     ├── docker-compose.yml
     ├── .gitignore
     └── README.md

------------------------------------------------------------------------

# 🔐 Segurança

-   ❌ As chaves privadas NÃO são versionadas no GitHub
-   🔒 A pasta `/keys` está ignorada no `.gitignore`
-   🔐 As chaves são montadas como read-only no Docker
-   🔁 Preparado para futura integração com Vault

------------------------------------------------------------------------

# ⚙️ Executando Localmente (Node)

## 1️⃣ Instalar dependências

``` bash
npm install
```

## 2️⃣ Garantir que as chaves existam

    keys/dev.pem
    keys/staging.pem
    keys/prod.pem

## 3️⃣ Iniciar o serviço

``` bash
npm start
```

Servidor disponível em:

    http://localhost:3000

------------------------------------------------------------------------

# 🐳 Utilização com Docker

## Build da imagem

``` bash
docker compose build
```

## Subir container

``` bash
docker compose up -d
```

## Verificar containers ativos

``` bash
docker ps
```

## Health Check

    http://localhost:3000/health

Resposta esperada:

``` json
{ "status": "UP" }
```

------------------------------------------------------------------------

# 🎯 Endpoint Principal

## 🔹 Obter Access Token

    GET /access-token?env=dev

Exemplo:

    http://localhost:3000/access-token?env=dev

Resposta:

``` json
{
  "environment": "dev",
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "token_type": "Bearer"
}
```

------------------------------------------------------------------------

# 🧠 Fluxo Interno

1️⃣ Carrega configuração do ambiente\
2️⃣ Lê a chave privada correspondente\
3️⃣ Gera o payload JWT:

``` json
{
  "aud": TOKEN_URL,
  "exp": agora + 30min,
  "nbf": agora,
  "sub": CLIENT_ID,
  "iss": CLIENT_ID,
  "iat": agora,
  "jti": uuid
}
```

4️⃣ Assina utilizando RS256\
5️⃣ Envia requisição para o Keycloak\
6️⃣ Retorna o access_token

------------------------------------------------------------------------

# 📬 Como Utilizar no Postman

## 1️⃣ Criar variável de ambiente

    environment = dev

## 2️⃣ Adicionar Pre-request Script

``` javascript
const env = pm.environment.get("environment");

pm.sendRequest({
    url: `http://localhost:3000/access-token?env=${env}`,
    method: "GET"
}, function (err, res) {

    if (err || res.code !== 200) {
        throw new Error("Falha ao obter access_token");
    }

    const json = res.json();

    pm.environment.set("access_token", json.access_token);
});
```

## 3️⃣ Utilizar nas requisições protegidas

Header Authorization:

    Bearer {{access_token}}

------------------------------------------------------------------------

# 🏢 Padrão Corporativo

Este projeto segue padrões OAuth2 corporativos utilizados por:

-   Instituições financeiras
-   Ambientes regulados
-   Integrações B2B seguras

------------------------------------------------------------------------

# 🚀 Evoluções Futuras

-   Cache de token por ambiente
-   Docker secrets para chaves privadas
-   Logging estruturado
-   Deploy em Kubernetes
-   Rotação automática de chaves

------------------------------------------------------------------------

JWT Assertion Service -- Token Broker OAuth2 Corporativo
