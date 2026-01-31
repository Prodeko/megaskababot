FROM denoland/deno:2.6.7
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install openssl -y
COPY . .
RUN deno install --allow-scripts
RUN deno run --allow-all npm:prisma generate
CMD ["deno", "task", "start"]
