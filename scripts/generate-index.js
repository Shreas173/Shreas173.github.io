const fs = require('fs');
const path = require('path');

function generateIndex() {
    const notesDir = path.join(__dirname, '../notes');
    const outputFile = path.join(__dirname, '../pdf-list.json');

    // Create notes directory if doesn't exist
    if (!fs.existsSync(notesDir)) {
        fs.mkdirSync(notesDir, { recursive: true });
    }

    // Get all PDF files
    const files = fs.readdirSync(notesDir)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(file => {
            const stats = fs.statSync(path.join(notesDir, file));
            return {
                name: file,
                size: formatBytes(stats.size),
                date: stats.mtime.toLocaleDateString()
            };
        });

    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
    console.log(`Generated index with ${files.length} PDFs`);
}

function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Run immediately
generateIndex();

// Watch for changes during development
if (process.argv.includes('--watch')) {
    fs.watch(path.join(__dirname, '../notes'), (eventType, filename) => {
        if (filename && filename.toLowerCase().endsWith('.pdf')) {
            console.log(`Detected change in ${filename}, regenerating...`);
            generateIndex();
        }
    });
    console.log('Watching for PDF changes...');
}