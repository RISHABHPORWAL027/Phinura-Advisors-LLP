import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { LucideIconSelect } from "./LucideIconSelect";
import { LUCIDE_SERVICE_ICON_OPTIONS_SORTED } from "../../constants/lucideServiceIconOptions";
import { createEmptySubServicePageContent } from "../../utils/subServiceContent";
import type { SubServicePageContent } from "../../data/subServiceTypes";

type Path = (string | number)[];

type Handlers = {
  handleChange: (path: Path, value: unknown) => void;
  handleArrayAdd: (path: Path, newItem: unknown) => void;
  handleArrayRemove: (path: Path, index: number) => void;
};

const inputClass =
  "w-full rounded-lg border border-outline-variant/60 bg-surface-container p-2.5 text-sm outline-none focus:border-primary";
const labelClass = "text-xs font-bold uppercase text-primary";
const sectionClass =
  "mt-4 space-y-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50 p-4";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-on-surface-variant">{hint}</p>}
    </div>
  );
}

function StringListEditor({
  label,
  path,
  items,
  placeholder,
  handlers,
}: {
  label: string;
  path: Path;
  items: string[];
  placeholder?: string;
  handlers: Handlers;
}) {
  const { handleChange, handleArrayAdd, handleArrayRemove } = handlers;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        <button
          type="button"
          onClick={() => handleArrayAdd(path, placeholder ?? "New item")}
          className="text-primary hover:text-secondary"
        >
          <Plus size={14} />
        </button>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            rows={item.includes("\n") ? 3 : 1}
            value={item}
            onChange={(e) => handleChange([...path, i], e.target.value)}
            className={`${inputClass} flex-1 resize-y`}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => handleArrayRemove(path, i)} className="mt-2 text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function FeaturePairsEditor({
  label,
  path,
  items,
  handlers,
}: {
  label: string;
  path: Path;
  items: Array<{ title: string; description: string }>;
  handlers: Handlers;
}) {
  const { handleChange, handleArrayAdd, handleArrayRemove } = handlers;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        <button
          type="button"
          onClick={() => handleArrayAdd(path, { title: "Title", description: "Description" })}
          className="text-primary hover:text-secondary"
        >
          <Plus size={14} />
        </button>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-outline-variant/25 bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant">Item {i + 1}</span>
            <button type="button" onClick={() => handleArrayRemove(path, i)} className="text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleChange([...path, i, "title"], e.target.value)}
            className={inputClass}
            placeholder="Title"
          />
          <textarea
            rows={2}
            value={item.description}
            onChange={(e) => handleChange([...path, i, "description"], e.target.value)}
            className={`${inputClass} resize-y`}
            placeholder="Description"
          />
        </div>
      ))}
    </div>
  );
}

function FaqEditor({ path, items, handlers }: { path: Path; items: Array<{ question: string; answer: string }>; handlers: Handlers }) {
  const { handleChange, handleArrayAdd, handleArrayRemove } = handlers;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>FAQ</span>
        <button
          type="button"
          onClick={() => handleArrayAdd(path, { question: "Question?", answer: "Answer." })}
          className="text-primary hover:text-secondary"
        >
          <Plus size={14} />
        </button>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-outline-variant/25 bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant">FAQ {i + 1}</span>
            <button type="button" onClick={() => handleArrayRemove(path, i)} className="text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => handleChange([...path, i, "question"], e.target.value)}
            className={inputClass}
            placeholder="Question"
          />
          <textarea
            rows={3}
            value={item.answer}
            onChange={(e) => handleChange([...path, i, "answer"], e.target.value)}
            className={`${inputClass} resize-y`}
            placeholder="Answer"
          />
        </div>
      ))}
    </div>
  );
}

function ProcessStepsEditor({
  path,
  items,
  handlers,
}: {
  path: Path;
  items: Array<{ title: string; description: string }>;
  handlers: Handlers;
}) {
  return <FeaturePairsEditor label="Process steps" path={path} items={items} handlers={handlers} />;
}

function LabeledSectionsEditor({
  path,
  items,
  handlers,
}: {
  path: Path;
  items: Array<{ title: string; intro?: string; bullets?: string[]; items?: Array<{ title: string; description: string }> }>;
  handlers: Handlers;
}) {
  const { handleChange, handleArrayAdd, handleArrayRemove } = handlers;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Labeled sections</span>
        <button
          type="button"
          onClick={() => handleArrayAdd(path, { title: "Section title", intro: "", bullets: [] })}
          className="text-primary hover:text-secondary"
        >
          <Plus size={14} />
        </button>
      </div>
      {(items || []).map((section, si) => (
        <details key={si} open className="rounded-lg border border-outline-variant/25 bg-white p-3">
          <summary className="cursor-pointer text-sm font-bold text-primary">{section.title || `Section ${si + 1}`}</summary>
          <div className="mt-3 space-y-2">
            <button type="button" onClick={() => handleArrayRemove(path, si)} className="text-xs text-red-500">
              Remove section
            </button>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleChange([...path, si, "title"], e.target.value)}
              className={inputClass}
              placeholder="Section title"
            />
            <textarea
              rows={2}
              value={section.intro ?? ""}
              onChange={(e) => handleChange([...path, si, "intro"], e.target.value)}
              className={`${inputClass} resize-y`}
              placeholder="Intro (optional)"
            />
            <StringListEditor
              label="Bullets"
              path={[...path, si, "bullets"]}
              items={section.bullets ?? []}
              handlers={handlers}
            />
            <FeaturePairsEditor
              label="Feature cards (optional)"
              path={[...path, si, "items"]}
              items={section.items ?? []}
              handlers={handlers}
            />
          </div>
        </details>
      ))}
    </div>
  );
}

export function SubServicePageContentEditor({
  basePath,
  content,
  subTitle,
  handlers,
}: {
  basePath: Path;
  content: Partial<SubServicePageContent> | undefined;
  subTitle: string;
  handlers: Handlers;
}) {
  const pc = content ?? createEmptySubServicePageContent("sub-service", subTitle);
  const p = (suffix: Path) => [...basePath, ...suffix] as Path;

  return (
    <details className={sectionClass}>
      <summary className="cursor-pointer font-bold text-primary">
        Detail page content — {subTitle || "sub-service"}
      </summary>
      <div className="mt-4 space-y-4">
        <Field label="Hero title">
          <input
            type="text"
            value={pc.heroTitle ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "heroTitle"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Short description (hero)">
          <textarea
            rows={2}
            value={pc.shortDescription ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "shortDescription"]), e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Why choose — heading">
          <input
            type="text"
            value={pc.whyChooseHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whyChooseHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Why choose — intro (optional)">
          <textarea
            rows={2}
            value={pc.whyChooseIntro ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whyChooseIntro"]), e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <StringListEditor label="Why choose — bullets" path={p(["pageContent", "whyChooseItems"])} items={pc.whyChooseItems ?? []} handlers={handlers} />
        <FeaturePairsEditor label="Why choose — feature cards" path={p(["pageContent", "whyChooseFeatures"])} items={pc.whyChooseFeatures ?? []} handlers={handlers} />

        <Field label="What is — heading">
          <input
            type="text"
            value={pc.whatIsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whatIsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="What is — description">
          <textarea
            rows={4}
            value={pc.whatIsDescription ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whatIsDescription"]), e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Key points — heading (optional)">
          <input
            type="text"
            value={pc.keyPointsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "keyPointsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Key points" path={p(["pageContent", "keyPoints"])} items={pc.keyPoints ?? []} handlers={handlers} />

        <Field label="Key features — heading">
          <input
            type="text"
            value={pc.keyFeaturesHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "keyFeaturesHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Key features — intro (optional)">
          <textarea
            rows={2}
            value={pc.keyFeaturesIntro ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "keyFeaturesIntro"]), e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <StringListEditor label="Key features" path={p(["pageContent", "keyFeatures"])} items={pc.keyFeatures ?? []} handlers={handlers} />
        <FeaturePairsEditor
          label="Key features — feature cards"
          path={p(["pageContent", "keyFeatureFeatures"])}
          items={pc.keyFeatureFeatures ?? []}
          handlers={handlers}
        />

        <Field label="Benefits — intro (optional)">
          <textarea
            rows={2}
            value={pc.benefitsIntro ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "benefitsIntro"]), e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <StringListEditor label="Benefits" path={p(["pageContent", "benefits"])} items={pc.benefits ?? []} handlers={handlers} />
        <FeaturePairsEditor label="Benefit feature cards" path={p(["pageContent", "benefitFeatures"])} items={pc.benefitFeatures ?? []} handlers={handlers} />

        <Field label="Why choose us — heading">
          <input
            type="text"
            value={pc.whyChooseUsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whyChooseUsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Why choose us" path={p(["pageContent", "whyChooseUs"])} items={pc.whyChooseUs ?? []} handlers={handlers} />

        <Field label="Ideal for — heading (optional)">
          <input
            type="text"
            value={pc.idealForHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "idealForHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Ideal for" path={p(["pageContent", "idealFor"])} items={pc.idealFor ?? []} handlers={handlers} />

        <Field label="Registrable items — heading (optional)">
          <input
            type="text"
            value={pc.registrableItemsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "registrableItemsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Registrable items" path={p(["pageContent", "registrableItems"])} items={pc.registrableItems ?? []} handlers={handlers} />

        <Field label="Process — heading (optional)">
          <input
            type="text"
            value={pc.processStepsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "processStepsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <ProcessStepsEditor path={p(["pageContent", "processSteps"])} items={pc.processSteps ?? []} handlers={handlers} />

        <Field label="Documents — heading (optional)">
          <input
            type="text"
            value={pc.documentsHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "documentsHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Documents required" path={p(["pageContent", "documentsRequired"])} items={pc.documentsRequired ?? []} handlers={handlers} />

        <Field label="Who should apply — heading (optional)">
          <input
            type="text"
            value={pc.whoShouldApplyHeading ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "whoShouldApplyHeading"]), e.target.value)}
            className={inputClass}
          />
        </Field>
        <StringListEditor label="Who should apply" path={p(["pageContent", "whoShouldApply"])} items={pc.whoShouldApply ?? []} handlers={handlers} />

        <LabeledSectionsEditor path={p(["pageContent", "labeledSections"])} items={pc.labeledSections ?? []} handlers={handlers} />
        <FaqEditor path={p(["pageContent", "faq"])} items={pc.faq ?? []} handlers={handlers} />

        <Field label="Bottom CTA title">
          <input
            type="text"
            value={pc.ctaTitle ?? ""}
            onChange={(e) => handlers.handleChange(p(["pageContent", "ctaTitle"]), e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
    </details>
  );
}

export function ServiceHubEditor({
  serviceIndex,
  service,
  handlers,
}: {
  serviceIndex: number;
  service: Record<string, unknown>;
  handlers: Handlers;
}) {
  const base: Path = ["pages", "services", "serviceList", serviceIndex];
  const p = (key: string | number) => [...base, key] as Path;
  const post = (service.postRegistrationSection as Record<string, unknown>) ?? {};
  const benefitsCards = (service.registeredBusinessBenefitsCards as Array<{ title: string; description: string; icon?: string }>) ?? [];
  const subServices = (service.subServices as Array<Record<string, unknown>>) ?? [];
  const highlights = (post.highlights as Array<{ title: string; description: string }>) ?? [];
  const paragraphs = (post.paragraphs as string[]) ?? [];

  return (
    <details open={service.pageLayout === "hub"} className="mt-6 space-y-4 rounded-xl border-2 border-primary/20 bg-primary/[0.03] p-5">
      <summary className="cursor-pointer font-headline text-base font-bold text-primary">
        Hub layout (generic) {service.pageLayout === "hub" ? "— active" : "— optional"}
      </summary>
      <div className="mt-4 space-y-4">
      <p className="text-sm text-on-surface-variant">
        Use hub layout for services with a benefits grid, blue sub-service cards, and rich sub-pages. Set a unique slug on each sub-service for detail URLs.
      </p>

      <Field label="Page layout" hint="Hub shows intro, benefits, blue card grid, and post section. Standard uses deliverables/benefits layout.">
        <select
          value={String(service.pageLayout ?? "standard")}
          onChange={(e) => handlers.handleChange(p("pageLayout"), e.target.value)}
          className={inputClass}
        >
          <option value="standard">Standard detail page</option>
          <option value="hub">Hub (sub-service cards + detail pages)</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Hero CTA — primary">
          <input
            type="text"
            value={String(service.heroCtaPrimary ?? "")}
            onChange={(e) => handlers.handleChange(p("heroCtaPrimary"), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Hero CTA — secondary">
          <input
            type="text"
            value={String(service.heroCtaSecondary ?? "")}
            onChange={(e) => handlers.handleChange(p("heroCtaSecondary"), e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Service intro (below hero)">
        <textarea
          rows={3}
          value={String(service.serviceIntro ?? "")}
          onChange={(e) => handlers.handleChange(p("serviceIntro"), e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Benefits section — title">
        <input
          type="text"
          value={String(service.registeredBusinessBenefitsTitle ?? "")}
          onChange={(e) => handlers.handleChange(p("registeredBusinessBenefitsTitle"), e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Benefits section — intro">
        <textarea
          rows={3}
          value={String(service.registeredBusinessBenefitsText ?? "")}
          onChange={(e) => handlers.handleChange(p("registeredBusinessBenefitsText"), e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={labelClass}>Benefits cards</span>
          <button
            type="button"
            onClick={() =>
              handlers.handleArrayAdd(p("registeredBusinessBenefitsCards"), {
                title: "Benefit",
                description: "Description",
                icon: "CheckCircle2",
              })
            }
            className="text-primary hover:text-secondary"
          >
            <Plus size={14} />
          </button>
        </div>
        {benefitsCards.map((card, ci) => (
          <div key={ci} className="grid grid-cols-1 gap-2 rounded-lg border border-outline-variant/25 bg-white p-3 md:grid-cols-2">
            <button type="button" onClick={() => handlers.handleArrayRemove(p("registeredBusinessBenefitsCards"), ci)} className="text-left text-xs text-red-500 md:col-span-2">
              Remove card
            </button>
            <input
              type="text"
              value={card.title}
              onChange={(e) => handlers.handleChange([...p("registeredBusinessBenefitsCards"), ci, "title"], e.target.value)}
              className={inputClass}
              placeholder="Title"
            />
            <LucideIconSelect
              id={`hub-benefit-icon-${serviceIndex}-${ci}`}
              value={card.icon ?? "CheckCircle2"}
              onChange={(next) => handlers.handleChange([...p("registeredBusinessBenefitsCards"), ci, "icon"], next)}
              options={LUCIDE_SERVICE_ICON_OPTIONS_SORTED}
            />
            <textarea
              rows={2}
              value={card.description}
              onChange={(e) => handlers.handleChange([...p("registeredBusinessBenefitsCards"), ci, "description"], e.target.value)}
              className={`${inputClass} md:col-span-2 resize-y`}
              placeholder="Description"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Sub-service grid — heading">
          <input
            type="text"
            value={String(service.registrationTypesHeading ?? "")}
            onChange={(e) => handlers.handleChange(p("registrationTypesHeading"), e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Sub-service grid — eyebrow">
          <input
            type="text"
            value={String(service.registrationTypesEyebrow ?? "")}
            onChange={(e) => handlers.handleChange(p("registrationTypesEyebrow"), e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Sub-service grid — subtext">
        <textarea
          rows={2}
          value={String(service.registrationTypesSubtext ?? "")}
          onChange={(e) => handlers.handleChange(p("registrationTypesSubtext"), e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="space-y-3 border-t border-outline-variant/20 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">Sub-services</span>
          <button
            type="button"
            onClick={() =>
              handlers.handleArrayAdd(p("subServices"), {
                id: "new-sub-service",
                title: "New Sub-Service",
                hook: "",
                description: "",
                pageContent: createEmptySubServicePageContent("new-sub-service", "New Sub-Service"),
              })
            }
            className="flex items-center gap-1 text-sm font-bold text-primary hover:text-secondary"
          >
            <Plus size={16} /> Add sub-service
          </button>
        </div>
        {subServices.map((sub, si) => (
          <div key={si} className="space-y-3 rounded-xl border border-outline-variant/30 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{String(sub.title ?? `Sub-service ${si + 1}`)}</span>
              <button type="button" onClick={() => handlers.handleArrayRemove(p("subServices"), si)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Slug ID (URL)" hint={`/services/${String(service.id ?? "service")}/your-slug`}>
                <input
                  type="text"
                  value={String(sub.id ?? "")}
                  onChange={(e) => handlers.handleChange([...p("subServices"), si, "id"], e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Card title">
                <input
                  type="text"
                  value={String(sub.title ?? "")}
                  onChange={(e) => handlers.handleChange([...p("subServices"), si, "title"], e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Card hook">
              <input
                type="text"
                value={String(sub.hook ?? "")}
                onChange={(e) => handlers.handleChange([...p("subServices"), si, "hook"], e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Card description">
              <textarea
                rows={2}
                value={String(sub.description ?? "")}
                onChange={(e) => handlers.handleChange([...p("subServices"), si, "description"], e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={Boolean(sub.hubCardLinkDisabled)}
                onChange={(e) =>
                  handlers.handleChange([...p("subServices"), si, "hubCardLinkDisabled"], e.target.checked)
                }
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              Info-only hub card (no link, no “Know more” button)
            </label>
            <SubServicePageContentEditor
              basePath={[...p("subServices"), si]}
              content={sub.pageContent as Partial<SubServicePageContent> | undefined}
              subTitle={String(sub.title ?? "")}
              handlers={handlers}
            />
          </div>
        ))}
      </div>

      <details open className={sectionClass}>
        <summary className="cursor-pointer font-bold text-primary">Post grid section (below blue cards)</summary>
        <div className="mt-4 space-y-3">
          <Field label="Title">
            <input
              type="text"
              value={String(post.title ?? "")}
              onChange={(e) => handlers.handleChange([...p("postRegistrationSection"), "title"], e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <textarea
              rows={2}
              value={String(post.subtitle ?? "")}
              onChange={(e) => handlers.handleChange([...p("postRegistrationSection"), "subtitle"], e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </Field>
          <StringListEditor
            label="Paragraphs"
            path={[...p("postRegistrationSection"), "paragraphs"]}
            items={paragraphs}
            placeholder="New paragraph"
            handlers={handlers}
          />
          <FeaturePairsEditor
            label="Highlight cards"
            path={[...p("postRegistrationSection"), "highlights"]}
            items={highlights}
            handlers={handlers}
          />
        </div>
      </details>
      </div>
    </details>
  );
}

export function ServiceStandardSubServicesEditor({
  serviceIndex,
  service,
  handlers,
}: {
  serviceIndex: number;
  service: Record<string, unknown>;
  handlers: Handlers;
}) {
  const base: Path = ["pages", "services", "serviceList", serviceIndex];
  const p = (key: string | number) => [...base, key] as Path;
  const subServices = (service.subServices as Array<Record<string, unknown>>) ?? [];

  if (service.pageLayout === "hub") return null;

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-outline-variant/25 p-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-primary">Sub-services list (standard layout)</span>
        <button
          type="button"
          onClick={() => handlers.handleArrayAdd(p("subServices"), { title: "Sub-service", description: "" })}
          className="text-primary hover:text-secondary"
        >
          <Plus size={14} />
        </button>
      </div>
      {subServices.map((sub, si) => (
        <div key={si} className="flex flex-col gap-2 rounded-lg border border-outline-variant/20 bg-surface-container p-3 md:flex-row md:items-start">
          <input
            type="text"
            value={String(sub.title ?? "")}
            onChange={(e) => handlers.handleChange([...p("subServices"), si, "title"], e.target.value)}
            className={`${inputClass} md:w-1/3`}
            placeholder="Title"
          />
          <textarea
            rows={2}
            value={String(sub.description ?? "")}
            onChange={(e) => handlers.handleChange([...p("subServices"), si, "description"], e.target.value)}
            className={`${inputClass} flex-1 resize-y`}
            placeholder="Description"
          />
          <button type="button" onClick={() => handlers.handleArrayRemove(p("subServices"), si)} className="text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
