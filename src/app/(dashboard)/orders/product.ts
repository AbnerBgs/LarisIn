// data hardcore ntar kalo dah ada db hapus aja
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Kaos Polos Hitam",
    price: 150000,
    image: "https://picsum.photos/200/300",
    description:
      "Kaos polos premium 100% katun combed 30s. Nyaman dipakai sehari-hari.",
    category: "Pakaian Pria",
    stock: 25,
  },
  {
    id: 2,
    name: "Jaket Denim Biru",
    price: 350000,
    image: "https://picsum.photos/200/300",
    description:
      "Jaket denim klasik dengan bahan tebal dan nyaman. Cocok untuk gaya kasual.",
    category: "Jaket",
    stock: 10,
  },
  {
    id: 3,
    name: "Sepatu Sneakers Putih",
    price: 450000,
    image: "https://picsum.photos/200/300",
    description:
      "Sneakers putih minimalis dengan sol empuk. Bahan premium tahan lama.",
    category: "Sepatu",
    stock: 8,
  },
];
