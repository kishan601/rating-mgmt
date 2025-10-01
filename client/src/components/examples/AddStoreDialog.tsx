import { useState } from 'react'
import AddStoreDialog from '../AddStoreDialog'
import { Button } from '@/components/ui/button'

export default function AddStoreDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Add Store Dialog</Button>
      <AddStoreDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Store added:', data)
          setOpen(false)
        }}
      />
    </>
  )
}
