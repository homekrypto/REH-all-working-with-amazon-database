import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import AgentDashboard from '@/components/dashboard/agent-dashboard';

async function getUserProfile(userId: string) {
  try {
    // In production, this would be a proper API call
    // For now, we'll use a simplified approach
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

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // Check if user is an agent
  const userProfile = await getUserProfile((session.user as any).id);
  
  if (!userProfile || userProfile.role !== 'AGENT') {
    redirect('/dashboard');
  }

  return <AgentDashboard user={userProfile} />;
}
