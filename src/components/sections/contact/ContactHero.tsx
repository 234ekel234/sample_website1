import PageHero from "@/components/ui/PageHero";

export default function ContactHero() {
  return (
    <PageHero
      eyebrow="Get in Touch"
      title={
        <>
          Let&apos;s Start a{" "}
          <span className="text-gold-shimmer">Conversation</span>
        </>
      }
      lede="Whether you'd like to become a member, make a donation, or explore a partnership in support of the Academy, we'd be glad to hear from you. We're easy to reach and quick to respond."
    />
  );
}
