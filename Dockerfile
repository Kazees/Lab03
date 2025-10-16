# Baseado na imagem nginx:alpine
FROM nginx:alpine

# Copia tudo que estiver na pastar src
COPY src/ /usr/share/nginx/html

# Expor a porta 80 do container para que possamos nos conectar a ela
EXPOSE 80