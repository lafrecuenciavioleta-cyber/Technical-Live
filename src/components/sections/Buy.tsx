import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BuySection } from '../../types';

export const Buy = ({ data }: { data: BuySection }) => {
  const [iframeHeight, setIframeHeight] = useState(800);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'fv-height') {
        const h = event.data.height;
        // Ajustamos la altura si la diferencia es notable para evitar saltos
        if (h > 0 && Math.abs(h - iframeHeight) > 20) {
          setIframeHeight(h);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeHeight]);

  const iframeSrc = useMemo(() => {
    const finalUrl = data.widgetUrl.includes('theme=')
      ? data.widgetUrl
      : `${data.widgetUrl}${data.widgetUrl.includes('?') ? '&' : '?'}theme=dark`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background: transparent; 
              overflow-x: hidden; 
              width: 100vw;
              max-width: 100vw;
            }
            #fourvenues-embed, .fourvenues-iframe { 
              width: 100% !important; 
              max-width: 100% !important;
            }
            /* Eliminamos posibles paddings que sumen altura innecesaria */
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          <script src="${finalUrl}"></script>
          <script>
            function reportHeight() {
              const height = document.documentElement.offsetHeight || document.body.scrollHeight;
              window.parent.postMessage({ type: 'fv-height', height: height }, '*');
            }
            window.addEventListener('load', reportHeight);
            window.addEventListener('resize', reportHeight);
            // Reportar cada vez que el DOM cambie
            const observer = new MutationObserver(reportHeight);
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
            setInterval(reportHeight, 1000);
          </script>
        </body>
      </html>
    `;
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  }, [data.widgetUrl]);

  return (
    <section className="py-24 px-4 bg-dark/20 backdrop-blur-sm relative overflow-hidden w-full max-w-[100vw]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-12 space-y-4 px-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.5em] text-[10px] font-archivo font-black uppercase"
          >
            SISTEMA DE VENTAS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-7xl font-archivo font-black italic text-white leading-tight uppercase"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-[10px] md:text-sm tracking-[0.1em] font-archivo max-w-2xl mx-auto uppercase"
          >
            {data.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full relative overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          <iframe
            src={iframeSrc}
            className="w-full border-0 overflow-hidden transition-all duration-300 pointer-events-auto"
            style={{ height: `${iframeHeight}px`, width: '100%' }}
            title="FourVenues"
            allow="payment"
            scrolling="no"
          />
        </motion.div>
      </div>
    </section>
  );
};
