import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://fakestoreapi.com/products?limit=5', {
    cache: 'force-cache'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export default async function Home() {
  const products = await getProducts()
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Featured Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative h-48">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h2>
              <p className="text-xl font-bold text-gray-600 mb-4">
                ${product.price}
              </p>
              <Link 
                href={`/products/${product.id}`}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
