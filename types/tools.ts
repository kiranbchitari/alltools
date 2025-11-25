export interface Tool {
    enabled: boolean;
    title: string;
    description: string;
    path: string;
    icon?: string;
    keywords?: string[];
    example?: string;
    related?: string[];
}

export type ToolsConfig = Record<string, Tool>;
