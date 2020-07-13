export interface TPackageRouteData {
  channel: 'dependencies' | 'dependents',
}

export function PackageRouteData(): TPackageRouteData {
  return {
    channel: null
  }
}