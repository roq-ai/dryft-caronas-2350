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
import { createRoute } from 'apiSdk/routes';
import { Error } from 'components/error';
import { routeValidationSchema } from 'validationSchema/routes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { RouteInterface } from 'interfaces/route';

function RouteCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RouteInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRoute(values);
      resetForm();
      router.push('/routes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RouteInterface>({
    initialValues: {
      origin: '',
      destination: '',
      available_seats: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: routeValidationSchema,
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
            Create Route
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="origin" mb="4" isInvalid={!!formik.errors?.origin}>
            <FormLabel>Origin</FormLabel>
            <Input type="text" name="origin" value={formik.values?.origin} onChange={formik.handleChange} />
            {formik.errors.origin && <FormErrorMessage>{formik.errors?.origin}</FormErrorMessage>}
          </FormControl>
          <FormControl id="destination" mb="4" isInvalid={!!formik.errors?.destination}>
            <FormLabel>Destination</FormLabel>
            <Input type="text" name="destination" value={formik.values?.destination} onChange={formik.handleChange} />
            {formik.errors.destination && <FormErrorMessage>{formik.errors?.destination}</FormErrorMessage>}
          </FormControl>
          <FormControl id="available_seats" mb="4" isInvalid={!!formik.errors?.available_seats}>
            <FormLabel>Available Seats</FormLabel>
            <NumberInput
              name="available_seats"
              value={formik.values?.available_seats}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('available_seats', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.available_seats && <FormErrorMessage>{formik.errors?.available_seats}</FormErrorMessage>}
          </FormControl>
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
  entity: 'route',
  operation: AccessOperationEnum.CREATE,
})(RouteCreatePage);
