import defaultMdxComponents from "fumadocs-ui/mdx";
import { Mermaid } from "@/components/mdx/mermaid";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import * as AccordianComponents from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import type { MDXComponents } from "mdx/types";
import { IBM_Plex_Mono } from "next/font/google";

const mono = IBM_Plex_Mono({
  weight: ["300", "400", "500", "600", "700"]
})

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		Mermaid,
		...TabsComponents,
		...AccordianComponents,
        // HTML `ref` attribute conflicts with `forwardRef`
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props} className={mono.className}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
		...components,
	};
}
