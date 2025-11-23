const { crawlAllNews } = require('../lib/crawlers/index.ts');

async function main() {
    console.log('🚀 Starting news crawl...');
    try {
        const result = await crawlAllNews();
        console.log('✅ Crawl completed:', result);
    } catch (error) {
        console.error('❌ Crawl failed:', error);
    }
}

main();
