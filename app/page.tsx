import RiseExperience from "@/components/RiseExperience";
import { MetricsTicker } from "@/components/MetricsTicker";
import { EconomicRadar } from "@/components/EconomicRadar";
import { FounderQuote } from "@/components/FounderQuote";
import { EventSection } from "@/components/EventSection";
import { FAQSection } from "@/components/FAQSection";
import { BottomCTA } from "@/components/BottomCTA";

export default function Home() {
  return (
    <RiseExperience metrics={<MetricsTicker />}>
      <EconomicRadar />
      <FounderQuote />
      <EventSection />
      <FAQSection />
      <BottomCTA />
    </RiseExperience>
  );
}
