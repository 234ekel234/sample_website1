import { getContent } from "@/lib/content";
import ContactDetailsContent from "@/components/sections/contact/ContactDetailsContent";

// Server component: reads contact details from the staff-editable content sheet
// and hands them to the client component that animates them.
export default async function ContactDetails() {
  const { contact } = await getContent();

  return <ContactDetailsContent email={contact.email} phone={contact.phone} />;
}
