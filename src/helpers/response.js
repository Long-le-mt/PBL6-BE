// https://github.com/cryptlex/rest-api-response-format
export default class Response {
  static success(res, data, status = 200) {
    res.status(status);
    if (data) {
      return res.json({
        status: "success",
        data: data.docs,
        pagination: data.pagination,
      });
    }

    return res.json({
      status: "success",
      data,
    });
  }

  static error(res, error, status = 400) {
    res.status(status);
    return res.json({
      success: "failed",
      error: {
        message: error.message,
        code: error.code,
        errors: error.errors,
      },
    });
  }
}