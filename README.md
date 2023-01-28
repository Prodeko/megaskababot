# Megaskababot
Telegram-botti urheilusuoritusten kirjaamiseen

## Lokaaliajo

1. Kloonaa repositorio
2. Luo tiedosto `.env` valmiin `.env.template`-tiedoston pohjalta
2. Käynnistä Docker
3. Käynnistä devaustietokanta ajamalla projektin juuressa komento `docker compose up`
4. Luo migraatiot komennolla `npm run migrate`
4. Käynnistä botti komennolla `npm start`

## Migraatiot

Tuotantotietokannan migraatiot saa luotua komennolla `npx prisma migrate deploy`. Tällöin .envin `DATABASE_URL` pitää kohdistua tuotantokantaan.

