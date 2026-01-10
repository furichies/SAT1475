import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const getMimeType = (filename: string): string => {
    const ext = path.extname(filename).toLowerCase()
    const mimeMap: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.txt': 'text/plain',
        '.zip': 'application/zip',
    }
    return mimeMap[ext] || 'application/octet-stream'
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params

        // Security: Prevent directory traversal
        if (pathSegments.some(segment => segment.includes('..') || segment.includes('/') || segment.includes('\\'))) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        // Verify file exists in either primary uploads or public fallback
        let finalPath = path.join(process.cwd(), 'uploads', ...pathSegments)
        let found = false

        try {
            await stat(finalPath)
            found = true
        } catch (e) {
            // Try fallback to public/uploads
            const publicPath = path.join(process.cwd(), 'public', 'uploads', ...pathSegments)
            try {
                await stat(publicPath)
                finalPath = publicPath
                found = true
            } catch (e2) {
                found = false
            }
        }

        if (!found) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        // Read and serve
        const fileBuffer = await readFile(finalPath)
        const mimeType = getMimeType(finalPath)

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        })

    } catch (error) {
        console.error('Error serving file:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
