import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BuySection } from '../../types';

export const Buy = ({ data }: { data: BuySection }) => {
  if (!data || !data.widgetUrl) {
    console.warn('Buy section data or widgetUrl is missing');
    return null;
  }
  const [iframeHeight, setIframeHeight] = useState(800);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'fv-height') {
        const h = event.data.height;
        if (h > 0 && Math.abs(h - iframeHeight) > 20) {
          setIframeHeight(h);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Inyectar el contenido en el iframe para mantener el mismo origen (permite cookies/storage)
    if (iframeRef.current) {
      let finalUrl = data.widgetUrl.includes('theme=')
        ? data.widgetUrl
        : `${data.widgetUrl}${data.widgetUrl.includes('?') ? '&' : '?'}theme=dark`;
      
      // Intentar forzar target=_blank en la propia configuración del widget
      finalUrl = finalUrl.replace('target=_top', 'target=_blank');
      if (!finalUrl.includes('target=')) {
        finalUrl += `&target=_blank`;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
            <base target="_blank">
            <style>
              body { margin: 0; padding: 0; background: transparent; overflow-x: hidden; width: 100vw; }
              #fourvenues-embed, .fourvenues-iframe { width: 100% !important; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <script src="${finalUrl}"></script>
            <script>
              // Forzar que cualquier intento de navegación por JS sea en ventana nueva
              const originalLocation = window.location.assign;
              window.open = function(url) {
                window.parent.open(url, '_blank');
                return null;
              };
              
              function reportHeight() {
                const height = document.documentElement.offsetHeight || document.body.scrollHeight;
                window.parent.postMessage({ type: 'fv-height', height: height }, '*');
              }
              window.addEventListener('load', reportHeight);
              window.addEventListener('resize', reportHeight);
              const observer = new MutationObserver(reportHeight);
              observer.observe(document.body, { childList: true, subtree: true, attributes: true });
              setInterval(reportHeight, 1000);
            </script>
          </body>
        </html>
      `;

      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [data.widgetUrl]); // Re-inyectar si cambia la URL

  return (
    <section className="py-24 px-4 bg-dark/20 backdrop-blur-sm relative overflow-hidden w-full max-w-[100vw]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-12 space-y-4 px-4">
          <motion.span className="text-gold tracking-[0.5em] text-[10px] font-archivo font-black uppercase">SISTEMA DE VENTAS</motion.span>
          <motion.h2 className="text-3xl md:text-7xl font-archivo font-black italic text-white leading-tight uppercase">{data.title}</motion.h2>
          <motion.p className="text-white/40 text-[10px] md:text-sm tracking-[0.1em] font-archivo max-w-2xl mx-auto uppercase">{data.description}</motion.p>
        </div>
        <motion.div className="w-full relative overflow-hidden bg-transparent" style={{ minHeight: '600px' }}>
          <iframe
            ref={iframeRef}
            className="w-full border-0 overflow-hidden transition-all duration-300 pointer-events-auto"
            style={{ height: `${iframeHeight}px`, width: '100%' }}
            title="FourVenues"
            allow="payment; storage-access; attribution-reporting"
            scrolling="no"
          />
        </motion.div>
      </div>
    </section>
  );
};
