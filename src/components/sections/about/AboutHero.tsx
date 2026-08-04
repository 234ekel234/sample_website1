import PageHero from "@/components/ui/PageHero";

export default function AboutHero() {
  return (
    <PageHero
      eyebrow="About PMAFI"
      title={
        <>
          A Foundation Built for{" "}
          <span className="text-gold-shimmer">National Service</span>
        </>
      }
      lede="The Philippine Military Academy Foundation, Inc. exists to strengthen PMA's capacity to develop military officers of the highest integrity, competence, and character — officers who serve God, country, and people."
    />
  );
}
