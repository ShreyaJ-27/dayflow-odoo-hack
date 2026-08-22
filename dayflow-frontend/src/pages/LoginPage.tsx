import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../auth/AuthContext'

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

type LoginValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()

  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: LoginValues) => {
    try {
      const user = login(
        values.email,
        values.password,
      )

      toast.success(
        `Welcome back, ${user.fullName}`,
      )

      navigate('/employee', {
        replace: true,
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in.'

      toast.error(message)
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-(--brand)">
        Welcome back
      </p>

      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Sign in to Dayflow
      </h1>

      <p className="mt-3 text-sm text-(--muted)">
        Your workday, in one clear view.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <Input
          id="email"
          type="email"
          label="Work email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Signing in...'
            : 'Continue'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-(--muted)">
        New to Dayflow?{' '}
        <Link
          to="/signup"
          className="font-semibold text-(--brand) hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}