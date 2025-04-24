'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  threshold?: number
  blurHash?: string
}

/**
 * 優化的懶加載圖片組件
 * 只有當圖片進入視窗時才載入
 * 支援模糊預覽效果
 */
export function LazyImage({
  src,
  alt,
  className,
  threshold = 0.1,
  blurHash,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // 使用 IntersectionObserver 判斷元素是否進入視窗
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // 元素進入視窗後移除觀察者
          observer.disconnect()
        }
      },
      {
        threshold: threshold,
        rootMargin: '200px', // 預先載入視窗外 200px 的圖片
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  // 驗證 blurHash 是否為有效的 base64 字符串
  const isValidBlurHash = (hash: string | undefined): boolean => {
    if (!hash) return false
    try {
      const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
      return base64Regex.test(hash)
    } catch {
      return false
    }
  }

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundColor: '#f8f8f8',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(blurHash && !isLoaded && isValidBlurHash(blurHash) ? { 
          backgroundImage: `url(data:image/svg+xml;base64,${blurHash})` 
        } : {})
      }}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoadingComplete={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  )
} 