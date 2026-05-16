import fabric1 from '../assets/Silk.jpeg'
import fabric2 from '../assets/Ankara.jpeg'
import fabric3 from '../assets/velvet.jpeg'
import type { Product } from '../types/product'

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Royal Silk', 
    price: 25000, 
    category: 'silk', 
    tag: 'luxury', 
    img: fabric1, 
    desc: 'Luxurious silk fabric with soft elegance for premium outfits.' 
  },
  { 
    id: 2, 
    name: 'Velvet Charm', 
    price: 30000, 
    category: 'velvet', 
    tag: 'exclusive', 
    img: fabric3, 
    desc: 'Premium velvet with a timeless shine — perfect for luxury wears.' 
  },
  { 
    id: 3, 
    name: 'Ankara Gold', 
    price: 12500, 
    category: 'ankara', 
    tag: 'trending', 
    img: fabric2, 
    desc: 'Vibrant African print with bold golden accents — bright and beautiful.' 
  },
  { 
    id: 4, 
    name: 'Pure Chiffon', 
    price: 8000, 
    category: 'chiffon', 
    tag: 'budget', 
    img: fabric1, 
    desc: 'Light and flowy chiffon perfect for elegant evening wear.' 
  },
  { 
    id: 5, 
    name: 'Royal Lace', 
    price: 45000, 
    category: 'lace', 
    tag: 'exclusive', 
    img: fabric2, 
    desc: 'Premium lace fabric with intricate patterns for special occasions.' 
  },
  { 
    id: 6, 
    name: 'Ankara Classic', 
    price: 9500, 
    category: 'ankara', 
    tag: 'trending', 
    img: fabric3, 
    desc: 'Bold African prints that celebrate culture and style.' 
  },
]
