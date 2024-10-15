import Joi from "joi";

export const bodegasValidacion = (req, res, next) => {
  console.log(req.body);  // Verifica el contenido del cuerpo
  const schema = Joi.object({
    nombre: Joi.string().required(),
    vinos: Joi.array().items(Joi.string().length(24).hex()).required(),
    tags: Joi.array().items(Joi.string()).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error.details);
    return res.status(400).json({ error: error.details[0].message });
  }

  next();  // Pasa al siguiente middleware si no hay errores
};
