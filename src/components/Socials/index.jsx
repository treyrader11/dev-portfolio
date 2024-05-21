import { cn } from "@/lib/utils";
import { socials } from "./links.data";
import Rounded from "../Rounded";
import StyledLink from "../StyledLink";

// export default function Socials({ className, rounded = false }) {
//   return (
//     <div className={cn("flex flex-row space-x-2", className)}>
//       {socials.map(({ icon: Icon, href, label }) =>
//         rounded ? (
//           <Rounded
//             backgroundColor="#8550C2"
//             key={`social-${href}-rounded`}
//             href={`${href}`}
//             className={cn("size-10 p-0")}
//           >
//             <span className="relative z-[10]">{Icon}</span>
//           </Rounded>
//         ) : (
//           <StyledLink key={`social-${href}`} href={`${href}`}>
//             <Magnetic>{label}</Magnetic>
//           </StyledLink>
//         )
//       )}
//     </div>
//   );
// }

 {/* <div className="my-4 ml-4">
         <Socials
           textColor="text-gray-500"
           className={cn("border-none", "rounded-none", "shadow-none", "p-0", "w-fit", "size-10")}
         />

       </div> */}

export default function Socials({
  containerClass,
  className,
  rounded = false,
  textColor = "#808080"
}) {
  return (
    <div className={cn("flex flex-row space-x-2", containerClass)}>
      {socials.map(({ icon: Icon, href, label }) => (
        <Rounded
          backgroundColor={rounded ? "#8550C2" : "transparent"}
          
          key={`social-${href}-rounded`}
          href={`${href}`}
          className={cn("size-10 p-0", className)}
        >
          <span className="relative z-[10]">
            {rounded ? Icon : <StyledLink className={cn(textColor, "")} href={`${href}`}>{label}</StyledLink>}
          </span>
        </Rounded>
      ))}
    </div>
  );
}
