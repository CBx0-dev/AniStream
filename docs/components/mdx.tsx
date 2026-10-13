import defaultMdxComponents from 'fumadocs-ui/mdx';
import {Tab, Tabs} from 'fumadocs-ui/components/tabs';
import {Step, Steps} from 'fumadocs-ui/components/steps';
import {Accordion, Accordions} from 'fumadocs-ui/components/accordion';
import {Callout} from 'fumadocs-ui/components/callout';
import {Card, Cards} from 'fumadocs-ui/components/card';
import {icons} from "@/components/icons";
import {Mermaid} from "@/components/Mermaid";
import {ComparisonTable} from "@/components/ComparisonTable";
import type {MDXComponents} from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        Tab,
        Tabs,
        Step,
        Steps,
        Accordion,
        Accordions,
        Callout,
        Card,
        Cards,
        ...icons,
        Mermaid,
        ComparisonTable,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
