import { useState } from 'react'
import PasswordUpdateDialog from '../PasswordUpdateDialog'
import { Button } from '@/components/ui/button'

export default function PasswordUpdateDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Password Update</Button>
      <PasswordUpdateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Password updated:', data)
          setOpen(false)
        }}
      />
    </>
  )
}
