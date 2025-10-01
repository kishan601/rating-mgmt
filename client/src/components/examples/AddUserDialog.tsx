import { useState } from 'react'
import AddUserDialog from '../AddUserDialog'
import { Button } from '@/components/ui/button'

export default function AddUserDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Add User Dialog</Button>
      <AddUserDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('User added:', data)
          setOpen(false)
        }}
      />
    </>
  )
}
