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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRouteById, updateRouteById } from 'apiSdk/routes';
import { Error } from 'components/error';
import { routeValidationSchema } from 'validationSchema/routes';
import { RouteInterface } from 'interfaces/route';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function RouteEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RouteInterface>(
    () => (id ? `/routes/${id}` : null),
    () => getRouteById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RouteInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRouteById(id, values);
      mutate(updated);
      resetForm();
      router.push('/routes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RouteInterface>({
    initialValues: data,
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
            Edit Route
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'route',
  operation: AccessOperationEnum.UPDATE,
})(RouteEditPage);
