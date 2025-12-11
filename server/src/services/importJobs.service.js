const { fetchFeedXml } = require("./fetchJobs.service");

async function importJobsFromFeed(feedUrl) {
  try {
    const xml = await fetchFeedXml(feedUrl);
  } catch (err) {
    throw err;
  }
}

module.exports = { importJobsFromFeed };
