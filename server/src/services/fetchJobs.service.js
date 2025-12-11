const axios = require("axios");

async function fetchFeedXml(feedUrl, opts = {}) {
  const timeout = opts.timeout || 20000;
  try {
    const res = await axios.get(feedUrl, {
      timeout,
      responseType: "text",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}

module.exports = { fetchFeedXml };
