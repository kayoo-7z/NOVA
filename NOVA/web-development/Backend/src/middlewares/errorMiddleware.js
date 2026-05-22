import ClientError from '../exceptions/ClientError.js';

const errorMiddleware = (error, req, res, next) => {
  void next;  

  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
      status: 'failed',
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};

export default errorMiddleware;