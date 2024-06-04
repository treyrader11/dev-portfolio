// "use client";

// import { cn } from "@/lib/utils";
// import { Vanish } from "../Vanish";
// import BlurredIn from "../BlurredIn";
// import React from "react";

// function PageTitle({
//   className,
//   containerClass,
//   backgroundColor,
//   title,
//   hasBlur = false,
//   once = false,
// }) {
//   const commonContainerClasses = cn(
//     "mx-auto",
//     "bg-dark-400",
//     "px-6",
//     "relative",
//     // "font-pp-acma",
//     containerClass
//   );
//   const commonVanishClasses = cn(
//     "text-7xl",
//     // "md:text-9xl",
//     "font-bold",
//     "text-left",
//     "text-secondary",
//     "relative",
//     className
//   );

//   const Content = () => (
//     <Vanish
//       once={once}
//       className={commonVanishClasses}
//       delay={0.2}
//       phrases={[title]}
//     />
//   );

//   return hasBlur ? (
//     <BlurredIn
//       once
//       style={{ backgroundColor }}
//       className={commonContainerClasses}
//     >
//       <Content />
//     </BlurredIn>
//   ) : (
//     <div style={{ backgroundColor }} className={commonContainerClasses}>
//       <Content />
//     </div>
//   );
// }

// export default React.memo(PageTitle);

"use client";

import { cn } from "@/lib/utils";
import { Vanish } from "../Vanish";
import BlurredIn from "../BlurredIn";
import React from "react";

export default function PageTitle({
  className,
  containerClass,
  backgroundColor,
  title,
  hasBlur = false,
  once = false,
}) {
  const commonContainerClasses = cn(
    "mx-auto",
    "bg-dark-400",
    "px-6",
    "relative",
    // "font-pp-acma",
    containerClass
  );
  const commonVanishClasses = cn(
    "text-7xl",
    // "md:text-9xl",
    "font-bold",
    "text-left",
    "text-secondary",
    "relative",
    className
  );

  const Content = () => (
    <Vanish
      once={once}
      className={commonVanishClasses}
      delay={0.2}
      phrases={[title]}
    />
  );

  return hasBlur ? (
    <BlurredIn
      once
      style={{ backgroundColor }}
      className={commonContainerClasses}
    >
      <Content />
    </BlurredIn>
  ) : (
    <div style={{ backgroundColor }} className={commonContainerClasses}>
      <Content />
    </div>
  );
}
