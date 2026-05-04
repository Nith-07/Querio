import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FAQView } from "@/components/dashboard/FAQView";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto max-w-4xl py-8">
        <FAQView />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
