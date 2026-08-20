const paginate = async (Model, filter = {}, page = 1, limit = 20, populateFields = '') => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Model.find(filter).skip(skip).limit(limit).populate(populateFields),
    Model.countDocuments(filter),
  ]);
  return {
    data,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  };
};

module.exports = paginate;
