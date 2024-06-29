import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import { cn } from "../utils";
// import { fontCursive, fontMono } from "../fonts";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://treyrader.dev";

// export default function Email({email, subject, name, message}) {
export default function Email({ name, subject, email }) {
  console.log("Inside of the email template. email:", email);
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
            // fontFamily: {
            //   cursive: ["var(--font-cursive)"],
            // },
          },
        },
      }}
    >
      <Body
        // style={{
        //   fontFamily:
        //     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        // }}
        className={cn("bg-gray-100")}
      >
        <Container className={cn("pt-5", "px-6", "pb-12")}>
          <Img
            src={`${baseUrl}/images/portraits/headshot.png`}
            width={60}
            height={60}
            alt="Trey Rader"
            className="object-cover rounded-full"
          />

          <Heading className="mt-12 text-2xl font-bold">👋 Hi there!</Heading>
          <Section className="my-6">
            <Text className="text-lg">
              This email is for simply letting you know that I have successfully
              received your inquiry and will be getting back to you as soon as I
              am back at my desk.
            </Text>
          </Section>
          <Text className="">
            Cheers,
            <br />- Trey
          </Text>
          <Hr className="mt-12" />
          <Text
            // style={{
            //   fontFamily:
            //     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
            // }}
            style={{
              fontFamily:
                '"Pacifico", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
            }}
            className="my-2 text-sm text-gray-400"
          >
            Trey Rader
          </Text>
          <Text className="my-2 ml-2 text-sm text-gray-400">
            📍 805 Smith Drive New Orleans, LA, 70005
          </Text>
          <Text className="my-2 ml-2 text-sm text-gray-400">
            📞 504.756.4538
          </Text>
        </Container>
      </Body>
    </Tailwind>
  );
}
