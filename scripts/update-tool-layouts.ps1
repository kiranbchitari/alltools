$toolKeys = @(
    "base64-encoder",
    "csv-json-converter",
    "diff-checker",
    "image-base64",
    "image-compressor",
    "image-resizer",
    "image-to-pdf",
    "markdown-preview",
    "meta-tag-generator",
    "qr-code-generator",
    "slug-generator",
    "timestamp-converter",
    "url-encoder",
    "word-tools"
)

$template = @"
import { generateToolMetadata } from '@/lib/metadata';

export const metadata = generateToolMetadata('TOOL_KEY');

export { default } from './page';
"@

foreach ($toolKey in $toolKeys) {
    $filePath = "d:\FormatMint\alltools\app\tools\$toolKey\layout.tsx"
    $content = $template -replace 'TOOL_KEY', $toolKey
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Updated $toolKey layout"
}

Write-Host "`nAll tool layouts updated successfully!"
