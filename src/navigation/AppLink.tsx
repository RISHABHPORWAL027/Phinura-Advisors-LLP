import { createContext, useContext, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const PreviewLinkBaseContext = createContext("");

export function PreviewLinkBaseProvider({ base, children }: { base: string; children: ReactNode }) {
  return <PreviewLinkBaseContext.Provider value={base}>{children}</PreviewLinkBaseContext.Provider>;
}

/** Prefix internal paths when browsing under `/preview/*`. */
export function useAppPath(to: string): string {
  const base = useContext(PreviewLinkBaseContext);
  const path = to.startsWith("/") ? to : `/${to}`;
  if (!base) return path;
  if (path === "/") return base;
  return `${base}${path}`;
}

export type AppLinkProps = Omit<LinkProps, "to"> & { to: string };

export function AppLink({ to, ...props }: AppLinkProps) {
  return <Link to={useAppPath(to)} {...props} />;
}
