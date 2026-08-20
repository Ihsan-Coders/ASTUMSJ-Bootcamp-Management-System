const success = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, data, message });
};

const error = (res, message = 'Something went wrong', statusCode = 500) => {
  res.status(statusCode).json({ success: false, data: null, message });
};

module.exports = { success, error };
