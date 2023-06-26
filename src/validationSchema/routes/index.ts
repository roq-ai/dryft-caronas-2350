import * as yup from 'yup';

export const routeValidationSchema = yup.object().shape({
  origin: yup.string().required(),
  destination: yup.string().required(),
  available_seats: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
