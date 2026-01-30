import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      // If the asset is not found, try appending index.html (for directory requests)
      const url = new URL(request.url);

      if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
        // Try with trailing slash
        return Response.redirect(`${url.origin}${url.pathname}/`, 301);
      }

      // Return a 404 page if available, otherwise plain text
      try {
        const notFoundRequest = new Request(`${url.origin}/404.html`, request);
        const notFoundResponse = await getAssetFromKV(
          {
            request: notFoundRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};
