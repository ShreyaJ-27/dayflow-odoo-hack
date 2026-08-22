import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const schema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  )

type SignupValues = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: SignupValues) => {
    try {
      signup(
        values.fullName,
        values.email,
        values.password,
      )

      toast.success('Account created successfully')

      navigate('/employee')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create your account.'

      toast.error(message)
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-(--brand)">
        Start simply
      </p>

      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Create your account
      </h1>

      <p className="mt-3 text-sm text-(--muted)">
        Set up your Dayflow workspace in a few steps.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <Input
          id="name"
          label="Full name"
          placeholder="Alex Morgan"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          id="signup-email"
          type="email"
          label="Work email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="signup-password"
          type="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id="confirm-password"
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-(--muted)">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-(--brand) hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
