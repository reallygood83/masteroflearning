import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Article {
    feynmanTitle: string;
    feynmanSummary: string;
    publishedAt: any;
    source: string;
    tags?: string[];
}

async function getArticleForMetadata(id: string): Promise<Article | null> {
    try {
        // 클라이언트 SDK를 서버에서 사용하는 것은 권장되지 않지만,
        // 메타데이터 생성을 위해 임시로 사용
        const articleRef = doc(db, 'articles', id);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
            const data = articleSnap.data();
            return {
                feynmanTitle: data.feynmanTitle,
                feynmanSummary: data.feynmanSummary,
                publishedAt: data.publishedAt?.toDate() || new Date(),
                source: data.source,
                tags: data.tags,
            };
        }
        return null;
    } catch (error) {
        console.error('메타데이터용 기사 불러오기 오류:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const article = await getArticleForMetadata(params.id);

    if (!article) {
        return {
            title: '기사를 찾을 수 없습니다 | AI EDU NEWS',
            description: '요청하신 기사가 존재하지 않거나 삭제되었습니다.',
        };
    }

    const baseUrl = 'https://news.teaboard.link';

    return {
        title: `${article.feynmanTitle} | AI EDU NEWS`,
        description: article.feynmanSummary,
        openGraph: {
            title: article.feynmanTitle,
            description: article.feynmanSummary,
            url: `${baseUrl}/share/${params.id}`,
            type: 'article',
            publishedTime: article.publishedAt.toISOString(),
            authors: [article.source],
            tags: article.tags || [],
            images: [
                {
                    url: `${baseUrl}/api/og?id=${params.id}`,
                    width: 1200,
                    height: 630,
                    alt: article.feynmanTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.feynmanTitle,
            description: article.feynmanSummary,
            images: [`${baseUrl}/api/og?id=${params.id}`],
        },
    };
}

export default function ShareLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
