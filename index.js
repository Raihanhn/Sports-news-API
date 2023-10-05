const PORT = process.env.PORT || 8000;

const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

const newspapers = [
  {
    name: "bbc",
    address: "https://www.bbc.com/sport",
    base: "https://www.bbc.com/",
  },
  {
    name: "dw",
    address: "https://www.dw.com/en/sports/s-8171",
    base: "https://www.dw.com",
  },
  {
    name: "dailymail",
    address: "https://www.dailymail.co.uk/sport/index.html",
    base: "https://www.dailymail.co.uk",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/uk/sport",
    base: "www.theguardian.com",
  },
  {
    name: "cnn",
    address: "https://edition.cnn.com/sport",
    base: "",
  },
  {
    name: "thesun",
    address: "https://www.thesun.co.uk/sport/",
    base: "",
  },
  {
    name: "express",
    address: "https://www.express.co.uk/sport",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/sport",
    base: "",
  },
  {
    name: "thedailystar",
    address: "https://www.thedailystar.net/sports",
    base: "",
  },
  {
    name: "kompas",
    address: "https://otomotif.kompas.com/sport",
    base: "",
  },
];
const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("sport")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Sports news API. search -> /news ");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAdress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;
  axios
    .get(newspaperAdress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("sport")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server runing on PORT ${PORT} `));
