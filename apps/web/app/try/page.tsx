import { siteUrl } from "@codeloom/config";
import { TryYourselfLanding } from "@codeloom/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try it yourself",
  description:
    "Run CodeLoom locally against your own repo and let it open a pull request — clone the engine, install, add an OpenRouter key, point it at your project, and settle to a PR.",
  openGraph: {
    title: "CodeLoom · Try it yourself",
    description: "From clone to a pull request on your repo in about five minutes.",
    url: siteUrl("/try"),
  },
};

export default function TryPage() {
  return <TryYourselfLanding />;
}
