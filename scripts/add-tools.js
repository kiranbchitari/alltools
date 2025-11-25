const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../config/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// Update image-compressor related tools
tools['image-compressor'].related = ['image-resizer', 'image-to-pdf'];

// Add image-to-pdf tool
tools['image-to-pdf'] = {
    enabled: true,
    title: 'Image to PDF Converter',
    description: 'Convert images to PDF format. Combine multiple images into a single PDF document. Client-side conversion.',
    path: '/tools/image-to-pdf',
    icon: 'pdf',
    keywords: [
        'image to pdf',
        'convert image to pdf',
        'jpg to pdf',
        'png to pdf',
        'pdf converter',
        'images to pdf'
    ],
    example: '',
    related: ['image-compressor', 'image-resizer']
};

// Add image-resizer tool
tools['image-resizer'] = {
    enabled: true,
    title: 'Image Resizer',
    description: 'Resize images to custom dimensions or percentages. Maintain aspect ratio or set custom width and height.',
    path: '/tools/image-resizer',
    icon: 'resize',
    keywords: [
        'image resizer',
        'resize image',
        'image dimensions',
        'scale image',
        'resize photo',
        'image size'
    ],
    example: '',
    related: ['image-compressor', 'image-to-pdf']
};

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2));
console.log('Successfully added 2 new tools!');
