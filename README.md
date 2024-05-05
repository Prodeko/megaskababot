# Megaskababot
Telegram-botti urheilusuoritusten kirjaamiseen

## Komennot
`/start` - Käynnistä botti  
`/entry` - Kirjaa uusi suoritus  
`/entries` - Tarkastele suorituksiasi  
`/removelatest` - Poista viimeisin suorituksesi  
`/help` - Näytä avulias infopläjäys  
`/rules` - Näytä kisan säännöt  

## Lokaaliajo

1. Kloonaa repositorio
2. Luo tiedosto `.env` valmiin `.env.template`-tiedoston pohjalta
3. Käynnistä Docker
4. Käynnistä devaustietokanta ajamalla projektin juuressa komento `docker compose up`
5. Luo migraatiot ja Prisma clientin tyypit komennolla `npm run sync-prisma`
6. Käynnistä botti komennolla `npm start`

## Migraatiot

Tuotantotietokannan migraatiot saa luotua komennolla `npx prisma migrate deploy`. Tällöin .envin `DATABASE_URL` pitää kohdistua tuotantokantaan.

## Testidata

Testidataa voi luoda kommentoimalla sisään `src/index.ts`-tiedostossa olevan `createTestData`-funktion ja laittamalla botille /createtestdata -komennon. HUOM! Tämä poistaa kaikki olemassaolevat suoritukset.

Jotta testidataan tulisi satunnaisia luontipäivänmääriä, tulee kantaan tehä migraatio missä `createdAt`-kentästä poistetaan `@default(now())`-attribuutti.