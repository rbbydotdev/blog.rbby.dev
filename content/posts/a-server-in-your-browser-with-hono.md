+++
date = '2026-02-05T11:18:01+07:00'
draft = false 
title = 'A Server in Your Browser'
description = 'Achieving optimized background processing in a service worker with fetch and Hono as a typed, debuggable RPC'
tags = ["service-workers", "rpc", "hono", "web-performance"]
+++

Modern apps often require blocking processing for common features like searching, indexing, or image transformations. Often the solution is to push this processing to a web worker, but the interface for web workers is an awkward postMessage event emitter. 

## Web-worker RPC with Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) can alleviate the pains of this interface by making method calls across the main->worker boundary transparent. You can call otherwise remote procedures as if they were functions in the main thread — **it works like magic** — but it comes with a cost. You expect your wrapped function to behave just as it did in the main thread, but it does not. The mental model can make it hard to debug. Errors and stack traces are confusing. Object serialization and deserialization is opaque.

## Fetch as RPC

As web developers, we already have a very familiar RPC model: `fetch`. Service workers let you use that model inside the browser. A service worker is effectively a shared worker scoped to a path, driven by fetch events. Instead of inventing an RPC protocol, you respond to HTTP requests. This turns background work into something that looks like a local server.

What you get for free:

- A familiar request/response, easy-to-grok mental model, debugging, and errors
- Native AbortController support (request.signal)
- The Cache API (no DIY LRU)
- Easy integration with existing tools (TanStack Query, etc.)

Other points to note:

- Usage of File objects is *shared*, not copied, so working with large data can be just as efficient as web workers
- Abort controllers map cleanly to autocomplete search results; each new keydown of a search term cancels the previous request
- Background resource fetch works transparently; `<img src="/sw/image.webp">` — no `URL.createObjectURL()` and its subsequent lifecycle management needed

{{< email-signup >}}
Join my email list for updates
{{< /email-signup >}}

## Hono routing and typed RPC

For easy routing and "server"-like behavior for our requests, you can use [Hono](https://hono.dev/docs/getting-started/service-worker). Wiring up Hono looks like this:

```javascript
import { Hono } from 'hono'
import { fire } from 'hono/service-worker'
import { handle } from "hono/service-worker";

const app = new Hono().basePath('/sw')

app.get('/', (c) => c.text('Hello World'));

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", handle(app));

```

Now `/sw/*` is effectively an HTTP API running off the main thread.

[You can also get an RPC type-safe client when you export your routes type](https://hono.dev/docs/guides/rpc#client), `export type AppType = typeof route`

Hono works well here because it’s small (~18 KB), has good error handling, Zod integration, and can generate a typed RPC client — so your "local server" still has end-to-end types.

## More on service workers...

Requests for large media types like images — `<img>` — can also be cached using the Cache API. Serving large data objects, which may otherwise rely on an IndexedDB query, may be done directly by using the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), turning an otherwise `500ms` request into a `20ms` one.

Service workers can also **stream** responses natively when returning a `Response` whose body is a `ReadableStream`.

This is especially compelling for:

- Large downloads
- Media streaming
- Progressive image loading
- On-the-fly transforms (compression, encryption, watermarking)

## In the wild

Anecdotally, I found many great use cases in [Opal Editor](https://github.com/rbbydotdev/opal) for these abilities. Besides async image upload conversion and management, streaming is utilized when [zipping a large data set for downloading entire workspaces](https://github.com/rbbydotdev/opal/blob/0df3af7151fdef2318a9d847fa46bad23d7169b5/src/lib/service-worker/handleDownloadRequest.ts#L70).

## Conclusion

A service worker as a server in the browser is a good option for background async processing. This setup is especially advantageous for managing and processing media. Together with Hono RPC, you get clearer mental models, better debuggability, and fewer bespoke abstractions. It’s not a replacement for every worker use case, but when you want off-main-thread work that still feels like the web, running a server in your browser is a surprisingly powerful option.

## Example

The following is an example that exhibits a simple local image gallery. It converts PNG/JPGs to WebP, storage uses persistent IndexedDB, and the resulting images are served from the service worker with the Cache API for fast load times. The example also implements a typed Hono RPC client, which is not very obvious in the Hono documentation.

As a great showcase of how optimized this setup is, try uploading 20–30 PNG images at once. Not only is the upload and conversion very fast, but the recall on page reload is very quick as well.

### Demo:

[https://rbby.dev/sw-images-example](https://rbby.dev/sw-images-example)

### Repo:
<a alt="Image Gallery Example Github Repo" href="https://github.com/rbbydotdev/sw-images-example">
  <img src="/a-server-in-your-browser-with-hono/sw-images-example.png" />
</a>