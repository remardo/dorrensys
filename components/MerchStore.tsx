import React from 'react';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

const products: Product[] = [
  { id: 1, name: 'Толстовка с логотипом', price: 500, category: 'Одежда', image: 'https://picsum.photos/400/400?random=10' },
  { id: 2, name: 'Кружка Dorren', price: 1200, category: 'Офис', image: 'https://picsum.photos/400/400?random=11' },
  { id: 3, name: 'Набор наклеек', price: 250, category: 'Сувениры', image: 'https://picsum.photos/400/400?random=12' },
  { id: 4, name: 'Ручка с гравировкой', price: 150, category: 'Офис', image: 'https://picsum.photos/400/400?random=13' },
  { id: 5, name: 'Многоразовая бутылка', price: 100, category: 'ЗОЖ', image: 'https://picsum.photos/400/400?random=14' },
  { id: 6, name: 'Бейсболка', price: 450, category: 'Одежда', image: 'https://picsum.photos/400/400?random=15' },
];

const MerchStore: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Мерч</h2>
          <p className="text-gray-500 font-light text-sm">Обменивайте Dorren Coins на фирменные вещи.</p>
        </div>
        <div className="bg-dorren-dark text-white px-6 py-3 flex items-center shadow-lg">
          <span className="text-dorren-blue font-bold text-xl mr-2">1,450</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Coins</span>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
        {['Все', 'Одежда', 'Офис', 'Сувениры', 'ЗОЖ', 'Подарки'].map((cat, idx) => (
          <button
            key={cat}
            className={`text-sm uppercase tracking-wide px-4 py-2 transition-colors ${idx === 0 ? 'bg-dorren-black text-white' : 'text-gray-500 hover:text-dorren-black'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-dorren-dark/0 group-hover:bg-dorren-dark/20 transition-colors duration-300"></div>
              <button className="absolute bottom-4 right-4 bg-white text-dorren-black p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:bg-dorren-blue hover:text-white">
                <ShoppingBag size={20} />
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-dorren-black group-hover:text-dorren-dark transition-colors">{product.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-dorren-dark font-bold">{product.price} D.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchStore;
