import { NextRequest, NextResponse } from "next/server";
import { productByHost, PRODUCTS, SPLIT_SITES, type ProductId } from "@codeloom/config";

const PATH_FOR: Record<ProductId, string> = {
  agent: "/",
  ide: "/ide",
  tui: "/tui",
  cli: "/cli",
};

export function middleware(request: NextRequest) {
  const productId = productByHost(request.headers.get("host"));
  if (!productId) return NextResponse.next();

  const canonical = PATH_FOR[productId];
  const { pathname } = request.nextUrl;

  if (pathname === "/" && canonical !== "/") {
    return NextResponse.rewrite(new URL(canonical, request.url));
  }

  if (SPLIT_SITES && pathname !== canonical && pathname !== "/") {
    const target = PRODUCTS[productByPath(pathname)];
    if (target && target.id !== productId) {
      return NextResponse.redirect(`https://${target.host}/`);
    }
  }

  return NextResponse.next();
}

function productByPath(pathname: string): ProductId {
  if (pathname.startsWith("/ide")) return "ide";
  if (pathname.startsWith("/tui")) return "tui";
  if (pathname.startsWith("/cli")) return "cli";
  return "agent";
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
