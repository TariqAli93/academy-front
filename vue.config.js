const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "com.codel.academy",
        productName: "برنامج المعاهد",

        win: {
          target: 'nsis',
          icon: './public/icon.ico',
        },
        nsis: {
          oneClick: false,
          artifactName: "academy.exe",
          allowElevation: true,
          deleteAppDataOnUninstall: true,
          runAfterFinish: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./public/icons/icon.ico",
          uninstallerIcon: "./public/icons/edit_delete.ico",
          installerHeaderIcon: "./public/icons/icon.ico",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "برنامج المعاهد",
          perMachine: true,
        },
      }
    }
  }
}
