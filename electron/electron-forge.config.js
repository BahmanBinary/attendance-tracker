module.exports = {
  packagerConfig: {
    icon: "assets/images/icons/logo",
    arch: ["ia32", "x64", "arm64"],
    osxSign: {
      optionsForFile: (filePath) => {
        // Here, we keep it simple and return a single entitlements.plist file.
        // You can use this callback to map different sets of entitlements
        // to specific files in your packaged app.
        return {
          entitlements: "entitlements.plist",
        };
      },
    },
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "kara_app",
        setupIcon: "assets/images/icons/logo.ico",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "assets/images/icons/logo.icns",
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "assets/images/icons/logo.png",
        },
      },
    },
  ],
};
