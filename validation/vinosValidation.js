import Joi from "joi";

export const vinosValidacion = (data) => {
  const schema = Joi.object({
    nombre_vino: Joi.string().required(), 
    tipo: Joi.string()
      .valid("tinto", "blanco", "rosado", "espumante") 
      .required(), 
    bodega: Joi.string().length(24).hex().required(), 
  });

  return schema.validate(data);
};
