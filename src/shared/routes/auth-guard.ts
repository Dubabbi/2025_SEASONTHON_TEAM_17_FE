import { authApi } from '@apis/auth/auth';
import { type LoaderFunctionArgs, redirect } from 'react-router-dom';

const PUBLIC_PREFIXES = ['/login', '/onboarding'];

export async function entryAuthGuard({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  try {
    await authApi.verify();
    return null;
  } catch {
    throw redirect('/onboarding');
  }
}
