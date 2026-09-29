"use client";

import type { Experience } from "@/lib/types";
import { useState } from "react";
import DetailModal from "./DetailModal";
import Reveal from "./Reveal";

function formatDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export default function ExperienceTimeline({ items }: { items: Experience[] }) {
  const [selected, setSelected] = useState<Experience | null>(null);

  return (
    <>
      <section
        id="experience"
        className="container scroll-mt-24 py-12 md:py-14"
      >
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="portfolio-section-label">Pengalaman profesional</h2>
          {items.length === 0 && (
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Placeholder: tambahkan riwayat kerja IT Support atau Application
              Support, termasuk jabatan, perusahaan, tanggal, dan kontribusi yang
              dapat diverifikasi.
            </p>
          )}
        </Reveal>
        {items.length > 0 && (
          <div className="mx-auto mt-5 max-w-3xl divide-y divide-base-muted/80">
            {items.map((item, index) => (
              <Reveal
                key={item.id}
                delay={Math.min(index * 0.08, 0.32)}
                y={14}
              >
                <article className="group grid gap-2 py-5 transition-transform duration-200 hover:translate-x-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-ink">
                      {item.role_title}
                    </h3>
                    <p className="mt-1 break-words text-sm text-ink-muted">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                    {item.description && (
                      <div className="mt-3 space-y-2 text-sm leading-6 text-ink-muted">
                        {item.description
                          .split(/\r?\n|\\n/)
                          .map((line, idx) =>
                            line.trim() ? <p key={idx}>{line}</p> : null,
                          )}
                      </div>
                    )}
                    {item.description && (
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="mt-2 inline-flex min-h-10 items-center text-sm font-medium text-accent-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                      >
                        Rincian peran
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-ink-faint sm:pt-1 sm:text-right">
                    {formatDate(item.start_date)} &ndash;{" "}
                    {item.is_current ? "Sekarang" : formatDate(item.end_date)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <DetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.role_title ?? ""}
        eyebrow={selected?.company}
      >
        <p className="mb-4 text-ink">{selected?.location}</p>
        {selected?.description
          .split(/\r?\n|\\n/)
          .map((line, index) =>
            line.trim() ? (
              <p key={index} className="mb-3">
                {line}
              </p>
            ) : null,
          )}
      </DetailModal>
    </>
  );
}
