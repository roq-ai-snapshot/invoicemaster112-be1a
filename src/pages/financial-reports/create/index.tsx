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
import { useRouter } from 'next/router';
import { createFinancialReport } from 'apiSdk/financial-reports';
import { Error } from 'components/error';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganisationInterface } from 'interfaces/organisation';
import { getOrganisations } from 'apiSdk/organisations';
import { FinancialReportInterface } from 'interfaces/financial-report';

function FinancialReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FinancialReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFinancialReport(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FinancialReportInterface>({
    initialValues: {
      report_date: new Date(new Date().toDateString()),
      data: '',
      organisation_id: (router.query.organisation_id as string) ?? null,
    },
    validationSchema: financialReportValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Financial Report
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'financial_report',
  operation: AccessOperationEnum.CREATE,
})(FinancialReportCreatePage);
