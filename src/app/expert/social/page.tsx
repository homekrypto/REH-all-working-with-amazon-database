import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import SocialMediaManager from '@/components/marketing/social-media-manager';

async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function SocialMediaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // Check if user is an expert
  const userProfile = await getUserProfile((session.user as any).id);
  
  if (!userProfile || userProfile.role !== 'EXPERT') {
    redirect('/dashboard');
  }

  return <SocialMediaManager user={userProfile} />;
}
