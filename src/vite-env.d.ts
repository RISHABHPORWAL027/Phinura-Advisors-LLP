/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMING_SOON?: string;
  readonly VITE_CMS_BACKEND?: string;
  readonly VITE_INSECURE_ADMIN?: string;
  readonly VITE_CONTACT_FORM_ENABLED?: string;
  readonly VITE_CONTACT_FORM_SMTP?: string;
  readonly VITE_GOOGLE_APPS_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.avif" {
  const src: string;
  export default src;
}
