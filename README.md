# Megaskababot

Telegram-botti urheilusuoritusten kirjaamiseen

## Komennot

`/start` - Käynnistä botti\
`/entry` - Kirjaa uusi suoritus\
`/entries` - Tarkastele suorituksiasi\
`/removelatest` - Poista viimeisin suorituksesi\
`/help` - Näytä avulias infopläjäys\
`/rules` - Näytä kisan säännöt

## Lokaaliajo

1. Kloonaa repositorio
2. Luo tiedosto `.env` valmiin `.env.template`-tiedoston pohjalta.
3. Päivitä uuteen `.env`iin ainakin `BOT_TOKEN`. Voit luoda botin seuraten
   [Telegramin virallisia ohjeita](https://core.telegram.org/bots/tutorial)
4. Käynnistä Docker
5. Käynnistä devaustietokanta ajamalla projektin juuressa komento
   `docker compose up` TAI avaa projekti dev kontissa VSCodessa
6. Luo migraatiot ja Prisma clientin tyypit komennolla `deno task sync-prisma`
7. Käynnistä botti komennolla `deno task start`

## Migraatiot

Tuotantotietokannan migraatiot saa luotua komennolla
`deno run -A npm:prisma migrate deploy`. Tällöin .envin `DATABASE_URL` pitää
kohdistua tuotantokantaan.
