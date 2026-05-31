type PartnerLike = { name?: string; logo?: string };
type TestimonialLike = { role?: string; companyLogo?: string };

/** Prefer Strategic Industry Partners logo when the review role mentions that company; otherwise use the review’s own logo. */
export function resolveTestimonialCompanyLogo(
  testimonial: TestimonialLike,
  partners: PartnerLike[] | undefined
): string {
  const role = (testimonial.role ?? "").trim().toLowerCase();
  if (role && partners?.length) {
    for (const partner of partners) {
      const name = (partner.name ?? "").trim();
      if (!name) continue;
      const logo = (partner.logo ?? "").trim();
      if (!logo) continue;
      if (role.includes(name.toLowerCase())) return logo;
    }
  }

  return (testimonial.companyLogo ?? "").trim();
}
