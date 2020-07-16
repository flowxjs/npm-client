import './package.style.less';
import React from 'react';
import classnames from 'classnames';
import { inject } from 'inversify';
import { Controller, Route, Context, State, useMiddleware } from "@typeclient/core";
import { TPackageRouteData, PackageRouteData } from "./package.interface";
import { useContextComponent, useContextState } from "@typeclient/react";
import { PackageComponents } from './package.components';
import { Flex } from '../components';
import { PackageFetchMiddleware } from './middlewares/package.fetch';

@Controller()
export class PackageController {
  @inject(PackageComponents) private readonly PackageComponents: PackageComponents;

  @Route('/:pathname')
  @Route('/@:scope/:pathname')
  @Route('/:pathname/v/:version')
  @Route('/@:scope/:pathname/v/:version')
  @State(PackageRouteData)
  @useMiddleware(PackageFetchMiddleware)
  ViewPackageInformationPage(ctx: Context<TPackageRouteData>) {
    const { channel } = useContextState(() => {
      return {
        channel: ctx.state.channel,
      }
    })
    const Nav = useContextComponent(this.PackageComponents, 'nav');
    const Content = useContextComponent(this.PackageComponents, 'content');
    return <Flex className="package-page" blocked fulled>
      <Flex className="sidebar" fulled direction="column"><Nav /></Flex>
      <Flex className={classnames('transform', { active: !!channel })} fulled></Flex>
      <Flex className="container" fulled span={1} direction="row"><Content /></Flex>
    </Flex>;
  }
}