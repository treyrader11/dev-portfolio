import { cn } from "@/lib/utils";

interface Props {
  name: string;
  description: string | null;
  clone_url: string;
}

export default function LatestRepo({ name, description, clone_url }: Props) {
  return (
    <div className="github-repo">
      <h1 className={cn("text-xl", "font-semibold", "text-gray-700")}>
        {name}
      </h1>
      <p className="my-4 text-base font-normal text-gray-500">{description}</p>
      <a
        href={clone_url}
        className={cn(
          "flex",
          "flex-row",
          "items-center",
          "w-full",
          "space-x-2",
          "font-semibold",
          "group"
        )}
      >
        <p>View Repository </p>
        <div className="transition duration-300 transform group-hover:translate-x-2">
          &rarr;
        </div>
      </a>
    </div>
  );
}
