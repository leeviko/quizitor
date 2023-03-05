// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
// const { env } = require('./src/server/env');

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

module.exports = getConfig({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
  },

  eslint: { ignoreDuringBuilds: !!process.env.CI },
});
