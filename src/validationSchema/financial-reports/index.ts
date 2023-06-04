import * as yup from 'yup';

export const financialReportValidationSchema = yup.object().shape({
  report_date: yup.date().required(),
  data: yup.string().required(),
  organisation_id: yup.string().nullable().required(),
});
