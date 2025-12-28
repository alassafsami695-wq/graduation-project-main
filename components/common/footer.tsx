import { Suspense } from "react";
import FooterServer from "./FooterServer";

const Footer = () => {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterServer />
    </Suspense>
  );
};

const FooterSkeleton = () => {
  return (
    <footer className="w-full bg-bg-secondary border-t border-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="h-10 w-40 bg-border rounded-xl" />
            <div className="h-20 bg-border rounded-xl" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 bg-border rounded-lg" />
              ))}
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <div className="h-8 w-32 bg-border rounded-lg" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-border rounded w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
