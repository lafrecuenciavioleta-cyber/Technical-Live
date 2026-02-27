import React from 'react';
import {
    MapPin,
    Instagram,
    Facebook,
    Twitter
} from 'lucide-react';
import { PageData } from '../../types';

export const Footer = ({ data, settings }: { data: PageData['footer'], settings: PageData['settings'] }) => {
    return (
        <footer className="bg-dark/60 backdrop-blur-md border-t border-white/5 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <img
                            src={settings.logoUrl || undefined}
                            alt="Tay Beach Footer Logo"
                            className="h-16 md:h-20 w-auto mb-8 brightness-0 invert opacity-80"
                            referrerPolicy="no-referrer"
                        />
                        <p className="text-white/50 font-sans font-light max-w-md leading-relaxed">
                            {data.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-gold text-[11px] tracking-[0.2em] font-archivo font-black mb-8 uppercase">Ubicación</h4>
                        <div className="flex items-start space-x-3 text-white/60 font-sans font-light text-sm">
                            <MapPin size={18} className="mt-1 shrink-0" />
                            <span>{data.location}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gold text-[11px] tracking-[0.2em] font-archivo font-black mb-8 uppercase">Síguenos</h4>
                        <div className="flex space-x-6">
                            <a href={data.social.instagram} className="text-white/40 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href={data.social.facebook} className="text-white/40 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href={data.social.twitter} className="text-white/40 hover:text-white transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/30 text-[10px] tracking-[0.2em] font-archivo font-black">
                    <p>© 2026 TAY BEACH FESTIVAL. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">POLÍTICA DE PRIVACIDAD</a>
                        <a href="#" className="hover:text-white transition-colors">TÉRMINOS Y CONDICIONES</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
