import toolsConfig from '@/config/tools.json';
import { Tool, ToolsConfig } from '@/types/tools';

export function getTools(): ToolsConfig {
    return toolsConfig as ToolsConfig;
}

export function getEnabledTools(): Array<{ key: string } & Tool> {
    const tools = getTools();
    return Object.entries(tools)
        .filter(([_, tool]) => tool.enabled)
        .map(([key, tool]) => ({ key, ...tool }));
}

export function getTool(key: string): Tool | undefined {
    const tools = getTools();
    return tools[key];
}

export function getRelatedTools(toolKey: string, limit: number = 3): Array<{ key: string } & Tool> {
    const tool = getTool(toolKey);
    if (!tool || !tool.related) {
        // Return random enabled tools if no related tools specified
        return getEnabledTools()
            .filter(t => t.key !== toolKey)
            .slice(0, limit);
    }

    const relatedTools = tool.related
        .map(key => {
            const relatedTool = getTool(key);
            return relatedTool && relatedTool.enabled ? { key, ...relatedTool } : null;
        })
        .filter((t): t is { key: string } & Tool => t !== null)
        .slice(0, limit);

    // Fill remaining slots with other enabled tools if needed
    if (relatedTools.length < limit) {
        const additionalTools = getEnabledTools()
            .filter(t => t.key !== toolKey && !tool.related?.includes(t.key))
            .slice(0, limit - relatedTools.length);
        relatedTools.push(...additionalTools);
    }

    return relatedTools;
}
