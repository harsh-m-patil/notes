import defaultMdxComponents from "fumadocs-ui/mdx";
import { Mermaid } from "@/components/mdx/mermaid";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import * as AccordianComponents from "fumadocs-ui/components/accordion";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		Mermaid,
		...TabsComponents,
		...AccordianComponents,
		...components,
	};
}
