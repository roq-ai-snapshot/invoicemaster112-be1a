import { OrganisationInterface } from 'interfaces/organisation';

export interface FinancialReportInterface {
  id?: string;
  organisation_id: string;
  report_date: Date;
  data: string;

  organisation?: OrganisationInterface;
  _count?: {};
}
