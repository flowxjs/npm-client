export interface TPackageRouteData {
  channel: 'dependencies' | 'dependents',
  packageMetaData: {
    name: string,
    version: string,
    license: string,
    homepage: string,
    time: {[key: string]: string},
    repository: {
      type: string,
      url: string,
    },
    'dist-tags': {
      [key: string]: string,
    },
    maintainers:{ name: string, email: string }[],
    readme?: string,
    versions: {
      [key: string]: Omit<TPackageRouteData['packageMetaData'], 'versions'>
    }
  }
}

export function PackageRouteData(): TPackageRouteData {
  return {
    channel: null,
    packageMetaData: {
      name: null,
      version: null,
      license: null,
      homepage: null,
      'dist-tags': {},
      repository: {
        type: null,
        url: null
      },
      time: {},
      maintainers: [],
      versions: {}
    }
  }
}