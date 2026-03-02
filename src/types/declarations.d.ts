declare module "@mailchimp/mailchimp_marketing" {
  interface Config {
    apiKey: string;
    server: string;
  }

  interface ListMemberBody {
    email_address: string;
    status:
      | "subscribed"
      | "unsubscribed"
      | "cleaned"
      | "pending"
      | "transactional";
  }

  interface ListsAPI {
    addListMember(
      listId: string,
      body: ListMemberBody
    ): Promise<Record<string, unknown>>;
  }

  const mailchimp: {
    setConfig(config: Config): void;
    lists: ListsAPI;
  };

  export default mailchimp;
}

declare namespace JSX {
  interface IntrinsicElements {
    threeGlobe: Record<string, unknown>;
  }
}

declare module "@studio-freight/lenis" {
  export default class Lenis {
    constructor(options?: Record<string, unknown>);
    destroy(): void;
    raf(time: number): void;
    scrollTo(
      target: number | string | HTMLElement,
      options?: Record<string, unknown>
    ): void;
  }
}
