# Tömeg-rugó rendszer

Egy erőgerjesztéses tömeg-rugó rendszer modellezése és szimulációja.

## Szimuláció

A `dist/` könyvtár tartalmával lehet lehet megtekinteni a szimulációt. Az `index.html` weboldalt megnyitva az alapértelmezett böngészőben, a szimuláció magától elindul az alapértelmezett értékekkel. A paramétereket a szövegdobozok segítségével lehet változtatni, a változás érvényesüléséhez a modell újraindítása szükséges. Frissítés után a paraméterek visszaállnak alapértékeikre.

## Fordítás forráskódból

A forráskód az `src/` mappában található. Akár a JavaScript nyelv ismerete nélkül is olvasható, alaposan kommentelt kód.

A futtatáshoz [npm](https://www.npmjs.com/get-npm) szükséges, a megfelelő mappából lefuttatva az alábbi parancs letölti a függőségeket:

```
npm install
```

Ha feltelepült, akkor az alábbi parancs elindít egy lokális szervert, amely az alapértelmezett böngészőben megnyitja a szimulációt.

```
npm run dev
```

Ezt a Ctrl+C segítségével tudjuk leállítani. Amennyiben újra szeretnénk indítani a függőségek újra letöltése már nem szükséges, csak a második parancsot kell lefuttatni.

Ameddig ez a program fut, addig a forráskód megváltoztatása azonnal változtat a weboldalon is, újraindítás ebben az esetben nem kell. Ezzel például megváltoztathatjuk az alapértelmezett paramétereket.

## Felhasznált technológiák

* [npm](https://www.npmjs.com/) - package manager
* [Webpack](https://webpack.js.org/) - module bundler
* [P5](https://p5js.org/) - grafikon rajzolás és DOM manipuláció