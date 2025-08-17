/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // 👈 agrega esta línea para generar HTML estático
};

module.exports = nextConfig;