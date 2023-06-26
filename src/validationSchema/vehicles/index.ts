import * as yup from 'yup';

export const vehicleValidationSchema = yup.object().shape({
  make: yup.string().required(),
  model: yup.string().required(),
  year: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
