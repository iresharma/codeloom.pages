export const reportSummaries: Record<
  string,
  { takeaway: string; strengths: string[]; concerns: string[] }
> = {
  tracer: {
    takeaway:
      "Merge-ready auth wiring; credential docs and verification coverage need cleanup.",
    strengths: [
      "Separate credentials for UI access and agent ingest.",
      "Collector, forwarder and Kubernetes wiring completed.",
      "Required checks passed on the final tree.",
    ],
    concerns: [
      "Partial-credential behavior contradicts the docs.",
      "No positive ingest or forwarder-header test.",
      "Tester changes landed outside the reviewer’s view.",
    ],
  },
  "reach-auth-proxy": {
    takeaway:
      "The cache follows repo conventions, but comment writes leave cached items stale.",
    strengths: [
      "Small change matching existing cache helpers and TTL.",
      "Item update/delete invalidation uses the correct ID.",
    ],
    concerns: [
      "Comment writes miss item-cache invalidation for up to 24 hours.",
      "Verification relied on builds rather than behavior tests.",
      "Unreported dependency-file churn shipped.",
    ],
  },
  "codeloom-engine": {
    takeaway:
      "Retry handling improved; blocking I/O and incomplete build verification prevent approval.",
    strengths: [
      "Retries preserve real responses and avoid unsafe methods.",
      "Exception handling checked against actual urllib behavior.",
    ],
    concerns: [
      "Synchronous retries can block the async engine for about 61 seconds.",
      "Frozen build was only checked with --help.",
      "Timeout requirements and PR claims disagree.",
    ],
  },
};
