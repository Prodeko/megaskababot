FROM denoland/deno:2.1.5
WORKDIR /usr/src/app
COPY . .
RUN deno install
RUN deno run --allow-all npm:prisma generate
CMD ["deno", "start"]