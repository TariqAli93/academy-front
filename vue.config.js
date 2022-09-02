const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})

module.exports = {
  // configureWebpack: config => {
  //   config.externals = {
  //     'better-sqlite3': 'commonjs better-sqlite3'
  //   };
  // },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // externals: ['better-sqlite3'],
      builderOptions: {
        // extraResources: ['better-sqlite3'],
        publish: {
          provider: "github",
          owner: "TariqAli93",
          repo: "acountant",
          token: "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",
          releaseType: "draft",
        },
        appId: "com.codel.academy",
        productName: "حسابات المعهد",

        win: {
          target: 'nsis',
          icon: './public/icon.ico',
        },
        nsis: {
          oneClick: false,
          artifactName: "academy1.0.0.exe",
          allowElevation: true,
          deleteAppDataOnUninstall: true,
          runAfterFinish: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./public/icons/icon.ico",
          uninstallerIcon: "./public/icons/edit_delete.ico",
          installerHeaderIcon: "./public/icons/icon.ico",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "حسابات المعهد",
          perMachine: true,
        },
      }
    }
  }
}
