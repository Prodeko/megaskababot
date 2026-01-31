FROM denoland/deno:2.6.7
WORKDIR /namu
RUN apt-get update && apt-get install -y git
COPY package.json deno.lock ./
RUN deno install
