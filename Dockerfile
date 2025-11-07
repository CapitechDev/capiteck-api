FROM node:22-alpine

RUN apk add --no-cache openssl

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN yarn install

# Copiar o restante do código da aplicação
COPY . .

RUN npx prisma generate

RUN yarn build

RUN yarn cache clean

ARG PORT

ARG DATABASE_URL

ENV PORT=${PORT}

ENV DATABASE_URL=${DATABASE_URL}

# Expor a porta que a aplicação irá rodar
EXPOSE ${PORT}

# Comando para iniciar a aplicação
CMD ["yarn", "start:prod"]
