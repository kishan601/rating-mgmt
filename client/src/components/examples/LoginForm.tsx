import LoginForm from '../LoginForm'

export default function LoginFormExample() {
  return (
    <LoginForm
      onSubmit={(data) => console.log('Login submitted:', data)}
      onSignupClick={() => console.log('Signup clicked')}
    />
  )
}
