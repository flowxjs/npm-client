import React, { useCallback } from 'react';
import { inject } from 'inversify';
import { Controller, Route, Context } from "@typeclient/core";
import { TPackageRouteData } from "./package.interface";
import { useContextComponent, useContextState } from "@typeclient/react";
import { PackageComponents } from './package.components';

@Controller()
export class PackageController {
  @inject(PackageComponents) private readonly PackageComponents: PackageComponents;

  @Route('/:pathname')
  @Route('/:scope/:pathname')
  @Route('/:pathname/v/:version')
  @Route('/:scope/:pathname/v/:version')
  ViewPackageInformationPage(ctx: Context<TPackageRouteData>) {
    const { status } = useContextState(() => {
      return {
        status: ctx.status.value
      }
    })
    const XCmp = useContextComponent(ctx.app, this.PackageComponents, 'test');
    const go = useCallback(() => ctx.redirect('/react'), [ctx]);
    return <div onClick={go}>{status} - {ctx.params.scope}/{ctx.params.pathname}{ctx.params.version ? '@' + ctx.params.version : null}<XCmp /></div>;
  }
}