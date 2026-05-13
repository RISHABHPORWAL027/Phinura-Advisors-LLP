import { useCMS } from "../hooks/useCMS";

const DEFAULT_PREFIX = "Design and Develop by ";
const DEFAULT_NAME = "Devyug Solution";
const DEFAULT_URL = "https://www.devyugsolutions.com/";

type Props = {
  className?: string;
  linkClassName?: string;
};

/**
 * Site-wide footer credit line (editable via Admin → General).
 */
export function DeveloperCredit({
  className = "text-slate-400 text-xs",
  linkClassName = "text-primary hover:underline font-semibold",
}: Props) {
  const { data } = useCMS();
  const dc = data?.developerCredit;
  const prefix = dc?.prefix ?? DEFAULT_PREFIX;
  const name = dc?.name ?? DEFAULT_NAME;
  const url = dc?.url ?? DEFAULT_URL;

  return (
    <p className={className}>
      {prefix}
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {name}
      </a>
    </p>
  );
}
