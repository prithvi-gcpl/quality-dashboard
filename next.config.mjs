/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // pptxgenjs and xlsx contain optional Node-only imports; they are not needed in the browser.
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false, https: false, http: false, path: false, os: false,
        stream: false, zlib: false, crypto: false, 'image-size': false,
      };
    }
    return config;
  },
};
export default nextConfig;
