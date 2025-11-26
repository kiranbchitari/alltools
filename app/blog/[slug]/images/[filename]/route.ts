import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Props {
    params: Promise<{
        slug: string;
        filename: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Props
) {
    const { slug, filename } = await params;

    // Security check: prevent directory traversal
    if (filename.includes('..') || slug.includes('..')) {
        return new NextResponse('Invalid path', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'content/blog', slug, 'images', filename);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('Image not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
