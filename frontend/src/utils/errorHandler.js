/**
 * Extrae de forma universal y amigable el mensaje de error de cualquier respuesta de la API de Express
 * Soporta respuestas de express-validator, AppError personalizado, errores de red y excepciones genéricas.
 *
 * @param {Error|Object} error - Objeto de error capturado
 * @param {string} defaultMessage - Mensaje por defecto si no se encuentra otro
 * @returns {string} Mensaje de error formateado para el usuario
 */
export const extractErrorMessage = (error, defaultMessage = 'Ocurrió un error inesperado') => {
  if (!error) return defaultMessage;

  // 1. Array de errores de express-validator: { errors: [ { msg: "...", path: "..." } ] }
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
    const firstError = error.response.data.errors[0];
    if (typeof firstError === 'string') return firstError;
    if (firstError?.msg) return firstError.msg;
    if (firstError?.message) return firstError.message;
  }

  // 2. Mensaje estándar envuelto por Express: { success: false, message: "..." }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // 3. Objeto error simple: { error: "..." }
  if (typeof error.response?.data?.error === 'string') {
    return error.response.data.error;
  }

  // 4. Errores de conexión o red
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'El servidor tardó demasiado en responder (Tiempo de espera agotado).';
  }

  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return 'No se pudo conectar con el servidor backend. Verifique que la API esté encendida en el puerto 3000.';
  }

  // 5. Mensaje nativo de Error si existe
  if (error.message && typeof error.message === 'string' && !error.message.includes('object Object')) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Mapea los errores de validación de express-validator a un objeto estructurado por campos para formularios
 * @param {Error|Object} error
 * @returns {Record<string, string>} Mapa de { [campo]: "mensaje de error" }
 */
export const extractFieldErrors = (error) => {
  const fieldErrors = {};
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    error.response.data.errors.forEach((err) => {
      const fieldName = err.path || err.param || err.field;
      if (fieldName && err.msg) {
        fieldErrors[fieldName] = err.msg;
      }
    });
  }
  return fieldErrors;
};
