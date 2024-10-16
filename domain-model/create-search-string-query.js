const createSearchStringQuery = search => ({
  or: [{ name: { iLike: `%${search.replace(' ', '%')}%` } }],
});
module.exports = createSearchStringQuery;
