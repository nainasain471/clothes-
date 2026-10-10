import { useState } from 'react'

function ProductImage({ src, alt = '', className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)

  // Image nahi mili ya load nahi hui to grey box dikhega (error nahi aayega)
  if (!src || failedSrc === src) {
    return <div className={`bg-gray-100 ${className}`} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  )
}

export default ProductImage