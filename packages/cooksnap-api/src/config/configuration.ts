const configuration = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  kamis: {
    apiKey: process.env.KAMIS_API_KEY,
    apiId: process.env.KAMIS_API_ID,
  },
  coupang: {
    accessKey: process.env.COUPANG_ACCESS_KEY,
    secretKey: process.env.COUPANG_SECRET_KEY,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
});

export default configuration;
