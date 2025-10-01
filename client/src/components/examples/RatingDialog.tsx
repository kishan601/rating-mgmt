import { useState } from 'react'
import RatingDialog from '../RatingDialog'
import { Button } from '@/components/ui/button'

export default function RatingDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Rating Dialog</Button>
      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        storeName="Downtown Electronics Store"
        currentRating={3}
        onSubmit={(rating) => {
          console.log('Rating submitted:', rating)
          setOpen(false)
        }}
      />
    </>
  )
}
