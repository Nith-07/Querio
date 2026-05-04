import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NoticesView } from "@/components/dashboard/NoticesView";

const Notices = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto max-w-4xl py-8">
        <NoticesView />
      </div>
      <Footer />
    </div>
  );
};

export default Notices;
