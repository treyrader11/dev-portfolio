export interface JiraCredentials {
  domain: string;
  email: string;
  apiToken: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
        colorName: string;
      };
    };
    project: {
      key: string;
      name: string;
    };
    priority?: {
      name: string;
      iconUrl: string;
    };
    assignee?: {
      accountId: string;
      displayName: string;
      avatarUrls: Record<string, string>;
    };
    reporter?: {
      accountId: string;
      displayName: string;
      avatarUrls: Record<string, string>;
    };
    creator?: {
      accountId: string;
      displayName: string;
      avatarUrls: Record<string, string>;
    };
    updated: string;
    created: string;
  };
}

export interface JiraSearchResponse {
  issues: JiraIssue[];
  total: number;
  startAt: number;
  maxResults: number;
}
