import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BuySection } from '../../types';

export const Buy = ({ data }: { data: BuySection }) => {
  useEffect(() => {
    // Si ya existe el script, no lo volvemos a añadir
    if (document.getElementById('fv-script')) return;

    const finalUrl = data.widgetUrl.includes('theme=')
      ? data.widgetUrl
      : `${data.widgetUrl}${data.widgetUrl.includes('?') ? '&' : '?'}theme=dark`;

    // Importante: No usamos iframe para evitar bloqueos de X-Frame-Options en pasarelas como PSE
    const script = document.createElement('script');
    script.id = 'fv-script';
    script.src = finalUrl;
    script.async = true;
    
    // El script de FourVenues busca un elemento con id 'fourvenues-iframe' o lo crea con document.write
    // Al crearlo nosotros, evitamos que document.write limpie la pantalla.
    document.getElementById('fv-container')?.appendChild(script);

    return () => {
      const existingScript = document.getElementById('fv-script');
      if (existingScript) existingScript.remove();
      // Limpiamos el contenido del widget al desmontar
      const container = document.getElementById('fourvenues-iframe');
      if (container) container.innerHTML = '';
    };
  }, [data.widgetUrl]);

  return (
    <section className="py-24 px-4 bg-dark/20 backdrop-blur-sm relative overflow-hidden w-full max-w-[100vw]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-12 space-y-4 px-4">
          <motion.span className="text-gold tracking-[0.5em] text-[10px] font-archivo font-black uppercase">SISTEMA DE VENTAS</motion.span>
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
