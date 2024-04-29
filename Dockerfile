FROM node:20-alpine3.19
WORKDIR /usr/src/app
ENV BUN_INSTALL="$HOME/.bun/"
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="$BUN_INSTALL/bin:$PATH"
COPY . .
RUN bun install
RUN bunx prisma generate
CMD ["bun", "start"]