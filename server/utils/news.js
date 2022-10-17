const fs = require("fs");
const puppeteer = require("puppeteer");

// scrape news from source and save them in 'news.json'
const fetchNews = () => {
  try {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.foxnews.com/sports");

      const result = await page.evaluate(() => {
        let articles = [];

        let foo = document.querySelectorAll(
          ".collection-article-list .article-list .article"
        );
        foo.forEach((el) => {
          const img = el.querySelector(".m img").src;
          const header = el.querySelector(".info h4").innerText;
          const url = el.querySelector(".m a").href;

          articles.push({
            img,
            header,
            url,
          });
        });

        return articles;
      });

      fs.writeFile("./json/news.json", JSON.stringify(result), (err) => {
        if (err) throw err;
      });

      await browser.close();
    })();
  } catch (error) {
    console.log(error);
  }
};

const getNews = () => {
  setInterval(() => {
    fetchNews();
  }, 1000 * 60 * 60);
};

module.exports = { getNews };
