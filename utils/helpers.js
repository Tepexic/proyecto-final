/**
 * Helper function to validate id
 * @param {*} id  Id to be validated
 * @returns { Boolean }  Returns true if id is valid, false otherwise
 */
const isIdValid = (id) => {
  const parsedId = parseInt(id);
  return !isNaN(parsedId) && parsedId !== null;
};

/**
 * Helper function to handle asyncronous requests
 * @param {*} fn Function to be executed, e.g. Cart.save
 * @param {*} context  Context to be used, e.g. Cart
 * @param  {...any} args  Arguments to be passed to the fn function, e.g. cartId
 * @returns { Object }  Returns an object with the result of the fn function and
 * an error object in the form {data, error}
 */
async function withAsync(fn, context, ...args) {
  try {
    const { data } = await fn.bind(context, ...args)();
    return {
      data,
      error: null,
    };
  } catch (err) {
    const error = {};
    if (err?.response) {
      error.status = err.response.status;
      error.message = err.response.data.message;
    } else if (err?.request) {
      error.status = null;
      error.message = err.toJSON().message;
    } else {
      error.status = null;
      error.message = err.message || "Something Went Wrong";
    }
    return {
      data: null,
      error,
    };
  }
}

module.exports = {
  isIdValid,
  withAsync,
};
