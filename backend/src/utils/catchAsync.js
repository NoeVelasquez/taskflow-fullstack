/**
 * Envoltorio para controladores asíncronos en Express.
 * Evita la redundancia de bloques try-catch repetitivos, capturando cualquier
 * error y propagándolo automáticamente al middleware de manejo de errores global.
 *
 * @param {Function} fn - Función del controlador asíncrono.
 * @returns {Function} Express middleware handler.
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
