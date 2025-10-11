import HeroSection from "@/components/HeroSection";
import EventInfo from "@/components/EventInfo";
import PrayerSection from "@/components/PrayerSection"; 
import GuestBook from "@/components/GuestBook"; 
import SlotTracker from "@/components/SlotTracker"; 
import Footer from "@/components/Footer"; 

export default function WeedingcardScaffold() {
  return (
    <main className="font-serif realtive shadow-2xl ">
      <HeroSection />
      <EventInfo />
      <PrayerSection />
      <GuestBook />
      <SlotTracker />
      <Footer />
      {/* Add GuestBook, SlotTracker, Footer here */}
    </main>
  );
}
