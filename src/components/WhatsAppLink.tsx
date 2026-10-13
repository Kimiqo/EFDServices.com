import { AnchorHTMLAttributes } from 'react';
import { contactDetails } from '../data/contactDetails';

type WhatsAppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'>;

export default function WhatsAppLink(props: WhatsAppLinkProps) {
  return <a {...props} href={contactDetails.whatsappUrl} target="_blank" rel="noopener noreferrer" />;
}
