# 📚 BookFinder — წიგნების კატალოგის საძიებო ვებგვერდი

**ცოცხალი ვერსია:** https://bookcatalogproject.vercel.app

BookFinder არის React-ზე აგებული წიგნების საძიებო კატალოგი. მონაცემებს იღებს Open Library API-დან.

## გვერდები
- **მთავარი** — პოპულარული წიგნები და ძიება
- **წიგნები** — შემთხვევითი წიგნები სხვადასხვა ჟანრიდან („სხვა წიგნები“ ღილაკით)
- **რჩეულები** — შენ მიერ არჩეული წიგნები (თავიდან ცარიელია)

## ფუნქციები
- ძიება სათაურით ან ავტორით, ქართულადაც (ავტომატური თარგმანი)
- ძიების მინიშნებები აკრეფისას (კლავიატურით მართვა ↑ ↓ Enter Esc)
- რჩეული წიგნები ინახება ბრაუზერში
- დღის / ღამის რეჟიმი
- რესპონსიული დიზაინი ყველა ზომის ეკრანისთვის
- შეცდომების დამუშავება: 15 წამის ლიმიტი და „თავიდან ცდა“ ღილაკი

## ტექნოლოგიები
React · Vite · JavaScript (fetch, async/await) · CSS (Grid, Flexbox, Media Queries) · Open Library API · Git / GitHub · Vercel

## სტრუქტურა
```
src/
├── services/bookService.js   — API-დან მონაცემების წამოღება
├── hooks/                    — useBooks, useFavorites, useTheme, usePage
├── components/               — Header, Footer, SearchBar, BookSection, BookCard (თითოეული თავისი CSS-ით)
├── pages/                    — HomePage, BooksPage, FavoritesPage (თითოეული თავისი CSS-ით)
├── App.jsx                   — გვერდების გადართვა
├── index.css                 — საერთო სტილები და ფერები
└── main.jsx
```

## გაშვება
```bash
npm install
npm run dev
```

**ავტორი:** გიორგი ბობოხიძე
