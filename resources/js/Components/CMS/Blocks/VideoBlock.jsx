import React, { useState, useRef } from 'react';

const VideoBlock = ({ data }) => {
    const { title, subtitle, main_title, main_subtitle, main_url, main_thumbnail, gallery } = data;
    const [activeVideo, setActiveVideo] = useState(null);
    const videoRef = useRef(null);

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/storage/${img}`;
    };

    const playVideo = (video) => {
        setActiveVideo(video);
        setTimeout(() => {
            if (videoRef.current) {
                if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
                else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
                videoRef.current.play();
            }
        }, 100);
    };

    const closeVideo = () => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        setActiveVideo(null);
    };

    const mainVideo = {
        title: main_title || 'Spot Institucional',
        sub: main_subtitle || 'Video Principal',
        url: main_url || '',
        img: getImageUrl(main_thumbnail) || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    };

    const galleryVideos = (gallery || []).map(v => ({
        title: v.title,
        sub: v.subtitle || '',
        url: v.url,
        img: getImageUrl(v.thumbnail) || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80'
    }));

    return (
        <section className="py-12 bg-surface-container overflow-hidden relative" id="videos">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-6 relative z-10">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">{subtitle || 'Conoce Nuestra Historia'}</h2>
                        <h3 className="font-display text-4xl font-bold text-on-surface">{title}</h3>
                    </div>
                    <button className="hidden md:flex items-center gap-2 border border-gray-300 px-6 py-2.5 rounded-full hover:border-primary hover:text-primary transition-colors font-bold text-gray-500">
                        Ver más videos <span className="text-xl">&rarr;</span>
                    </button>
                </div>

                {/* Main Video */}
                {mainVideo.url && (
                    <div
                        onClick={() => playVideo(mainVideo)}
                        className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl group border border-gray-200/50 transform hover:-translate-y-2 transition-transform duration-700 relative z-10 cursor-pointer"
                    >
                        <img src={mainVideo.img} alt={mainVideo.title} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all border border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white ml-2 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 hidden sm:block">
                            <span className="text-primary text-xs font-bold tracking-widest uppercase block mb-1">{mainVideo.sub}</span>
                            <span className="text-on-surface font-display font-bold text-xl">{mainVideo.title}</span>
                        </div>
                    </div>
                )}

                {/* Gallery Videos */}
                {galleryVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 relative z-10 w-full">
                        {galleryVideos.map((video, idx) => (
                            <div
                                key={idx}
                                onClick={() => playVideo(video)}
                                className="relative rounded-3xl overflow-hidden aspect-video shadow-md hover:shadow-xl group border border-gray-100 transform hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                            >
                                <img src={video.img} alt={video.title} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all border border-white/50">
                                        <svg className="w-5 h-5 text-white ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <span className="text-secondary tracking-widest uppercase block mb-1 font-bold text-[9px]">{video.sub}</span>
                                    <span className="text-white font-display font-medium text-xs md:text-sm block leading-tight">{video.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Video Player Modal */}
                {activeVideo && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10">
                        <button onClick={closeVideo} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md transition-all z-[110]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(102,153,51,0.3)] bg-black">
                            <video ref={videoRef} src={activeVideo.url} controls className="w-full h-full" onEnded={closeVideo} autoPlay>
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VideoBlock;
