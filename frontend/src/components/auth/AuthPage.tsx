import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export default function AuthPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'consumer';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const roleName = role.charAt(0).toUpperCase() + role.slice(1);

    const ensureProfile = async (user: any) => {
        // Create profile if logged in immediately
        await (supabase.from('users') as any).insert({
            id: user.id,
            email: user.email,
            full_name: `${roleName} User`,
            role: role
        });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            if (mode === 'login') {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Verify role
                if (data.user) {
                    const { data: userProfile, error: profileError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    if (profileError) {
                        console.error('Profile fetch error:', profileError);
                        throw new Error('Failed to verify user profile.');
                    }

                    // Type cast to any to avoid inference issues with generated types
                    const profile = userProfile as any;
                    if (profile && profile.role !== role) {
                        await supabase.auth.signOut();
                        throw new Error(`Account is registered as ${profile.role}, not ${role}. Please log in from the ${profile.role} portal.`);
                    }
                }

                navigate(`/${role}`);
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: `${roleName} User`,
                            role: role
                        }
                    }
                });
                if (error) throw error;

                // Always try to create profile and navigate
                // With email confirmation disabled, data.session will exist
                // With email confirmation enabled, the trigger will handle profile creation
                if (data.user) {
                    await ensureProfile(data.user);
                }

                if (data.session) {
                    navigate(`/${role}`);
                } else {
                    // Only show this if email confirmation is still required
                    setSuccessMsg('Sign up successful! Please check your email for confirmation.');
                }
            }
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Success!</h3>
                    <p className="text-stone-600 mb-6">{successMsg}</p>
                    <Button onClick={() => setSuccessMsg(null)} variant="outline">Back to Login</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-stone-800">
                        {mode === 'login' ? `Login as ${roleName}` : `Create ${roleName} Account`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                        </Button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                            >
                                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
