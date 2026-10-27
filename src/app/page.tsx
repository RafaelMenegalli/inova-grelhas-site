import {
  LandingPage,
  landingMetadata,
} from "@/components/landing/landing-page";

export const metadata = landingMetadata("pt");

export default function Home() {
  return <LandingPage lang="pt" />;
}
