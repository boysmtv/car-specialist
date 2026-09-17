import type { Faq } from "@/types";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const cats = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <div className="grid gap-6">
      {cats.map((c) => (
        <div key={c}>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{c}</h3>
          <div className="grid gap-2">
            {faqs.filter((f) => f.category === c).map((f) => (
              <details key={f.id} className="card px-4 py-3">
                <summary className="cursor-pointer font-semibold">{f.question}</summary>
                <p className="mt-2 text-sm text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
