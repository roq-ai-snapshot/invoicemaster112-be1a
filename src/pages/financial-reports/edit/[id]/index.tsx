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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getFinancialReportById, updateFinancialReportById } from 'apiSdk/financial-reports';
import { Error } from 'components/error';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';
import { FinancialReportInterface } from 'interfaces/financial-report';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganisationInterface } from 'interfaces/organisation';
import { getOrganisations } from 'apiSdk/organisations';

function FinancialReportEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FinancialReportInterface>(
    () => (id ? `/financial-reports/${id}` : null),
    () => getFinancialReportById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FinancialReportInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFinancialReportById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FinancialReportInterface>({
    initialValues: data,
    validationSchema: financialReportValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Financial Report
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="report_date" mb="4">
              <FormLabel>report_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.report_date}
                onChange={(value: Date) => formik.setFieldValue('report_date', value)}
              />
            </FormControl>
            <FormControl id="data" mb="4" isInvalid={!!formik.errors?.data}>
              <FormLabel>data</FormLabel>
              <Input type="text" name="data" value={formik.values?.data} onChange={formik.handleChange} />
              {formik.errors.data && <FormErrorMessage>{formik.errors?.data}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganisationInterface>
              formik={formik}
              name={'organisation_id'}
              label={'organisation_id'}
              placeholder={'Select Organisation'}
              fetcher={getOrganisations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
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
  entity: 'financial_report',
  operation: AccessOperationEnum.UPDATE,
})(FinancialReportEditPage);
