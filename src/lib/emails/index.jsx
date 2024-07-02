"use client";

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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function Email({ email, name }) {
  // console.log("Inside of the email template. email:", email);
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Body className={cn("bg-gray-100")}>
        <Container className={cn("pt-5", "px-6", "pb-12")}>
          <Img
            src={`${baseUrl}/images/portraits/headshot.png`}
            width={60}
            height={60}
            alt="Trey Rader"
            className="object-cover rounded-full"
          />

          <Heading className="mt-12 text-2xl font-bold">👋 Hi {name},</Heading>
          <Section className="my-6">
            <Text className="text-lg">
              Thank you for your inquiry. I generally get around to responding in the morning. Looking forward.
            </Text>
          </Section>
          <Text className="">
            Best,
            <br />- Trey
          </Text>
          <Hr className="mt-12" />
          <Text
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
