import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { ReactNode } from 'react';
import EmailTemplateForm from './partials/email-template-form';

interface Props extends SharedData {
   template: Settings<EmailTemplateFields> & { preview_html?: string };
}

const EmailTemplateBuilder = ({ template }: Props) => {
   return <EmailTemplateForm template={template} />;
};

EmailTemplateBuilder.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default EmailTemplateBuilder;
