'use client'
import { useState, useEffect,use } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product{
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

interface ProductDetailProps{
    params: Promise<{
        slug: string
    }>
}


async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }
  return res.json()
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [favorites, setFavorites] = useState<number[]>([])
  const resolvedParams = use(params)

  useEffect(() => {
    // Load favorites from memory
    const savedFavorites = JSON.parse(window.localStorage?.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProduct(resolvedParams.slug)
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.slug])

  const toggleFavorite = (): void => {
    const productId = parseInt(resolvedParams.slug)
    let newFavorites: number[]
    
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId)
    } else {
      newFavorites = [...favorites, productId]
    }
    
    setFavorites(newFavorites)
 
    try {
      window.localStorage?.setItem('favorites', JSON.stringify(newFavorites))
    } catch (e) {

      console.log('LocalStorage not available')
    }
  }

  const isFavorite: boolean = favorites.includes(parseInt(resolvedParams.slug))

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link href="/" className="text-white hover:text-gray-300">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/" className="text-white hover:text-gray-300 mb-6 inline-block">
        ← Back to Products
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 p-8">
            <div className="relative h-96">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <button
                onClick={toggleFavorite}
                className={`ml-4 p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <span className="bg-blue-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {product.category}
              </span>
            </div>
            
            <p className="text-4xl font-bold text-gray-600 mb-6">
              ${product.price}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>
            
            <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-semibold">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}