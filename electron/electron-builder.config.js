module.exports = {
  files: [
    "**/*",
    "build{,/**/*}",
    "!**/node_modules",
    "!out{,/**/*}",
    "package.json",
    "!**/*.{iml,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,suo,xproj,cc,d.ts,pdb}",
    "!**/._*",
    "!**/electron-builder.{yaml,yml,json,json5,toml}",
    "!**/{.git,.hg,.svn,CVS,RCS,SCCS,__pycache__,.DS_Store,thumbs.db,.gitignore,.gitkeep,.gitattributes,.npmignore,.idea,.vs,.flowconfig,.jshintrc,.eslintrc,.circleci,.yarn-integrity,.yarn-metadata.json,yarn-error.log,yarn.lock,package-lock.json,npm-debug.log,appveyor.yml,.travis.yml,circle.yml,.nyc_output}",
    "!.yarn{,/**/*}",
    "!.editorconfig",
    "!.yarnrc.yml",
  ],
  directories: {
    output: "out",
  },
  win: {
    icon: "assets/images/icons/logo.ico",
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    runAfterFinish: false,
    createDesktopShortcut: false,
    include: "kit/uninstaller.nsh",
  },
};
