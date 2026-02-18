import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage(): JSX.Element {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { user, login, loading } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm): Promise<void> => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold">Login</h2>
        <input placeholder="Email" type="email" {...register('email', { required: true })} />
        <input placeholder="Password" type="password" {...register('password', { required: true })} />
        <button className="w-full bg-brand-600 text-white hover:bg-brand-500" disabled={loading} type="submit">
          {loading ? 'Please wait...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
