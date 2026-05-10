interface WindowWithEnv extends Window {
  env?: {
    APP_ENV?: string;
  };
}

const CONFIGS: Record<string, { apiUrl: string }> = {
  development: {
    apiUrl: 'http://localhost:8888',
  },
  production: {
    apiUrl: 'https://api.techx-todo.com',
  },
};

export const getApiUrl = (): string => {
  const env = (window as WindowWithEnv).env?.APP_ENV || 'development';
  const config = CONFIGS[env] || CONFIGS['development'];

  return config.apiUrl;
};
