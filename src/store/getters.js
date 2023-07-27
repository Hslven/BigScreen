const getters = {
  getInfo: (state) => { return state.user.info },
  getRoutes: (state) => { return state.route.routes },
  getTagView: (state) => { return state.appProject.tagView },
  getIsTag: (state) => { return state.appProject.multiTabsSetting.show },
  getBreadcrumbs: (state) => { return state.breadcrumbs.breadcrumbs },
  getKeepAliveList: (state) => { return state.appProject.keepAliveList },
  getAppPrimaryList: (state) => { return state.appTheme.appPrimaryList },
  getAppPrimary: (state) => { return state.appTheme.appPrimary },
  getModPermission: state => state.user.modPermission,
  getModDarkTheme: (state) => { return state.appTheme.darkTheme },
  getIsScreen: (state) => { return state.appProject.isScreen.show }
}

export default getters
