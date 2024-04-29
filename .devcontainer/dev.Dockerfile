FROM node:20
WORKDIR /namu
RUN apt-get update && apt-get install -y git

ENV BUN_INSTALL="$HOME/.bun/"
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="$BUN_INSTALL/bin:$PATH"
COPY package.json bun.lockb ./
RUN bun install