import { getContent } from "@/lib/content";
import HowToDonateContent from "@/components/sections/donate/HowToDonateContent";

// Server component: reads the Foundation's payment details from the
// staff-editable content sheet. Until PMAFI fills them in, the client component
// shows "being finalized" rather than inventing an account number.
export default async function HowToDonate() {
  const { contact, payment } = await getContent();

  return (
    <HowToDonateContent
      email={contact.email}
      bankName={payment.bankName}
      bankAccountName={payment.bankAccountName}
      bankAccountNumber={payment.bankAccountNumber}
      gcashName={payment.gcashName}
      gcashNumber={payment.gcashNumber}
    />
  );
}
