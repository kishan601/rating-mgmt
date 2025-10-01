import { useState } from 'react'
import StarRating from '../StarRating'

export default function StarRatingExample() {
  const [rating, setRating] = useState(3)
  
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Interactive Rating</p>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Read-only Rating</p>
        <StarRating rating={4} readonly />
      </div>
    </div>
  )
}
