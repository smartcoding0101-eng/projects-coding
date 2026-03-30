export default function FloatingWhatsApp() {
    return (
        <a 
            href="https://wa.link/8yl8ow" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center cursor-pointer border-4 border-white"
            aria-label="Atención al Socio Fapclas"
        >
            {/* Ping animation dot for attention */}
            <span className="absolute top-0 right-0 flex auto h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
            </span>

            {/* Smart Tooltip Notification Style */}
            <span className="absolute right-full mr-5 bg-white border border-gray-100 text-gray-800 text-xs font-bold py-3 px-5 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap flex items-center gap-2 before:absolute before:-right-2 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-r before:border-t before:border-gray-100">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Oficial de Negocios (En línea)
            </span>
            
            {/* SVG WSP Icon */}
            <svg className="w-8 h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.981-.342-1.713-.65-2.816-2.39-2.903-2.505-.087-.116-.694-.925-.694-1.765s.437-1.258.59-1.423c.153-.166.332-.208.442-.208s.221-.005.317-.005c.087 0 .208-.032.325.249.122.29.418 1.02.456 1.097.038.077.063.166.012.265-.05.099-.076.158-.152.247s-.152.188-.218.261c-.073.081-.151.17-.064.321.087.151.388.642.836 1.043.578.517 1.055.679 1.206.756.151.076.241.063.33-.038s.344-.403.438-.541c.094-.138.188-.115.326-.065.138.05 .876.413 1.027.489.151.076.251.114.288.177.037.062.037.359-.107.764z"/></svg>
        </a>
    )
}
