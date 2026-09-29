import { array, boolean, number, object, string, tuple, type InferType } from 'yup';

const objectIdSchema = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();

const timeSchema = string()
  .trim()
  .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  .required();
const timeRangeSchema = object({
  startsAt: timeSchema,
  endsAt: timeSchema,
}).test('ordered-range', 'زمان پایان باید بعد از زمان شروع باشد.', (value) =>
  Boolean(value && value.startsAt < value.endsAt),
);
const dayScheduleSchema = array(timeRangeSchema.required()).required();

export const deliveryServiceAvailabilitySchema = object({
  sunday: dayScheduleSchema,
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
}).required();

const deliveryServiceFields = {
  title: string().trim().min(2).max(100).required(),
  title_fa: string().trim().min(2).max(100).required(),
  logo: string().trim().url().max(2048).required(),
  originCoordinates: tuple([
    number().min(-180).max(180).required(),
    number().min(-90).max(90).required(),
  ]).required(),
  availability: deliveryServiceAvailabilitySchema,
  basePrice: number().integer().min(0).default(0).required(),
  packingPrice: number().integer().min(0).default(0).required(),
  cityLeadDays: number().integer().min(0).required(),
  outsideCityLeadDays: number().integer().min(0).required(),
  pricePerKilometerInCity: number().integer().positive().required(),
  pricePerKilometer: number().integer().positive().required(),
  isEnable: boolean().default(true).required(),
};

export const deliveryServiceIdSchema = object({ id: objectIdSchema });
export const deliveryServiceQuerySchema = object({
  includeDisabled: boolean().default(false).required(),
});
export const availableDeliveryServicesQuerySchema = object({
  lat: number().min(-90).max(90).required(),
  lng: number().min(-180).max(180).required(),
});
export const deliveryServiceSchema = object(deliveryServiceFields);
export const updateDeliveryServiceSchema = object(deliveryServiceFields);

export type DeliveryServiceIdInput = InferType<typeof deliveryServiceIdSchema>;
export type DeliveryServiceQueryInput = InferType<typeof deliveryServiceQuerySchema>;
export type AvailableDeliveryServicesQueryInput = InferType<
  typeof availableDeliveryServicesQuerySchema
>;
export type DeliveryServiceAvailabilityInput = InferType<typeof deliveryServiceAvailabilitySchema>;
export type DeliveryServiceInput = InferType<typeof deliveryServiceSchema>;
export type UpdateDeliveryServiceInput = InferType<typeof updateDeliveryServiceSchema>;
