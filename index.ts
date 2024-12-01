import fs from "fs-extra";
import xml from "xml";
import cheerio from "cheerio";

(async function createRssFeed() {
  console.log("creating feed");
  const feedObject = {
    rss: [
      {
        _attr: {
          version: "2.0",
          "xmlns:atom": "http://www.w3.org/2005/Atom",
        },
      },
      {
        channel: [
          {
            "atom:link": {
              _attr: {
                href: "https://tvollmer89.github.io/dudick-xml-feed/feed.rss",
                rel: "self",
                type: "application/rss+xml",
              },
            },
          },
          {
            title: "Dudick XML Feed",
          },
          {
            link: "https://tvollmer89.github.io/dudick-xml-feed/",
          },
          { description: "Reformatting the Carboline DPM Product Feed" },
          { language: "en-US" },
          // todo: add the feed items here
        ],
      },
    ],
  };

  const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

  await fs.writeFile("/feed.rss", feed, "utf8");
})();