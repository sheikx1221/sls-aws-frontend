import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/bootstrap.scss";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: (import.meta.env as any).COGNITO_AUTHORITY,
  client_id: (import.meta.env as any).COGNITO_CLIENT_ID,
  redirect_uri: (import.meta.env as any).COGNITO_REDIRECT_URL,
  response_type: (import.meta.env as any).COGNITO_RESPONSE_TYPE,
  scope: "phone openid email",
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <App />
        </AuthProvider>
    </StrictMode>
);
