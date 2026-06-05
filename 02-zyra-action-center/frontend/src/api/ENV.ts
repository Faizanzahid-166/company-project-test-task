// Frontend environment access (Vite)
type EnvShape = {
     backendURL: string;
     nodeURL: string;
};

const ENV: EnvShape = {
     backendURL: (import.meta.env.VITE_RENDER_BACKEND_API_URL as string) || "",
     nodeURL: (import.meta.env.VITE_NODE_BACKEND_API_URL as string) || "",
};

export default ENV;