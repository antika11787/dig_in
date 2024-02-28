const nextConfig = {
  images: {
    domains: [
      "dig-g4wbaf9d9-antika-noors-projects.vercel.app",
      "dig-in-backend-nodejs.onrender.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dig-in-backend-nodejs.onrender.com",
        port: "",
        pathname: "/",
      },
    ],
  },
};

export default nextConfig;
