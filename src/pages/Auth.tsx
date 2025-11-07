import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/common/loader";

export function Auth() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        if (auth.isLoading) return;
        if (auth.error) {
            setError(String(auth.error));
            return;
        }
        if (auth.isAuthenticated && auth.user) {
            navigate('/order', { state: { user: auth.user, profile: (auth.user as any).profile } });
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.error, navigate]);

    const signIn = async () => {
        setError(null);
        try {
            await auth.signinRedirect();
        } catch (e: any) {
            setError(e?.message ?? String(e));
        }
    };

    const retry = () => signIn();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title mb-2">Sign in</h3>
                            <p className="text-muted mb-4">Authenticate using AWS Cognito to continue to checkout and orders.</p>

                            {auth.isLoading && (
                                <div className="d-flex align-items-center gap-3">
                                    <Loader />
                                    <div>
                                        <div className="fw-semibold">Signing in…</div>
                                        <div className="small text-muted">You will be redirected after authentication.</div>
                                    </div>
                                </div>
                            )}

                            {!auth.isLoading && auth.isAuthenticated && auth.user && (
                                <div className="alert alert-success">Signed in. Redirecting…</div>
                            )}

                            {!auth.isLoading && !auth.isAuthenticated && (
                                <>
                                    {error && (
                                        <div className="alert alert-danger">
                                            <div className="fw-semibold">Authentication error</div>
                                            <div className="small">{error}</div>
                                        </div>
                                    )}

                                    <div className="d-grid gap-2 mb-3">
                                        <button className="btn btn-primary" onClick={signIn}>
                                            Sign in with AWS Cognito
                                        </button>
                                        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancel</button>
                                    </div>

                                    {error && (
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-primary" onClick={retry}>Try again</button>
                                            <button className="btn btn-sm btn-link" onClick={() => navigate('/')}>Go home</button>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="mt-3 text-muted small">
                                Status: {auth.isLoading ? 'loading' : auth.isAuthenticated ? 'authenticated' : 'signed out'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}