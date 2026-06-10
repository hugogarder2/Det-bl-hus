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

const HOVEDRETTER = [
  "Kyllingeret - Kyllingestrimler vendt i champignonsauce",
  "Kyllingefilet med champignonsauce",
  "Kyllingespyd - 2 stk. pr. person",
  "Ovnbagt laks - 1 stk pr. person",
  "Oksekødsfrikadeller - 3 stk. af 50g pr. person",
  "Stegte kødstykker - 170g pr. person",
  "Oksekødsret - 200g pr. person"
];

const SALATER_TILBEHOER = [
  "Artiskok salat",
  "Aubergine Meze",
  "Blomkålssalat",
  "Broccolisalat",
  "Bulgursalat",
  "Bønnesalat med Kidneybønner",
  "Bønnesalat med grønne bønner",
  "Babaganoush",
  "Smør",
  "Brød",
  "Couscous med chili",
  "Flødekartofler",
  "Grøntsagssalat",
  "Grillede Grøntsager m. kryddersauce",
  "Kartoffelsalat m. grøntsager",
  "Kartoffelsalat m. Cremefraiche og purløg",
  "Humus",
  "Humus m. chilli",
  "Kyllingesalat m. soltørrede tomater",
  "Luksus salat",
  "Hvedekernesalat",
  "Græsk salat",
  "Haydari meze",
  "Kikærtesalat"
];

const SALAT_BOWL_SALADS = [
  "Pastasalat med chili",
  "Pastasalat med karry",
  "Pastasalat med pesto",
  "Kısır (Bulgursalat)",
  "Grøn salat",
  "Broccolisalat",
  "Kartoffelsalat",
  "Humus",
  "Tzatziki"
];

const MENU_ITEMS = [
  // HUSETS SANDWICH - 55 kr
  { name: "Roastbeef Sandwich", price: 55, id: "sw_roastbeef", category: "sandwich", desc: "Lavet frisk på dagen med saftig roastbeef og lækkert tilbehør" },
  { name: "Kylling med Karry Sandwich", price: 55, id: "sw_kylling_karry", category: "sandwich", desc: "Frisklavet med cremet karrydressing og strimlet kylling" },
  { name: "Kylling med Ovnbagt Tomat Sandwich", price: 55, id: "sw_kylling_tomat", category: "sandwich", desc: "Favorit med møre skiver kyllingebryst og rige ovnbagte tomater" },
  { name: "Frikadelle Sandwich", price: 55, id: "sw_frikadelle", category: "sandwich", desc: "Frisklavet med hjemmelavede frikadeller, rødkål og surt" },
  { name: "Tunsalat Sandwich", price: 55, id: "sw_tunsalat", category: "sandwich", desc: "Hjemmelavet cremet tunsalat med friske grøntsager og citron" },
  { name: "Kalkun Sandwich", price: 55, id: "sw_kalkun", category: "sandwich", desc: "Med mør kalkun, let mayo, agurk, salat og sprød tomat" },
  { name: "Falafel Sandwich", price: 55, id: "sw_falafel", category: "sandwich", desc: "Sprøde varme falafler med frisk salat og krydret dressing" },
  
  // NY DANSK LEGENDE (Mørbrad sandwich) - 65 kr
  { name: "Mørbrad Sandwich (Ny Dansk Legende)", price: 65, id: "sw_morbrad", category: "sandwich", desc: "En fyldig, luksuriøs og smagfuld sandwich med mørbrad, champignonsauce, chimichurri, parmesanost og frisk rucola" },

  // SMØRREBRØD - 45 kr (rigt og traditionelt fra bunden)
  { name: "Æg & Rejer Smørrebrød", price: 45, id: "sb_aeg_rejer", category: "smorrebrod", desc: "Flot belagt med hårdkogt æg, masser af friske rejer, dild, citron og mayo" },
  { name: "Æg & Tomat Smørrebrød", price: 35, id: "sb_aeg_tomat", category: "smorrebrod", desc: "Hårdkogt æg parret med modne tomatskiver og friskrevet purløg" },
  { name: "Roastbeef Smørrebrød", price: 45, id: "sb_roastbeef", category: "smorrebrod", desc: "Klassiker toppet med frisk remoulade, hunderørt agurkesalat, tomat og peberrod" },
  { name: "Frikadelle Smørrebrød", price: 45, id: "sb_frikadelle", category: "smorrebrod", desc: "Dejlig dansk frikadelle med klassisk surt, asier og rødkål" },
  { name: "Kartofler Smørrebrød", price: 35, id: "sb_kartoffel", category: "smorrebrod", desc: "Nye skivede kartofler med purløg, mayonnaise og ristet sprød bacon" },
  { name: "Kalkun & Italiensk Salat Smørrebrød", price: 45, id: "sb_kalkun_italiensk", category: "smorrebrod", desc: "Mør kalkunbryst kronet med rig hjemmelavet italiensk salat" },
  { name: "Leverpostej Smørrebrød", price: 40, id: "sb_leverpostej", category: "smorrebrod", desc: "Lun grov leverpostej med dybe striber af bacon og syltede agurker" },
  { name: "Dyrlægens Natmad Smørrebrød", price: 45, id: "sb_dyrlaegens", category: "smorrebrod", desc: "Traditionelt rugbrød med saltkød, leverpostej, sky og rå løgringe" },
  { name: "Rullepølse Smørrebrød", price: 45, id: "sb_rullepolse", category: "smorrebrod", desc: "Slagter-rullepølse med mørk sky, rå løg og friskklippet karse" },
  { name: "Hønsesalat Smørrebrød", price: 45, id: "sb_hoensesalat", category: "smorrebrod", desc: "Lækker luftig hønsesalat toppet med rød peberfrugt og sprød bacon" },
  { name: "Fiskefilet Smørrebrød", price: 45, id: "sb_fiskefilet", category: "smorrebrod", desc: "Smørstegt paneret rødspættefilet med grov remoulade, asier og citron" },

  // CATERING / SELSKABSMENUER - 139-249 kr pr. person
  { name: "Lille Selskabsmenu (pr. kuvert)", price: 139, id: "cat_lille", category: "catering", desc: "Består af: 1x Hovedret, 4x Salater/tilbehør efter eget valg. Pris pr. kuvert" },
  { name: "Mellem Selskabsmenu (pr. kuvert)", price: 209, id: "cat_mellem", category: "catering", desc: "Består af: 2x Hovedretter, 3x Salater/tilbehør efter eget valg. Pris pr. kuvert" },
  { name: "Stor Selskabsmenu (pr. kuvert)", price: 249, id: "cat_stor", category: "catering", desc: "Består af: 2x Hovedretter, 6x Salater/tilbehør efter eget valg. Pris pr. kuvert" },

  // SALAT BOWLS - 45-65 kr
  { name: "Lille Salat Bowl (4 slags)", price: 45, id: "bowl_lille", category: "salat_bowl", desc: "Sammensæt din egen friske salat fra vores tæller. Vælg 4 forskellige slags" },
  { name: "Stor Salat Bowl (6 slags)", price: 65, id: "bowl_stor", category: "salat_bowl", desc: "Rigtig mættende og sund bowl. Sammensæt frit med 6 forskellige slags fyld" },

  // ANDET / LÆKKERIER
  { name: "Mormor's Pide", price: 50, id: "andet_pide", category: "andet", desc: "Lækkert tyrkisk fladbrød fyldt helt frisk fra stenovnen" },
  { name: "Mormor's Börek", price: 45, id: "andet_borek", category: "andet", desc: "Udsøgt sprød butterdej med cremet ost- og spinatfyld" },
  { name: "Pomfritter inkl. valgfri dip", price: 35, id: "andet_pomfritter", category: "andet", desc: "Store sprøde, gyldne og salte pomfritter med herlige dips" }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Ordreforspørgsel Form State
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Custom Catering Selections
  const [catHovedretter, setCatHovedretter] = useState<string[]>([]);
  const [catSalater, setCatSalater] = useState<string[]>([]);
  // Custom Salat Bowl Selections
  const [bowlIngredients, setBowlIngredients] = useState<string[]>([]);

  // Menu Categories Filter
  const [activeMenuTab, setActiveMenuTab] = useState<"all" | "sandwich" | "smorrebrod" | "catering" | "salat_bowl" | "andet">("all");
  const [activeOrderTab, setActiveOrderTab] = useState<"sandwich" | "catering" | "salat">("sandwich");
  
  // Final SMS and Messaging Dispatch state
  const [smsPreview, setSmsPreview] = useState<{ text: string; phone: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const website = websiteData.data.websitePreview as WebsitePreview;
  const headerHtml = website.headerCodeSection.html;
  const footerHtml = website.footerCodeSection.html;
  const sections = website.homepage.codeSections;

  // Track if we need to show the page-up chevron button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Update quantity function helper
  const adjustQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Helper to count total active items and cost (casted safely for TypeScript)
  const totalItemCount = (Object.values(quantities) as number[]).reduce((a, b) => a + b, 0);
  const totalCost = (Object.entries(quantities) as [string, number][]).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(i => i.id === id);
    return sum + (item ? item.price : 0) * qty;
  }, 0);

  // Handle click scroll intercept
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
      const toggleBtn = target.closest("[data-landingsite-menu-toggle], [data-landingsite-mobile-menu-toggle]");
      if (toggleBtn) {
        setMobileMenuOpen((prev) => !prev);
        return;
      }

      // Intercept anchor link targeting order/bestil/contact
      const anchorElement = target.closest("a") as HTMLAnchorElement;
      if (anchorElement && anchorElement.hash) {
        const hash = anchorElement.hash;
        if (hash === "#contact" || hash === "#menu" || hash === "#ordreforspoergsel") {
          e.preventDefault();
          let targetId = hash === "#contact" ? "ordreforspoergsel" : hash.substring(1);
          
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            if (hash === "#contact") {
              setShowToast("Opret en ordreforspørgsel med kaffe, smørrebrød eller savmus nedenfor!");
            }
          }
          setMobileMenuOpen(false);
          return;
        }
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
        setLightboxImage({ src: foodImg.src, alt: foodImg.alt || "Delikat smørrebrød" });
        return;
      }
    };

    document.addEventListener("click", handleGlobalClick);

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

  // Handle custom interactive order submit
  const sendOrderInquiry = (e: FormEvent) => {
    e.preventDefault();

    if (!orderDate) {
      setShowToast("Vælg venligst en dato for din afhentning/reservation.");
      return;
    }
    if (!orderTime) {
      setShowToast("Vælg venligst et tidspunkt.");
      return;
    }
    if (totalItemCount === 0) {
      setShowToast("Vælg venligst mindst ét stykke fra menuen til din bestilling.");
      return;
    }
    if (!customerPhone || customerPhone.trim().length < 8) {
      setShowToast("Indtast venligst et gyldigt dansk telefonnummer.");
      return;
    }

    // Compose formatted text for inquiry SMS / WhatsApp / copy dispatch
    let selectedText = "";
    (Object.entries(quantities) as [string, number][])
      .filter(([_, qty]) => qty > 0)
      .forEach(([id, qty]) => {
        const item = MENU_ITEMS.find(i => i.id === id);
        if (!item) return;
        selectedText += `• ${qty} stk. ${item.name} (${item.price} kr./stk)\n`;
        
        // Add selskabsmenu details if checked
        if (item.category === "catering") {
          if (catHovedretter.length > 0) {
            selectedText += `   └ Valgte hovedretter: ${catHovedretter.join(", ")}\n`;
          }
          if (catSalater.length > 0) {
            selectedText += `   └ Valgte salater/tilbehør: ${catSalater.join(", ")}\n`;
          }
        }
        
        // Add salat bowl details if checked
        if (item.category === "salat_bowl") {
          if (bowlIngredients.length > 0) {
            selectedText += `   └ Valgt salatblanding: ${bowlIngredients.join(", ")}\n`;
          }
        }
      });

    const formattedSms = `Hejsa Det Blå Hus! 🇩🇰\n\nJeg vil gerne lave en ordreforspørgsel:\n\n${selectedText}\n📅 Dato: ${orderDate}\n⏰ Tidspunkt: ${orderTime}\n\nSamlet prisidé: ${totalCost} kr.\n📞 Mit telefonnummer: ${customerPhone}\n\nVenlig hilsen!`;

    setSmsPreview({
      text: formattedSms,
      phone: "81980502" // Updated to the correct restaurant phone number from the flyer leaflet images
    });
  };

  // Trigger real devices SMS client
  const triggerNativeSms = () => {
    if (!smsPreview) return;
    const bodyEncoded = encodeURIComponent(smsPreview.text);
    // Standard direct prefill format
    window.location.href = `sms:+45${smsPreview.phone}?body=${bodyEncoded}`;
    setShowToast("Åbner din SMS-app med færdigbeskeden...");
  };

  // Trigger WhatsApp prefill
  const triggerWhatsApp = () => {
    if (!smsPreview) return;
    const bodyEncoded = encodeURIComponent(smsPreview.text);
    window.open(`https://wa.me/45${smsPreview.phone}?text=${bodyEncoded}`, "_blank");
    setShowToast("Åbner WhatsApp...");
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    if (!smsPreview) return;
    navigator.clipboard.writeText(smsPreview.text);
    setCopied(true);
    setShowToast("Inholdet blev kopieret til din udklipsholder! Klar til at sende.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[var(--light-background-color)]">
      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2E5C8A] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-fade-in border border-[#8BB8D8] text-center max-w-sm sm:max-w-md">
          <p className="text-sm font-medium">{showToast}</p>
          <button 
            id="close-toast-btn"
            onClick={() => setShowToast(null)} 
            className="text-white hover:text-red-200 transition-colors cursor-pointer pl-2"
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

      {/* SMS Preview Mockup Modal */}
      {smsPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-[var(--light-border-color)] animate-fade-in">
            {/* Modal Header */}
            <div className="bg-[var(--dark-background-color)] p-6 border-b border-[var(--light-border-color)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white">
                  <i className="fas fa-paper-plane"></i>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--dark-text-color)]">
                    Send Ordreforspørgsel
                  </h3>
                  <p className="text-xs text-[var(--gray-text-color)]">Modtager: Tlf. 81 98 05 02</p>
                </div>
              </div>
              <button 
                onClick={() => setSmsPreview(null)}
                className="text-[var(--gray-text-color)] hover:text-red-500 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Faux Mobile Chat Mockup Body */}
            <div className="bg-[#E4ECEF] p-6 space-y-4 max-h-[300px] overflow-y-auto">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider bg-white/50 text-[var(--gray-text-color)] px-3 py-1 rounded-full">
                  I dag 
                </span>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#418CC0] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] whitespace-pre-wrap shadow-sm">
                  {smsPreview.text}
                </div>
              </div>
            </div>

            {/* Custom Interactive Trigger Buttons */}
            <div className="p-6 space-y-3 bg-white">
              <p className="text-xs text-center text-gray-400 font-light px-2">
                Når du trykker på send, åbnes din telefonbogs-app, så du nemt kan godkende og sende direkte!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={triggerNativeSms}
                  className="bg-[var(--primary-color)] text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[var(--primary-button-hover-bg-color)] shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <i className="fas fa-comment-sms"></i>
                  Send som SMS
                </button>
                <button
                  onClick={triggerWhatsApp}
                  className="bg-[#25D366] text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <i className="fab fa-whatsapp"></i>
                  Send på WhatsApp
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-[#f0f4f8] text-[var(--dark-text-color)] font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <i className={copied ? "fas fa-check text-green-600" : "fas fa-copy"}></i>
                  {copied ? "Kopieret!" : "Kopier beskedtekst"}
                </button>
                <a
                  href="tel:81980502"
                  className="bg-amber-500 text-white font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-amber-600 transition-all cursor-pointer"
                >
                  <i className="fas fa-phone"></i>
                  Ring direkte
                </a>
              </div>
            </div>
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
        {sections.map((section) => {
          // Put the custom Ordreforspørgsel section right before the contact section in index
          if (section.id === "contact") {
            return (
              <div key="custom-order-section-block">
                {/* Custom Interactive Ordreforspørgsel Section */}
                <section 
                  id="ordreforspoergsel"
                  className="code-section py-14 lg:py-16 bg-[var(--dark-background-color)] relative z-10"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Section Header */}
                    <div className="text-center mb-10 max-w-3xl mx-auto">
                      <p className="text-[var(--accent2-color)] uppercase tracking-[0.4em] text-xs sm:text-sm mb-3 font-light">
                        Nem Bestilling
                      </p>
                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--dark-text-color)] font-light mb-4">
                        Opret <span className="italic">Ordreforspørgsel</span>
                      </h2>
                      <div className="w-16 h-[2px] bg-[var(--accent-color)] mx-auto mb-4"></div>
                      <p className="text-[var(--dark-text-color)] text-base sm:text-lg font-light leading-relaxed">
                        Sammensæt din perfekte frokost eller selskabsmenu her. Vælg varer fordelt på kategorierne, indtast afhentningstidspunkt, og send din forespørgsel direkte til vores tlf: <strong className="text-[var(--accent2-color)]">81 98 05 02</strong>.
                      </p>
                    </div>

                    <form 
                      onSubmit={sendOrderInquiry}
                      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[var(--light-border-color)]"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* LEFT COLUMN: MENU SELECTOR */}
                        <div className="lg:col-span-7 p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--light-border-color)]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h3 className="font-serif text-xl sm:text-2xl text-[var(--dark-text-color)] flex items-center gap-2.5">
                              <i className="fas fa-shopping-basket text-[var(--accent-color)] text-lg"></i>
                              Vælg fra vores menu
                            </h3>
                          </div>

                          {/* Elegant Compact Category Tabs */}
                          <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                              type="button"
                              onClick={() => setActiveOrderTab("sandwich")}
                              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeOrderTab === "sandwich" 
                                  ? "bg-[var(--accent-color)] text-white shadow-sm font-semibold" 
                                  : "text-[var(--dark-text-color)] hover:bg-gray-150"
                              }`}
                            >
                              <span>🥪</span> Sandwich & Smørrebrød
                              {(() => {
                                const count = MENU_ITEMS.filter(item => item.category === "sandwich" || item.category === "smorrebrod")
                                  .reduce((sum, item) => sum + (quantities[item.id] || 0), 0);
                                return count > 0 ? (
                                  <span className="bg-[var(--accent2-color)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold shrink-0">
                                    {count}
                                  </span>
                                ) : null;
                              })()}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveOrderTab("catering")}
                              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeOrderTab === "catering" 
                                  ? "bg-[var(--accent-color)] text-white shadow-sm font-semibold" 
                                  : "text-[var(--dark-text-color)] hover:bg-gray-150"
                              }`}
                            >
                              <span>🍲</span> Selskabsmenuer
                              {(() => {
                                const count = MENU_ITEMS.filter(item => item.category === "catering")
                                  .reduce((sum, item) => sum + (quantities[item.id] || 0), 0);
                                return count > 0 ? (
                                  <span className="bg-[var(--accent2-color)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold shrink-0">
                                    {count}
                                  </span>
                                ) : null;
                              })()}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveOrderTab("salat")}
                              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeOrderTab === "salat" 
                                  ? "bg-[var(--accent-color)] text-white shadow-sm font-semibold" 
                                  : "text-[var(--dark-text-color)] hover:bg-gray-150"
                              }`}
                            >
                              <span>🥗</span> Salat & Lækkerier
                              {(() => {
                                const count = MENU_ITEMS.filter(item => item.category === "salat_bowl" || item.category === "andet")
                                  .reduce((sum, item) => sum + (quantities[item.id] || 0), 0);
                                return count > 0 ? (
                                  <span className="bg-[var(--accent2-color)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold shrink-0">
                                    {count}
                                  </span>
                                ) : null;
                              })()}
                            </button>
                          </div>

                          {/* Sandwiches & Smørrebrød Tab Grid */}
                          {activeOrderTab === "sandwich" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {MENU_ITEMS.filter(item => item.category === "sandwich" || item.category === "smorrebrod").map((item) => {
                                  const qty = quantities[item.id] || 0;
                                  return (
                                    <div 
                                      key={item.id}
                                      className={`p-3 rounded-xl border transition-all duration-300 ${qty > 0 ? "border-[var(--accent-color)] bg-[var(--dark-background-color)]/30 shadow-xs" : "border-gray-100 hover:border-gray-200"}`}
                                    >
                                      <div className="flex justify-between items-center h-full">
                                        <div className="flex-1 pr-2">
                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                            <p className="text-[var(--dark-text-color)] font-medium text-sm leading-tight">{item.name}</p>
                                            <span className="text-xs font-semibold text-[var(--accent2-color)] font-mono shrink-0">{item.price} kr.</span>
                                            {item.category === "sandwich" && (
                                              <span className="text-[9px] bg-sky-50 text-sky-700 px-1 py-0.2 rounded font-sans uppercase font-xs tracking-wide">Sandwich</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-[var(--gray-text-color)] mt-0.5 line-clamp-2 leading-tight font-light">{item.desc}</p>
                                        </div>
                                        
                                        {/* Interactive Quantity Adjustors */}
                                        <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg shadow-xs border border-gray-105 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, -1)}
                                            className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-xs text-[var(--gray-text-color)] hover:bg-gray-100 transition-colors cursor-pointer"
                                            disabled={qty === 0}
                                          >
                                            <i className="fas fa-minus text-[9px]"></i>
                                          </button>
                                          <span className="w-4 text-center font-bold font-mono text-[var(--dark-text-color)] text-xs">
                                            {qty}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, 1)}
                                            className="w-6 h-6 rounded bg-[var(--dark-background-color)] flex items-center justify-center text-xs text-[var(--accent2-color)] hover:bg-[var(--medium-background-color)] transition-colors cursor-pointer"
                                          >
                                            <i className="fas fa-plus text-[9px]"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Catering Tab */}
                          {activeOrderTab === "catering" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-3">
                                {MENU_ITEMS.filter(item => item.category === "catering").map((item) => {
                                  const qty = quantities[item.id] || 0;
                                  return (
                                    <div 
                                      key={item.id}
                                      className={`p-3.5 rounded-xl border transition-all duration-300 ${qty > 0 ? "border-[var(--accent-color)] bg-[var(--dark-background-color)]/30 shadow-xs" : "border-gray-100 hover:border-gray-200"}`}
                                    >
                                      <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-[var(--dark-text-color)] font-medium text-base">{item.name}</p>
                                            <span className="text-sm font-semibold text-[var(--accent2-color)] font-mono">{item.price} kr.</span>
                                          </div>
                                          <p className="text-xs text-[var(--gray-text-color)] mt-0.5 leading-normal font-light">{item.desc}</p>
                                        </div>
                                        
                                        {/* Interactive Quantity Adjustors */}
                                        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg shadow-xs border border-gray-105 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, -1)}
                                            className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-xs text-[var(--gray-text-color)] hover:bg-gray-150 transition-colors cursor-pointer"
                                            disabled={qty === 0}
                                          >
                                            <i className="fas fa-minus text-[9px]"></i>
                                          </button>
                                          <span className="w-4 text-center font-bold font-mono text-[var(--dark-text-color)] text-xs">
                                            {qty}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, 1)}
                                            className="w-6 h-6 rounded bg-[var(--dark-background-color)] flex items-center justify-center text-xs text-[var(--accent2-color)] hover:bg-[var(--medium-background-color)] transition-colors cursor-pointer"
                                          >
                                            <i className="fas fa-plus text-[9px]"></i>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Expanded Catering Option Selectors */}
                                      {qty > 0 && (
                                        <div className="mt-4 bg-[#F2F7F9] p-4 rounded-xl border border-blue-105 space-y-4">
                                          <div>
                                            <p className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                                              <i className="fas fa-drumstick-bite text-[var(--accent2-color)]"></i>
                                              Vælg Hovedret(ter) (Lille: 1 slags, Mellem/Stor: 2 slags):
                                            </p>
                                            <div className="space-y-1 bg-white p-2.5 rounded-lg border border-gray-100">
                                              {HOVEDRETTER.map(h => {
                                                const maxSelected = item.id === "cat_lille" ? 1 : 2;
                                                const isChecked = catHovedretter.includes(h);
                                                return (
                                                  <label key={h} className="flex items-start gap-2 cursor-pointer py-1 text-xs text-gray-700">
                                                    <input
                                                      type="checkbox"
                                                      checked={isChecked}
                                                      disabled={!isChecked && catHovedretter.length >= maxSelected}
                                                      onChange={() => {
                                                        if (isChecked) {
                                                          setCatHovedretter(prev => prev.filter(x => x !== h));
                                                        } else {
                                                          setCatHovedretter(prev => [...prev, h]);
                                                        }
                                                      }}
                                                      className="rounded text-[var(--accent-color)] mt-0.5"
                                                    />
                                                    <span>{h}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <p className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                                              <i className="fas fa-pepper-hot text-green-700"></i>
                                              Vælg Salater & Tilbehør (Lille: 4 slags, Mellem: 3 slags, Stor: 6 slags):
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 bg-white p-2.5 rounded-lg border border-gray-100 max-h-48 overflow-y-auto pr-1">
                                              {SALATER_TILBEHOER.map(s => {
                                                let maxSalat = 4;
                                                if (item.id === "cat_mellem") maxSalat = 3;
                                                if (item.id === "cat_stor") maxSalat = 6;
                                                const isChecked = catSalater.includes(s);
                                                return (
                                                  <label key={s} className="flex items-center gap-2 cursor-pointer py-1 text-xs text-gray-700">
                                                    <input
                                                      type="checkbox"
                                                      checked={isChecked}
                                                      disabled={!isChecked && catSalater.length >= maxSalat}
                                                      onChange={() => {
                                                        if (isChecked) {
                                                          setCatSalater(prev => prev.filter(x => x !== s));
                                                        } else {
                                                          setCatSalater(prev => [...prev, s]);
                                                        }
                                                      }}
                                                      className="rounded text-[var(--accent-color)]"
                                                    />
                                                    <span className="truncate">{s}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Salat & Lækkerier Tab */}
                          {activeOrderTab === "salat" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-3">
                                {MENU_ITEMS.filter(item => item.category === "salat_bowl" || item.category === "andet").map((item) => {
                                  const qty = quantities[item.id] || 0;
                                  return (
                                    <div 
                                      key={item.id}
                                      className={`p-3.5 rounded-xl border transition-all duration-300 ${qty > 0 ? "border-[var(--accent-color)] bg-[var(--dark-background-color)]/30 shadow-xs" : "border-gray-100 hover:border-gray-200"}`}
                                    >
                                      <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-[var(--dark-text-color)] font-medium text-base">{item.name}</p>
                                            <span className="text-sm font-semibold text-[var(--accent2-color)] font-mono">{item.price} kr.</span>
                                          </div>
                                          <p className="text-xs text-[var(--gray-text-color)] mt-0.5 leading-normal font-light">{item.desc}</p>
                                        </div>
                                        
                                        {/* Interactive Quantity Adjustors */}
                                        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg shadow-xs border border-gray-105 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, -1)}
                                            className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-xs text-[var(--gray-text-color)] hover:bg-gray-150 transition-colors cursor-pointer"
                                            disabled={qty === 0}
                                          >
                                            <i className="fas fa-minus text-[9px]"></i>
                                          </button>
                                          <span className="w-4 text-center font-bold font-mono text-[var(--dark-text-color)] text-xs">
                                            {qty}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => adjustQuantity(item.id, 1)}
                                            className="w-6 h-6 rounded bg-[var(--dark-background-color)] flex items-center justify-center text-xs text-[var(--accent2-color)] hover:bg-[var(--medium-background-color)] transition-colors cursor-pointer"
                                          >
                                            <i className="fas fa-plus text-[9px]"></i>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Expanded Salat Bowl Selector */}
                                      {qty > 0 && item.category === "salat_bowl" && (
                                        <div className="mt-4 bg-[#FDF9F2] p-4 rounded-xl border border-amber-100 text-xs">
                                          <p className="font-semibold text-amber-950 mb-1.5 flex items-center gap-1.5">
                                            <i className="fas fa-carrot text-amber-600"></i>
                                            Sammensæt din salatbowl (Vælg op til {item.id === "bowl_lille" ? 4 : 6} slags):
                                          </p>
                                          <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-amber-50 animate-fadeIn">
                                            {SALAT_BOWL_SALADS.map(salad => {
                                              const isChecked = bowlIngredients.includes(salad);
                                              return (
                                                <label key={salad} className="flex items-center gap-2 cursor-pointer py-1 text-gray-700 hover:text-black">
                                                  <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    disabled={!isChecked && bowlIngredients.length >= (item.id === "bowl_lille" ? 4 : 6)}
                                                    onChange={() => {
                                                      if (isChecked) {
                                                        setBowlIngredients(prev => prev.filter(x => x !== salad));
                                                      } else {
                                                        setBowlIngredients(prev => [...prev, salad]);
                                                      }
                                                    }}
                                                    className="rounded text-amber-600 focus:ring-amber-500"
                                                  />
                                                  <span>{salad}</span>
                                                </label>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: BOOKING INFORMATION */}
                        <div className="lg:col-span-12 xl:col-span-5 bg-neutral-50/50 p-5 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--light-border-color)]">
                          <div>
                            <h3 className="font-serif text-xl sm:text-2xl text-[var(--dark-text-color)] mb-6 flex items-center gap-2.5">
                              <i className="fas fa-calendar-check text-[var(--accent-color)] text-lg"></i>
                              Tidspunkt & info
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                              {/* Date Selection */}
                              <div>
                                <label className="block text-xs font-serif font-medium text-[var(--dark-text-color)] mb-1.5 flex items-center gap-1.5">
                                  <i className="fas fa-calendar text-[var(--accent-color)] text-[10px]"></i>
                                  Dato for afhentning
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={orderDate}
                                  onChange={(e) => setOrderDate(e.target.value)}
                                  className="w-full bg-white border border-[var(--light-border-color)] text-[var(--dark-text-color)] rounded-xl py-2.5 px-3.5 outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all font-mono text-sm"
                                />
                              </div>

                              {/* Time Selection */}
                              <div>
                                <label className="block text-xs font-serif font-medium text-[var(--dark-text-color)] mb-1.5 flex items-center gap-1.5">
                                  <i className="fas fa-clock text-[var(--accent-color)] text-[10px]"></i>
                                  Tidspunkt
                                </label>
                                <input
                                  type="time"
                                  required
                                  value={orderTime}
                                  onChange={(e) => setOrderTime(e.target.value)}
                                  className="w-full bg-white border border-[var(--light-border-color)] text-[var(--dark-text-color)] rounded-xl py-2.5 px-3.5 outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all font-mono text-sm"
                                />
                              </div>

                              {/* Client phone number */}
                              <div className="sm:col-span-2 lg:col-span-1">
                                <label className="block text-xs font-serif font-medium text-[var(--dark-text-color)] mb-1.5 flex items-center gap-1.5">
                                  <i className="fas fa-phone text-[var(--accent-color)] text-[10px]"></i>
                                  Dit Telefonnummer
                                </label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
                                    +45
                                  </span>
                                  <input
                                    type="tel"
                                    required
                                    placeholder="f.eks. 12345678"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\s+/g, ""))}
                                    className="w-full bg-white border border-[var(--light-border-color)] text-[var(--dark-text-color)] rounded-xl py-2.5 pl-14 pr-3.5 outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all font-mono text-sm"
                                  />
                                </div>
                                <p className="text-[10px] text-[var(--gray-text-color)] font-light mt-1.5 leading-tight">
                                  Vi ringer eller SMS'er dig for endelig bekræftelse af din bestilling.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Summary & Submission Button */}
                          <div className="pt-6 border-t border-gray-200 mt-6 sm:mt-8">
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between items-center text-xs font-light">
                                <span className="text-[var(--gray-text-color)]">Antal varer valgt:</span>
                                <span className="font-semibold text-[var(--dark-text-color)] font-mono">{totalItemCount} stk.</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-dashed border-gray-150 pt-2">
                                <span className="text-sm font-serif font-medium text-[var(--dark-text-color)]">Estimeret total:</span>
                                <span className="text-xl font-serif font-bold text-[var(--accent2-color)] font-mono">{totalCost} DKK</span>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[var(--accent-color)] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold py-3 px-4 rounded-xl hover:bg-[var(--accent2-color)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                            >
                              <i className="fas fa-paper-plane text-xs"></i>
                              Opret forespørgsel
                            </button>
                            
                            <p className="text-[9px] text-center text-[var(--gray-text-color)] font-light mt-2.5">
                              Forespørgslen opsættes automatisk til afsendelse til vores butikstelefon <strong>81 98 05 02</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </section>

                {/* Original Contact Section */}
                <div
                  id={`section-container-${section.id}`}
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </div>
            );
          }
          return (
            <div
              key={section.id}
              id={`section-container-${section.id}`}
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          );
        })}
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

