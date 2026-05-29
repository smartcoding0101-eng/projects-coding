import React, { Suspense, lazy } from 'react';
import HeroBlock from './Blocks/HeroBlock'; // Keep Hero static for LCP priorities

const StatsBlock = lazy(() => import('./Blocks/StatsBlock'));
const GalleryBlock = lazy(() => import('./Blocks/GalleryBlock'));
const VideoBlock = lazy(() => import('./Blocks/VideoBlock'));
const ServicesBlock = lazy(() => import('./Blocks/ServicesBlock'));
const IdentityBlock = lazy(() => import('./Blocks/IdentityBlock'));
const FAQBlock = lazy(() => import('./Blocks/FAQBlock'));
const TestimonialsBlock = lazy(() => import('./Blocks/TestimonialsBlock'));
const ProductCardsBlock = lazy(() => import('./Blocks/ProductCardsBlock'));
const CreditSimulatorBlock = lazy(() => import('./Blocks/CreditSimulatorBlock'));
const BenefitsBlock = lazy(() => import('./Blocks/BenefitsBlock'));
const NormativasBlock = lazy(() => import('./Blocks/NormativasBlock'));
const InstitutionalTextBlock = lazy(() => import('./Blocks/InstitutionalTextBlock'));
const LatestNewsBlock = lazy(() => import('./Blocks/LatestNewsBlock'));

const BlockRenderer = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <Suspense fallback={
            <div className="w-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            {blocks.map((block, index) => {
                const { type, data } = block;

                switch (type) {
                    case 'hero':
                        return <HeroBlock key={index} data={data} />;
                    case 'identity':
                        return <IdentityBlock key={index} data={data} />;
                    case 'product_cards':
                        return <ProductCardsBlock key={index} data={data} />;
                    case 'credit_simulator':
                    case 'benefits':
                        // Render simulator + benefits side by side if they appear consecutively
                        return <SideBySideWrapper key={index} type={type} data={data} blocks={blocks} index={index} />;
                    case 'stats':
                        return <StatsBlock key={index} data={data} />;
                    case 'gallery':
                        return <GalleryBlock key={index} data={data} />;
                    case 'video':
                        return <VideoBlock key={index} data={data} />;
                    case 'services':
                        return <ServicesBlock key={index} data={data} />;
                    case 'faq':
                        return <FAQBlock key={index} data={data} />;
                    case 'testimonials':
                        return <TestimonialsBlock key={index} data={data} />;
                    case 'normativas':
                        return <NormativasBlock key={index} data={data} />;
                    case 'institutional_text':
                        return <InstitutionalTextBlock key={index} data={data} />;
                    case 'latest_news':
                        return <LatestNewsBlock key={index} data={data} />;
                    default:
                        console.warn(`Unknown block type: ${type}`);
                        return null;
                }
            })}
        </Suspense>
    );
};

// Handles credit_simulator + benefits side-by-side layout (like the static design)
const SideBySideWrapper = ({ type, data, blocks, index }) => {
    // Check if the next/previous block is the complementary type
    const nextBlock = blocks[index + 1];
    const prevBlock = blocks[index - 1];

    // If this is credit_simulator and next is benefits, render both together
    if (type === 'credit_simulator' && nextBlock?.type === 'benefits') {
        return (
            <section className="py-12 bg-white border-y border-gray-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container/30 -skew-x-12 transform translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <CreditSimulatorBlock data={data} />
                        <div className="lg:border-l lg:border-gray-100 lg:pl-16">
                            <BenefitsBlock data={nextBlock.data} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // If this is benefits and previous is credit_simulator, skip (already rendered above)
    if (type === 'benefits' && prevBlock?.type === 'credit_simulator') {
        return null;
    }

    // Standalone rendering
    if (type === 'credit_simulator') {
        return (
            <section className="py-12 bg-white border-y border-gray-100/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CreditSimulatorBlock data={data} />
                </div>
            </section>
        );
    }

    if (type === 'benefits') {
        return (
            <section className="py-12 bg-white border-y border-gray-100/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BenefitsBlock data={data} />
                </div>
            </section>
        );
    }

    return null;
};

export default BlockRenderer;
