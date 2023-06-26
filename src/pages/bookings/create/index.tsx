import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createBooking } from 'apiSdk/bookings';
import { Error } from 'components/error';
import { bookingValidationSchema } from 'validationSchema/bookings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RouteInterface } from 'interfaces/route';
import { UserInterface } from 'interfaces/user';
import { getRoutes } from 'apiSdk/routes';
import { getUsers } from 'apiSdk/users';
import { BookingInterface } from 'interfaces/booking';

function BookingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BookingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBooking(values);
      resetForm();
      router.push('/bookings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BookingInterface>({
    initialValues: {
      route_id: (router.query.route_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: bookingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Booking
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<RouteInterface>
            formik={formik}
            name={'route_id'}
            label={'Select Route'}
            placeholder={'Select Route'}
            fetcher={getRoutes}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.origin}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'booking',
  operation: AccessOperationEnum.CREATE,
})(BookingCreatePage);
