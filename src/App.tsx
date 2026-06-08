import { useEffect, useState, useRef, FormEvent } from "react";
import websiteData from "./website-data.json";

interface CodeSection {
  id: string;
  html: string;
}

interface Homepage {
  id: string;
  path: string;
  isHomepage: boolean;
  aiPageHeadHtml: string | null;
  codeSections: CodeSection[];
}

interface ColorPalette {
  [key: string]: string;
}

interface WebsitePreview {
  id: string;
  analyticsId: string;
  colorPalette: ColorPalette;
  fonts: string[];
  scriptsInHtml: string | null;
  aiWebsiteHeadHtml: string | null;
  headerCodeSection: CodeSection;
  footerCodeSection: CodeSection;
  homepage: Homepage;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const website = websiteData.data.websitePreview as WebsitePreview;
  const headerHtml = website.headerCodeSection.html;
  const footerHtml = website.footerCodeSection.html;
  const sections = website.homepage.codeSections;

  // Track if we need to show the page-up chevron button
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll animate trigger using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animElements = document.querySelectorAll(".scroll-animate, .scroll-animate-stagger");
    animElements.forEach((el) => {
      el.classList.add("transition-all", "duration-800", "opacity-0", "translate-y-10");
      observer.observe(el);
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    // Dynamic bindings for links and menus in rendered HTML
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Handle Mobile menu toggle click
      const toggleBtn = target.closest("[data-landingsite-mobile-menu-toggle]");
      if (toggleBtn) {
        setMobileMenuOpen((prev) => !prev);
        return;
      }

      // Handle lightbox for gallery images
      const galleryImg = target.closest("#gallery img") as HTMLImageElement;
      if (galleryImg) {
        setLightboxImage({ src: galleryImg.src, alt: galleryImg.alt || "Det blå hus Galleri" });
        return;
      }

      // Handle other gallery page links or elements clicking
      const foodImg = target.closest("#menu img, .code-section img") as HTMLImageElement;
      if (foodImg && target.closest("#gallery") === null) {
        // Can open food items too!
        setLightboxImage({ src: foodImg.src, alt: foodImg.alt || "Delikat smørrebrød" });
        return;
      }

      // Handle simulation of order clicks (e.g. Bestil buttons)
      const clickedBestil = target.closest('a[href="#contact"], button[onclick*="contact"], a[href*="Bestil"]');
      if (clickedBestil && target.closest("#global-header") === null && target.closest("#global-footer") === null) {
        // Just simulate a neat booking visual notifier or smooth scroll
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
          setShowToast("Søg ned for information om åbningstider og bestilling via telefon direct!");
        }
        return;
      }

      // Handle clicking mobile navigation list elements to close menu automatically
      const clickedMobileLink = target.closest("[data-landingsite-mobile-menu] a");
      if (clickedMobileLink) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // Remove boots spinner set in index.html index bundle if any remains
    const spinner = document.getElementById("ls-boot-spinner");
    if (spinner) {
      spinner.remove();
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Sync mobile menu display with react state toggles on DOM
  useEffect(() => {
    const mobileMenu = document.querySelector("[data-landingsite-mobile-menu]");
    if (mobileMenu) {
      if (mobileMenuOpen) {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("block", "opacity-100", "transition-opacity", "duration-300");
      } else {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("block", "opacity-100");
      }
    }
  }, [mobileMenuOpen]);

  // Handle successful reservation or contact mock visual
  const triggerReservation = (e: FormEvent) => {
    e.preventDefault();
    setShowToast("Tusind tak! Din besked er sendt. Vi vender tilbage hurtigst muligt!");
  };

  return (
    <div className="relative min-h-screen bg-[var(--light-background-color)]">
      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2E5C8A] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in border border-[#8BB8D8] text-center max-w-sm sm:max-w-md">
          <p className="text-sm font-medium">{showToast}</p>
          <button 
            id="close-toast-btn"
            onClick={() => setShowToast(null)} 
            className="text-white hover:text-red-200 transition-colors cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          id="lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out select-none animate-fade-in"
        >
          <button 
            id="lightbox-close-btn"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 cursor-pointer z-50"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.alt} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-2 border-white/10"
              referrerPolicy="no-referrer"
            />
            <p className="text-white/80 text-sm mt-4 font-light text-center px-6">
              {lightboxImage.alt}
            </p>
          </div>
        </div>
      )}

      {/* Injected Header */}
      <div 
        id="app-header-container"
        dangerouslySetInnerHTML={{ __html: headerHtml }} 
      />

      {/* Main Sections */}
      <main className="pt-32"> {/* Offset height of the fixed navigation header */}
        {sections.map((section) => (
          <div
            key={section.id}
            id={`section-container-${section.id}`}
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        ))}
      </main>

      {/* Injected Footer */}
      <div 
        id="app-footer-container"
        dangerouslySetInnerHTML={{ __html: footerHtml }} 
      />

      {/* React Scroll-to-Top trigger sync */}
      {showScrollTop && (
        <button 
          id="scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#4A90C2] text-white flex items-center justify-center rounded-full shadow-lg hover:bg-[#1E4A72] transition-all duration-300 z-40 hover:scale-110 cursor-pointer"
          aria-label="Rul til toppen"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </div>
  );
}
