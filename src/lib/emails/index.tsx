import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

// Use the public site URL so email images load from a stable, publicly
// accessible domain. Vercel preview URLs can be gated by deployment
// protection (causing broken images), and localhost is unreachable to
// inbox recipients.
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://treyrader.dev");

interface EmailProps {
  name: string;
}

export default function Email({ name }: EmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out — I received your message!</Preview>
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
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-[520px] py-10 px-5">
            <Section className="bg-white rounded-xl overflow-hidden shadow-sm">
              {/* Header with headshot */}
              <Section className="bg-gray-900 px-10 pt-8 pb-6 text-center">
                <Img
                  src={`${baseUrl}/images/portraits/headshot.png`}
                  width={80}
                  height={80}
                  alt="Trey Rader"
                  className="rounded-full mx-auto object-cover"
                  style={{
                    border: "3px solid rgba(255,255,255,0.2)",
                  }}
                />
                <Text className="text-white text-lg font-semibold mt-4 mb-0">
                  Trey Rader
                </Text>
                <Text className="text-gray-400 text-sm mt-1 mb-0">
                  Software Developer
                </Text>
              </Section>

              {/* Body */}
              <Section className="px-10 py-8">
                <Heading className="text-xl font-bold text-gray-900 mt-0 mb-4">
                  Hi {name},
                </Heading>
                <Text className="text-base text-gray-700 leading-relaxed mt-0">
                  Thank you for reaching out! I wanted to let you know that I
                  received your message and will review it shortly.
                </Text>
                <Text className="text-base text-gray-700 leading-relaxed">
                  I typically respond within 24 hours. In the meantime, feel
                  free to check out my portfolio at{" "}
                  <a
                    href="https://treyrader.dev"
                    className="text-brand underline"
                  >
                    treyrader.dev
                  </a>
                  .
                </Text>
                <Text className="text-base text-gray-700 mt-6 mb-0">
                  Best,
                  <br />
                  Trey
                </Text>
              </Section>

              {/* Footer */}
              <Hr className="border-gray-200 mx-10 my-0" />
              <Section className="px-10 py-5">
                <Text className="text-xs text-gray-400 text-center m-0 leading-relaxed">
                  This is an automated confirmation — please do not reply to
                  this email. If you need to follow up, use the contact form on
                  my website.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
