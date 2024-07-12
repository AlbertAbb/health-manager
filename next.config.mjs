import {withSentryConfig} from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        PROJECT_ID: "668e66460027825557a8",
        API_KEY: "85596e9f88c73c688843575e4a27a5a5dda8a3e48c567924a81900fbad9e58d4efa776db324649a1bc51920fe6a681f7928f5281873fed48ca2f08d1cad291ce5035ea73a725380ac7e033493619ec4ba7f0607ba6ea6b57c554edc761f464f80448c4876b8da31af0391a0431e36020d41034dd90a1902e4e58e42d7e2fd7d6",
        DATABASE_ID: "668e66c40012e69b2ca7",
        PATIENT_COLLECTION_ID:"668e66dc00199f70022c",
        DOCTOR_COLLECTION_ID: "668e66f500241a36ef5f",
        APPOINTMENT_COLLECTION_ID: "668e670d0008cd3c525a"
    }
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "alberto-abbate",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});