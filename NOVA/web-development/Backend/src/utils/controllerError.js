import ClientError from '../exceptions/ClientError.js';

export const handleControllerError = (err, res) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  console.error('SERVER ERROR:', err.message);

  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};