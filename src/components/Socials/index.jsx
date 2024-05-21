import { cn } from "@/lib/utils";
import { socials } from "./links.data";
import Rounded from "../Rounded";
import StyledLink from "../StyledLink";

export default function Socials({
  containerClass,
  className,
  rounded = false,
  textColor = "#808080",
}) {
  return (
    <div className={cn("flex flex-row space-x-2", containerClass)}>
      {socials.map(({ icon: Icon, href, label, color }, index) => (
        <Rounded
          backgroundColor={rounded ? color : "transparent"}
          key={`social-${index}-rounded`}
          href={`${href}`}
          className={cn("size-10 p-0", className)}
        >
          <span className="relative z-[10]">
            {rounded ? (
              Icon
            ) : (
              <StyledLink className={cn(textColor, "")} href={`${href}`}>
                {label}
              </StyledLink>
            )}
          </span>
        </Rounded>
      ))}
    </div>
  );
}
