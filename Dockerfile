# En lugar de esto:
# FROM node:18

# Usa esto:
FROM node:20

# Y luego continúa con tu configuración:
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "index.js"]
