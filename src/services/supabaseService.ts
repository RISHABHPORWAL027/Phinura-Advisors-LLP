import { supabase } from "../lib/supabase";
import { ICMSService, SiteDetails } from "./types";
import siteDetails from "../data/siteDetails.json";

export class SupabaseCMSService implements ICMSService {
  private tableName = "site_content";

  async getSiteDetails(): Promise<SiteDetails> {
    if (!supabase) {
      console.warn("Supabase not configured, falling back to local data.");
      return siteDetails as SiteDetails;
    }

    try {
      const [
        { data: config },
        { data: home },
        { data: about },
        { data: servicesMeta },
        { data: services },
        { data: legal },
        { data: contact },
        { data: reviews }
      ] = await Promise.all([
        supabase.from('site_config').select('*').maybeSingle(),
        supabase.from('page_home').select('*').maybeSingle(),
        supabase.from('page_about').select('*').maybeSingle(),
        supabase.from('services_meta').select('*').maybeSingle(),
        supabase.from('service_list').select('*'),
        supabase.from('page_legal').select('*'),
        supabase.from('page_contact').select('*').maybeSingle(),
        supabase.from('reviews_list').select('*')
      ]);

      // If database is empty, return local data
      if (!config && !home) return siteDetails as SiteDetails;

      const merged: any = {
        ...siteDetails,
        companyName: config?.company_name || siteDetails.companyName,
        fullName: config?.full_name || siteDetails.fullName,
        tagline: config?.tagline || siteDetails.tagline,
        address: config?.address || siteDetails.address,
        mobile: config?.mobile || siteDetails.mobile,
        email: config?.email || siteDetails.email,
        socialMedia: config?.social_media || siteDetails.socialMedia,
        pages: {
          home: {
            ...siteDetails.pages.home,
            hero: home?.hero || siteDetails.pages.home.hero,
            stats: home?.stats || siteDetails.pages.home.stats,
            simpleSolutions: home?.simple_solutions || siteDetails.pages.home.simpleSolutions,
            whyChooseUs: home?.why_choose_us || siteDetails.pages.home.whyChooseUs,
            cta: home?.cta || siteDetails.pages.home.cta,
            testimonials: reviews || siteDetails.pages.home.testimonials,
            testimonialsTitle: home?.testimonials_title || siteDetails.pages.home.testimonialsTitle,
            coreServices: {
              badge: home?.core_services_badge || siteDetails.pages.home.coreServices.badge,
              title: home?.core_services_title || siteDetails.pages.home.coreServices.title,
              subtitle: home?.core_services_subtitle || siteDetails.pages.home.coreServices.subtitle,
            }
          },
          about: {
            ...siteDetails.pages.about,
            hero: about?.hero || siteDetails.pages.about.hero,
            story: about?.story || siteDetails.pages.about.story,
            principles: about?.principles || siteDetails.pages.about.principles,
            values: about?.values_list || siteDetails.pages.about.values,
            people: about?.people || siteDetails.pages.about.people,
            cta: about?.cta || siteDetails.pages.about.cta,
          },
          services: {
            ...siteDetails.pages.services,
            hero: servicesMeta?.hero || siteDetails.pages.services.hero,
            statsCTA: servicesMeta?.stats_cta || siteDetails.pages.services.statsCTA,
            serviceList: services && services.length > 0 ? services : siteDetails.pages.services.serviceList,
          },
          contact: {
            ...siteDetails.pages.contact,
            hero: contact?.hero || siteDetails.pages.contact.hero,
            form: contact?.form || siteDetails.pages.contact.form,
          },
          privacy: {
            ...siteDetails.pages.privacy,
            hero: legal?.find((l: any) => l.slug === 'privacy')?.hero || siteDetails.pages.privacy.hero,
            content: legal?.find((l: any) => l.slug === 'privacy')?.content || siteDetails.pages.privacy.content,
          },
          terms: {
            ...siteDetails.pages.terms,
            hero: legal?.find((l: any) => l.slug === 'terms')?.hero || siteDetails.pages.terms.hero,
            content: legal?.find((l: any) => l.slug === 'terms')?.content || siteDetails.pages.terms.content,
          }
        }
      };

      return merged;
    } catch (e) {
      console.error("Multi-table fetch failed, falling back:", e);
      return siteDetails as SiteDetails;
    }
  }

  async updateSiteDetails(details: SiteDetails): Promise<void> {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      const updates = [
        // 1. Config
        supabase.from('site_config').upsert({
          id: 1,
          company_name: details.companyName,
          full_name: details.fullName,
          tagline: details.tagline,
          address: details.address,
          mobile: details.mobile,
          email: details.email,
          social_media: details.socialMedia
        }),
        // 2. Home
        supabase.from('page_home').upsert({
          id: 1,
          hero: details.pages.home.hero,
          stats: details.pages.home.stats,
          core_services_badge: details.pages.home.coreServices.badge,
          core_services_title: details.pages.home.coreServices.title,
          core_services_subtitle: details.pages.home.coreServices.subtitle,
          simple_solutions: details.pages.home.simpleSolutions,
          why_choose_us: details.pages.home.whyChooseUs,
          testimonials_title: details.pages.home.testimonialsTitle,
          cta: details.pages.home.cta
        }),
        // 3. About
        supabase.from('page_about').upsert({
          id: 1,
          hero: details.pages.about.hero,
          story: details.pages.about.story,
          principles: details.pages.about.principles,
          values_list: details.pages.about.values,
          people: details.pages.about.people,
          cta: details.pages.about.cta
        }),
        // 4. Services Meta
        supabase.from('services_meta').upsert({
          id: 1,
          hero: details.pages.services.hero,
          stats_cta: details.pages.services.statsCTA
        }),
        // 5. Contact
        supabase.from('page_contact').upsert({
          id: 1,
          hero: details.pages.contact.hero,
          form: details.pages.contact.form
        })
      ];

      // 6. Individual Services (Bulk Upsert)
      if (details.pages.services.serviceList.length > 0) {
        updates.push(supabase.from('service_list').upsert(details.pages.services.serviceList));
      }

      // 7. Reviews (Bulk Upsert)
      if (details.pages.home.testimonials.length > 0) {
        updates.push(supabase.from('reviews_list').upsert(details.pages.home.testimonials));
      }

      // 8. Legal
      updates.push(supabase.from('page_legal').upsert([
        { slug: 'privacy', title: details.pages.privacy.hero.title, content: details.pages.privacy.content },
        { slug: 'terms', title: details.pages.terms.hero.title, content: details.pages.terms.content }
      ]));

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        console.error("Some updates failed:", errors);
        throw new Error("Partial save failure. Check logs.");
      }
    } catch (e) {
      console.error("Global update failed:", e);
      throw e;
    }
  }
}
