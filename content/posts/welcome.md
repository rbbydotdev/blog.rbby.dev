+++
date = '2026-01-25T07:06:23+07:00'
draft = false
title = 'Welcome to the Blog'
tags = ['meta']
+++

Welcome to my clean, minimal blog built with Hugo and PaperMod, styled with Gruvbox colors.

## Features

- **Clean Design**: No clutter, just content
- **Gruvbox Theme**: Easy on the eyes with light/dark mode toggle
- **Monospace Font**: IBM Plex Mono throughout
- **Fast**: Static site generation with Hugo
- **Simple**: No unnecessary complexity

Click the theme toggle icon (☀️/🌙) in the header to switch between light and dark modes!

{{< email-signup >}}
Join my email list for updates
{{< /email-signup >}}

## Code Example

Here's some sample code:

```typescript
export async function GithubDeviceAuthFlow({
  corsProxy,
  scopes = ["read:user", "public_repo", "workflow"],
  onVerification,
  onAuthentication,
}: {
  corsProxy?: string;
  scopes?: string[];
  onVerification: OnVerificationCallback;
  onVerificationError?: (error: Error) => void;
  onAuthentication?: (auth: GithubDeviceAuthFlowPayload) => void;
}) {
  const proxiedRequest = corsProxy
    ? request.defaults({
        baseUrl: `${stripTrailingSlash(corsProxy)}/github.com`,
      })
    : undefined;
  const auth = createOAuthDeviceAuth({
    request: proxiedRequest,
    clientType: "oauth-app",
    clientId: ENV.PUBLIC_GITHUB_CLIENT_ID,
    scopes,
    onVerification,
  });

  const authResult = await auth({ type: "oauth" });

  try {
    const baseUrl = optionalCORSBaseURL(corsProxy, "api.github.com");
    const octokit = new Octokit({
      auth: authResult.token,
      baseUrl,
    });
    const { data: user } = await octokit.request("GET /user");
    const payload = {
      login: user.login,
      token: authResult.token,
      obtainedAt: Date.now(),
      scope: scopes.join(","),
    } satisfies GithubDeviceAuthFlowPayload;
    onAuthentication?.(payload);
    return payload;
  } catch (e) {
    console.error("Failed to fetch user info:", e);
    throw mapToTypedError(e);
  }
}

```

This blog is built to be simple and focused on writing.
