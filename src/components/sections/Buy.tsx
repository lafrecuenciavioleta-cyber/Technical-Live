import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BuySection } from '../../types';

export const Buy = ({ data }: { data: BuySection }) => {
  useEffect(() => {
    const container = document.getElementById('fv-container');
    if (!container) return;

    // Detectar y persistir promotor (soporta ?p=, ?promoter= o ruta /nombre/events/...)
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);

    let promoterParam = params.get('p') || params.get('promoter');

    // Si la ruta es /promotor/events/id, extraemos el promotor de la ruta
    if (!promoterParam && pathParts.length >= 2 && (pathParts.includes('events') || pathParts.includes('tickets'))) {
      const eventsIdx = pathParts.findIndex(p => p === 'events' || p === 'tickets');
      if (eventsIdx > 0) {
        promoterParam = pathParts[eventsIdx - 1];
      }
    }

    if (promoterParam) {
      localStorage.setItem('fv_promoter', promoterParam);
    }
    const activePromoter = localStorage.getItem('fv_promoter') || 'technical-live';

    // Limpieza agresiva de cualquier rastro previo antes de iniciar
    const cleanup = () => {
      const existingScript = document.getElementById('fv-script');
      if (existingScript) existingScript.remove();
      container.innerHTML = '<div id="fourvenues-iframe" class="w-full h-full min-h-[600px]"></div>';
      // Eliminar cualquier iframe huérfano que FourVenues haya podido inyectar fuera del contenedor
      document.querySelectorAll('iframe[src*="fourvenues"]').forEach(el => el.remove());
    };

    cleanup();

    let baseUrl = data.widgetUrl;
    // Adaptar URL al formato de promotor: /assets/iframe/{promoter}/...
    if (activePromoter !== 'technical-live') {
      baseUrl = baseUrl.replace('/technical-live/', `/${activePromoter}/`);
    }

    const finalUrl = baseUrl.includes('theme=')
      ? baseUrl
      : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}theme=dark`;

    const script = document.createElement('script');
    script.id = 'fv-script';
    script.src = finalUrl;
    script.async = true;

    container.appendChild(script);

    return cleanup;
  }, [data.widgetUrl]);

  return (
    <section className="py-24 px-4 bg-dark/20 backdrop-blur-sm relative overflow-hidden w-full max-w-[100vw]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-12 space-y-4 px-4">
          <motion.span className="text-gold tracking-[0.5em] text-[10px] font-archivo font-black uppercase">BOLETERÍA</motion.span>
          <motion.h2 className="text-3xl md:text-7xl font-archivo font-black italic text-white leading-tight uppercase">{data.title}</motion.h2>
          <motion.p className="text-white/40 text-[10px] md:text-sm tracking-[0.1em] font-archivo max-w-2xl mx-auto uppercase">{data.description}</motion.p>
        </div>

        {/* Contenedor principal donde FourVenues inyectará su widget */}
        <div id="fv-container" className="w-full min-h-[600px] relative">
          <div id="fourvenues-iframe" className="w-full h-full min-h-[600px]" />
        </div>
      </div>
    </section>
  );
};
