const withAsync = async (fn, context, ...args) => {
  try {
    const { data } = await fn.bind(context, ...args)();
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

module.exports = withAsync;
