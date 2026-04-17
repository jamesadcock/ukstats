import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Prose wrapper applied to all MDX pages
    wrapper: ({ children }) => (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <article className="prose prose-slate max-w-none">{children}</article>
      </div>
    ),
    a: ({ href, children, ...rest }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} {...rest}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    },
    ...components,
  };
}
