import React from 'react';
import classnames from 'classnames';
import { injectable, inject } from 'inversify';
import { Component, useContextState, useApplicationContext, useContextComponent } from '@typeclient/react';
import { Flex } from '../components';
import { AntDesignOutlined, CloudSyncOutlined, AlignRightOutlined } from '@ant-design/icons';
import { TPackageRouteData } from './package.interface';
import { Context } from '@typeclient/core';
import { PackageService } from './package.service';
import { Col, Row, Avatar } from 'antd';

const Markdown = require('markdown-to-jsx').default;

interface TLabel {
  name: string,  
  fulled?: boolean,
  noBorder?: boolean,
}

const channels = [
  {
    key: 'dependencies',
    icon: <AntDesignOutlined />
  },
  {
    key: 'dependents',
    icon: <CloudSyncOutlined />
  }
];

@injectable()
export class PackageComponents {
  @inject(PackageService) private readonly PackageService: PackageService;

  @Component()
  nav() {
    const ctx = useApplicationContext<TPackageRouteData>();
    return <React.Fragment>
      {
        channels.map(channel => {
          return <Flex align="center" valign="middle" key={channel.key} className={classnames('detail', { 
            active: ctx.state.channel === channel.key 
          })} onClick={this.PackageService.navClick(ctx.state, channel.key as TPackageRouteData['channel'])}>
            {channel.icon}
          </Flex>
        })
      }
    </React.Fragment>
  }

  @Component()
  content() {
    const { channel } = useContextState((ctx: Context<TPackageRouteData>) => {
      return {
        channel: ctx.state.channel,
      }
    });
    const ContentInfo = useContextComponent(this, 'contentInfo');
    const ContentVersions = useContextComponent(this, 'contentVersions');
    return <React.Fragment>
      <Flex className="package-info" fulled direction="column"><ContentInfo /></Flex>
      <Flex className="package-readme" fulled span={1}>
      <Markdown>{`# vue-next [![beta](https://img.shields.io/npm/v/vue/next.svg)](https://www.npmjs.com/package/vue/v/next) [![CircleCI](https://circleci.com/gh/vuejs/vue-next.svg?style=svg&circle-token=fb883a2d0a73df46e80b2e79fd430959d8f2b488)](https://circleci.com/gh/vuejs/vue-next)

## Status: Beta

- All planned RFCs have been merged.

- All [merged RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3A3.x) have been implemented.

- Vue CLI now has experimental support via [vue-cli-plugin-vue-next](https://github.com/vuejs/vue-cli-plugin-vue-next).

- There is also a simple plain webpack-based setup with Single-File Component support available [here](https://github.com/vuejs/vue-next-webpack-preview).

Please note that there could still be undocumented behavior inconsistencies with 2.x. When you run into such a case, please make sure to first check if the behavior difference has already been proposed in an existing RFC. If the inconsistency is not part of an RFC, then it's likely unintended, and an issue should be opened (please make sure to use the [issue helper](https://new-issue.vuejs.org/?repo=vuejs/vue-next) when opening new issues).

In addition, the current implementation requires native ES2015+ in the runtime environment and does not support IE11 (yet). The IE11 compatible build will be worked on after we have reached RC stage.

## Status of the rest of the framework

### Vue Router

- [![alpha](https://img.shields.io/npm/v/vue-router/next.svg)](https://www.npmjs.com/package/vue-router/v/next)
- [Github](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

We still have a few minor router hook behavior consistency issues with \`vue-router@3.x\`, but these are the only things that is blocking the router from being marked as Beta. The router is usable for new, non-critical projects.

### Vuex

- [![beta](https://img.shields.io/npm/v/vuex/next.svg)](https://www.npmjs.com/package/vuex/v/next)
- [Github](https://github.com/vuejs/vuex/tree/4.0)

The only difference between Vuex 4.0 and 3.x is that it's Vue 3 compatible! It is ready to enter RC together with Vue 3 core.

### Vue CLI

Vue 3 support in Vue CLI is currently provided via the [vue-cli-plugin-vue-next](https://github.com/vuejs/vue-cli-plugin-vue-next) plugin. You can scaffold a new project and then run \`vue add vue-next\` to switch to Vue 3. Vue 3 will become a option in the project creation process when it reaches RC.

Note if you are not particularly attached to webpack and IE11 support, you can also start a Vue 3 project with [Vite](https://github.com/vitejs/vite).

### JSX Support

There are currently two JSX transform implementations for Vue 3 with slightly differing syntax (for Vue specific features):

- [vueComponent/jsx](https://github.com/vueComponent/jsx)
- [HcySunYang/vue-next-jsx](https://github.com/HcySunYang/vue-next-jsx)

We are using [this thread](https://github.com/vuejs/jsx/issues/141) to unify the design and land on an official specification of how Vue features should be handled in JSX. If you use Vue with JSX, please provide your feedback in that thread.

### Other Projects

| Project             | Status |
| ------------------- | ------ |
| vue-devtools        | WIP (beta channel with Vue 3 support in early July) |
| eslint-plugin-vue   | [![alpha][epv-badge]][epv-npm] [[Github][epv-code]] |
| @vue/test-utils     | [![alpha][vtu-badge]][vtu-npm] [[Github][vtu-code]] |
| vue-class-component | [![alpha][vcc-badge]][vcc-npm] [[Github][vcc-code]] |
| vue-loader          | [![alpha][vl-badge]][vl-npm] [[Github][vl-code]] |
| rollup-plugin-vue   | [![alpha][rpv-badge]][rpv-npm] [[Github][rpv-code]] |

[epv-badge]: https://img.shields.io/npm/v/eslint-plugin-vue/next.svg
[epv-npm]: https://www.npmjs.com/package/eslint-plugin-vue/v/next
[epv-code]: https://github.com/vuejs/eslint-plugin-vue

[vtu-badge]: https://img.shields.io/npm/v/@vue/test-utils/next.svg
[vtu-npm]: https://www.npmjs.com/package/@vue/test-utils/v/next
[vtu-code]: https://github.com/vuejs/vue-test-utils-next

[jsx-badge]: https://img.shields.io/npm/v/@ant-design-vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@ant-design-vue/babel-plugin-jsx
[jsx-code]: https://github.com/vueComponent/jsx

[vcc-badge]: https://img.shields.io/npm/v/vue-class-component/next.svg
[vcc-npm]: https://www.npmjs.com/package/vue-class-component/v/next
[vcc-code]: https://github.com/vuejs/vue-class-component/tree/next

[vl-badge]: https://img.shields.io/npm/v/vue-loader/next.svg
[vl-npm]: https://www.npmjs.com/package/vue-loader/v/next
[vl-code]: https://github.com/vuejs/vue-loader/tree/next

[rpv-badge]: https://img.shields.io/npm/v/rollup-plugin-vue/next.svg
[rpv-npm]: https://www.npmjs.com/package/rollup-plugin-vue/v/next
[rpv-code]: https://github.com/vuejs/rollup-plugin-vue/tree/next

## Contribution

See [Contributing Guide](https://github.com/vuejs/vue-next/blob/master/.github/contributing.md).`}</Markdown>
      </Flex>
      <Flex className={classnames('package-versions', {
        active: !channel
      })} fulled direction="column"><ContentVersions /></Flex>
    </React.Fragment>
  }

  @Component()
  contentInfo() {
    const Label = useContextComponent<TLabel, PackageComponents>(this, 'labelInfo');
    return <React.Fragment>
      <div className="title">@vue/react</div>
      <div className="brands">
        <img src="https://img.shields.io/badge/version-1.2.4-brightgreen" alt=""/>
        <img src="https://img.shields.io/badge/registry-public-red" alt=""/>
        <img src="https://img.shields.io/badge/latest-16.13.1-brightgreen" alt=""/>
        <img src="https://img.shields.io/badge/next-16.13.1-yellow" alt=""/>
      </div>
      <Row>
        <Label name="Install" fulled>npm i react</Label>
        <Label name="Weekly Downloads" fulled>
          <Flex className="weekly-item" blocked align="between">
            <span>7,511,919</span>
            <span>图片</span>
          </Flex>
        </Label>
        <Label name="Version">16.13.1</Label>
        <Label name="License">MIT</Label>
        <Label name="Unpacked Size">204KB</Label>
        <Label name="Total Files">10</Label>
        <Label name="Issues">490</Label>
        <Label name="Pull Requests">104</Label>
        <Label name="Homepage" fulled>reactjs.org/</Label>
        <Label name="Repository" fulled>github.com/facebook/react</Label>
        <Label name="Last publish" fulled>23 days ago</Label>
        <Label name="Collaborators" fulled noBorder>
          <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </Label>
      </Row>
    </React.Fragment>
  }

  @Component()
  labelInfo(props: React.PropsWithChildren<TLabel>) {
    return <Col span={props.fulled ? 24 : 12}>
      <div className={classnames('label', { noborder: !!props.noBorder })}>
        <div className="label_name">{props.name}</div>
        <div className="label_value">{props.children}</div>
      </div>
    </Col>
  }

  @Component()
  contentVersions() {
    return <div className="version-wrap">
      <div className="tags">
        <div className="title"><AlignRightOutlined />VERSIONS</div>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.1
          </span>
          <span className="day">3 days ago</span>
        </Flex>
        <Flex className="tag" align="between" >
          <span className="marker">
            16.13.4
          </span>
          <span className="day">2 days ago</span>
        </Flex>
      </div>
    </div>
  }
}