import { 
  Building2, 
  ReceiptText, 
  Landmark, 
  Gavel, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Search,
  LucideIcon
} from "lucide-react";

export interface ServiceData {
  id: string;
  title: string;
  heroTitle: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  longDescription: string;
  mainHeading: string;
  deliverables: string[];
  benefits: string[];
  ctaTitle: string;
}

export const servicesData: ServiceData[] = [
  {
    id: "mca-compliance",
    title: "MCA Compliance",
    heroTitle: "MCA Compliance & ROC Filings",
    subtitle: "Stay compliant with Ministry of Corporate Affairs regulations effortlessly. We architect stability for your corporate entity.",
    icon: Gavel,
    description: "Ministry of Corporate Affairs adherence including annual filings and Director KYC updates.",
    mainHeading: "Navigating Corporate Compliance with Precision",
    longDescription: "In today's dynamic regulatory environment, maintaining a 'Compliant' status with the Ministry of Corporate Affairs (MCA) is not just a legal obligation—it is a hallmark of corporate integrity and operational excellence. The Sovereign Ledger provides a comprehensive suite of ROC (Registrar of Companies) filing services designed to alleviate the administrative burden on your leadership team.\n\nOur approach blends technical expertise with a deep understanding of the Companies Act, 2013. We don't just file forms; we architect a robust compliance framework that protects your directors from disqualification, shields your company from heavy penalties, and ensures your corporate records remain transparent for stakeholders, investors, and financial institutions.",
    deliverables: [
      "Annual Financial Filings (Form AOC-4) and Annual Returns (Form MGT-7)",
      "Director KYC (DIR-3 KYC) and Active Company Tagging (INC-22A)",
      "Event-based filings for Director changes, Registered Office shifts, or Share capital updates",
      "Preparation and maintenance of Minutes Books and Statutory Registers"
    ],
    benefits: [
      "Zero-Penalty Guarantee through proactive deadline tracking and reminders",
      "Enhanced Due Diligence readiness for future fundraising or M&A activities",
      "Professional Digital Signature (DSC) management for secure electronic filings",
      "Seamless liaison with the Registrar of Companies for any technical queries"
    ],
    ctaTitle: "Need help with MCA Compliance?"
  },
  {
    id: "company-registration",
    title: "Company Registration",
    heroTitle: "Seamless Company Incorporation",
    subtitle: "Launch your business on a solid legal foundation. We handle the complexities of incorporation so you can focus on your vision.",
    icon: Building2,
    description: "Incorporate your PVT LTD, LLP, or OPC with zero hassle. We handle the entire legal framework for you.",
    mainHeading: "Building Your Corporate Identity from the Ground Up",
    longDescription: "Choosing the right business structure is the most critical decision for any founder. Whether it's a Private Limited Company for scalability or an LLP for operational flexibility, we guide you through every step. Our incorporation experts ensure that your MOA, AOA, and legal documents are drafted with future growth in mind.",
    deliverables: [
      "Name Approval (RUN) and Certificate of Incorporation (COI)",
      "PAN and TAN registration for the new entity",
      "Drafting of Memorandum and Articles of Association",
      "Digital Signature Certificates (DSC) for all directors"
    ],
    benefits: [
      "Expert advice on the best legal structure for your specific business model",
      "End-to-end handling of government liaison and documentation",
      "Fast-track processing to get your business operational in record time",
      "Complimentary consultation on post-incorporation compliance requirements"
    ],
    ctaTitle: "Ready to Register Your Company?"
  },
  {
    id: "trademark-registration",
    title: "Trademark Registration",
    heroTitle: "Trademark Registration & IP Protection",
    subtitle: "Secure your brand's future. We protect your intellectual property with rigorous legal defense and strategic registration.",
    icon: ShieldCheck,
    description: "Securing your intellectual property. We manage the entire trademark registration process to ensure your brand identity is legally protected.",
    mainHeading: "Defending Your Most Valuable Intangible Assets",
    longDescription: "Your brand is your promise to your customers. Protecting it from infringement is essential for long-term success. Our trademark specialists conduct deep searches and manage the entire application process, from filing to responding to objections, ensuring your intellectual property remains exclusively yours.",
    deliverables: [
      "Comprehensive Trademark Search and Availability Report",
      "Filing of Trademark Applications across multiple classes",
      "Handling of Trademark Objections and Show Cause hearings",
      "Trademark Renewal and Portfolio Management"
    ],
    benefits: [
      "Nationwide protection of your brand name, logo, and slogans",
      "Legal deterrent against competitors using similar marks",
      "Increased valuation of your business through registered IP assets",
      "Global trademark filing assistance through the Madrid Protocol"
    ],
    ctaTitle: "Want to Protect Your Brand?"
  }
  // Add more as needed, but these 3 cover the requested examples and the screenshot
];
