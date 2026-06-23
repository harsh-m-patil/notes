import * as AccordianComponents from "fumadocs-ui/components/accordion";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  LongPollingTimeline,
  MuxTransportLab,
  PubSubFlowLab,
  PushPatternExplorer,
  RequestResponseDiagram,
  RequestResponseInspector,
  ShortPollingDiagram,
  SSEStreamBuilder,
  ShortPollingCalculator,
  SidecarFlowLab,
  StatefulSessionLab,
  SyncAsyncLab,
} from "@/components/mdx/interactive-diagrams";
import { Mermaid } from "@/components/mdx/mermaid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    RequestResponseDiagram,
    RequestResponseInspector,
    ShortPollingDiagram,
    ShortPollingCalculator,
    LongPollingTimeline,
    SSEStreamBuilder,
    PushPatternExplorer,
    PubSubFlowLab,
    MuxTransportLab,
    StatefulSessionLab,
    SyncAsyncLab,
    SidecarFlowLab,
    ...TabsComponents,
    ...AccordianComponents,
    ...components,
  };
}
