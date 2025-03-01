# Megaskababot

Telegram-botti urheilusuoritusten kirjaamiseen

## Teknologiat

Megaskababot käyttää javascript-runtimenaan [Denoa](https://deno.com/) ja
Telegram-APIn kanssa juttelemiseen [Grammya](https://grammy.dev/). Tiedot
tallennetaan [Postgres-tietokantaan](https://www.postgresql.org/) käyttäen
[Prismaa](https://www.prisma.io/).

Keskustelujen tila muistetaan Grammyn
[Conversations-lisäosan](https://grammy.dev/plugins/conversations) avulla. Näin
monivaiheiset keskusteluflow't voidaan säilyttää esim. botin
uudelleenkäynnistyksen yli.

## Lokaaliajo

1. Kloonaa repositorio
2. Luo tiedosto `.env` valmiin `.env.template`-tiedoston pohjalta.
3. Päivitä uuteen `.env`iin ainakin `BOT_TOKEN`. Voit luoda botin seuraten
   [Telegramin virallisia ohjeita](https://core.telegram.org/bots/tutorial)
4. Käynnistä Docker
5. Käynnistä devaustietokanta ajamalla projektin juuressa komento
   `docker compose up` TAI avaa projekti dev kontissa VSCodessa
6. Luo migraatiot ja Prisma clientin tyypit komennolla `deno task sync-prisma`
7. Käynnistä botti komennolla `deno task dev`

## Deplaus

Megaskababot on parasta deplata tuotantoympäristöön webhook-tilassa.
Devausympäristössä se pyörii oletuksena long polling -tilassa. Jos
ympäristömuuttuja `NODE_ENV`in arvo on `production`, käytetään automaattisesti
webhook-tilaa.

Botti tarvitsee seuraavat ympäristömuuttujat toimiakseen:

- BOT_TOKEN: Telegram-botin API-token (esim.
  `1234567890:QqWwEeRrTtYyUuIiOoPpÅåAaSsDdFfGgHhJ`)
- ADMIN_PASSWORD: Admin-komentojen ja analytiikkaendpointtien salasana. (esim.
  `prodekonsuksethajos`). OLETUKSENA `admin`!
- WEBHOOK_URL: Webhook-moodissa domain, josta botin saa kiinni. (esim.
  `example.com`)
- NODE_ENV: `development` tai `production`
- DATABASE_URL: Postgres-tietokannan URL.
  (esim.`DATABASE_URL=postgres://dev-user:dev-password@db:5432/dev-megaskababot`)

## Migraatiot

Tuotantotietokannan migraatiot saa luotua komennolla
`deno run -A npm:prisma migrate deploy`. Tällöin .envin `DATABASE_URL` pitää
kohdistua tuotantokantaan.
