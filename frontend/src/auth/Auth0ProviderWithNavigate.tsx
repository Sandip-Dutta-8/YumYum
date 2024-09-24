import { AppState, Auth0Provider, useAuth0, User } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

const Auth0ProviderWithNavigate = ({ children }: Props) => {
    const { user } = useAuth0();
    const navigate = useNavigate();

    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
   // const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    if (!domain || !clientId || !redirectUri) {
        throw new Error("unable to initialise auth");
    }

    const onRedirectCallback = (appState?: AppState, user?: User) => {
        // navigate(appState?.returnTo || "/auth-callback");
        console.log(user);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithNavigate;