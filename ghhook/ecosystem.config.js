module.exports = {
  apps: [
    {
      name: "github-webhook",
      script: "./index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
