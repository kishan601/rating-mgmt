import SignupForm from '../SignupForm'

export default function SignupFormExample() {
  return (
    <SignupForm
      onSubmit={(data) => console.log('Signup submitted:', data)}
      onLoginClick={() => console.log('Login clicked')}
    />
  )
}
