import { HomeContent } from "@/components/home/home-content";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1"
    >
      <HomeContent />
    </main>
  );
}
