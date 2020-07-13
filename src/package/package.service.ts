import { injectable } from 'inversify';
import { TPackageRouteData } from './package.interface';
import { useCallback } from 'react';

@injectable()
export class PackageService {
  navClick(state: TPackageRouteData, name: TPackageRouteData['channel']) {
    return useCallback(() => {
      if (state.channel === name) return state.channel = null;
      state.channel = name;
    }, [state, name]);
  }
}