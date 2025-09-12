// Teaser package for BeeWise-AI
export const teaser = {
  version: "1.0.0",
  message: "Welcome to BeeWise-AI Teaser Package!",

  greet: function () {
    return "Hello from the local teaser package!";
  },

  getInfo: function () {
    return {
      name: "teaser",
      version: this.version,
      description: "Local teaser package for BeeWise-AI platform"
    };
  }
};

export default teaser;