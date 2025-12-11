const { fetchFeedXml } = require("./fetchJobs.service");
const { parseXmlString } = require("./xmlParser.service");

async function importJobsFromFeed(feedUrl) {
  try {
    const xml = await fetchFeedXml(feedUrl);
    const parsed = parseXmlString(xml);
    const items = parsed?.rss?.channel?.item || [];
    const canonicalItems = Array.isArray(items) ? items : [items];
    return canonicalItems;
  } catch (err) {
    throw err;
  }
}

module.exports = { importJobsFromFeed };
