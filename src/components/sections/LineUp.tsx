import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageData } from '../../types';

export const LineUp = ({ data }: { data: PageData['lineup'] }) => {
    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('lineup-slider');
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="lineup" className="py-24 bg-dark/20 backdrop-blur-sm overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-left">
                        <span className="text-gold tracking-[0.5em] text-[10px] font-archivo font-black uppercase mb-4 block">{data.subtitle}</span>
                        <h2 className="text-4xl md:text-6xl font-archivo font-black tracking-tighter uppercase italic">{data.title}</h2>
                    </div>
                </div>

                <div
                    id="lineup-slider"
                    className="flex space-x-6 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {data.artists.map((artist, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[85vw] md:min-w-[400px] snap-center group relative aspect-square overflow-hidden rounded-2xl"
                        >
                            <img src={artist.img || undefined} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="text-gold text-[9px] tracking-widest font-archivo font-black mb-1 uppercase">{artist.time}</div>
                                <h3 className="text-2xl font-archivo font-black tracking-tighter mb-1 italic uppercase">{artist.name}</h3>
                                <div className="text-white/60 text-[10px] tracking-widest uppercase">{artist.genre}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={() => scroll('left')}
                        className="p-4 border border-white/10 rounded-full hover:bg-gold hover:text-dark transition-all duration-500 bg-white/5 backdrop-blur-sm shadow-xl"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-4 border border-white/10 rounded-full hover:bg-gold hover:text-dark transition-all duration-500 bg-white/5 backdrop-blur-sm shadow-xl"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};
