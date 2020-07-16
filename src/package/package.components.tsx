import React from 'react';
import classnames from 'classnames';
import { injectable, inject } from 'inversify';
import { Component, useContextState, useApplicationContext, useContextComponent } from '@typeclient/react';
import { Flex } from '../components';
import { AntDesignOutlined, CloudSyncOutlined, AlignRightOutlined, LinkOutlined, BranchesOutlined } from '@ant-design/icons';
import { TPackageRouteData } from './package.interface';
import { Context } from '@typeclient/core';
import { PackageService } from './package.service';
import { Col, Row, Avatar } from 'antd';
import Parse from 'url-parse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { url as gurl } from 'gravatar';

dayjs.extend(relativeTime);

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
    const { channel, readme } = useContextState((ctx: Context<TPackageRouteData>) => {
      const meta = ctx.state.packageMetaData;
      const currentVersion = ctx.params.version ? ctx.params.version : meta['dist-tags']['latest'];
      const _version = meta.versions[currentVersion]
      return {
        channel: ctx.state.channel,
        readme: meta.readme || (_version ? _version.readme || 'no readme file.' : 'no readme file.') || 'no readme file.'
      }
    });
    const ContentInfo = useContextComponent(this, 'contentInfo');
    const ContentVersions = useContextComponent(this, 'contentVersions');
    return <React.Fragment>
      <Flex className="package-info" fulled direction="column"><ContentInfo /></Flex>
      <Flex className="package-readme" fulled span={1}>
      <Markdown>{readme}</Markdown>
      </Flex>
      <Flex className={classnames('package-versions', {
        active: !channel
      })} fulled direction="column"><ContentVersions /></Flex>
    </React.Fragment>
  }

  @Component()
  contentInfo() {
    const { name, version, distTags, license, homepage, repository, time, maintainers } = useContextState((ctx: Context<TPackageRouteData>) => {
      const meta = ctx.state.packageMetaData;
      const distTags: { key: string, value: string }[] = [];
      const currentVersion = ctx.params.version ? ctx.params.version : meta['dist-tags']['latest'];
      for (let i in meta['dist-tags']) distTags.push({ key: i, value: meta['dist-tags'][i] });
      return {
        name: meta.name,
        version: currentVersion,
        distTags,
        homepage: meta.homepage,
        license: meta.license,
        repository: meta.repository.type === 'git' ? this.getGitUrl(meta.repository.url) : meta.repository.url,
        time: new Date(meta.time[currentVersion]),
        maintainers: meta.maintainers.map(maintainer => {
          return {
            name: maintainer.name,
            url: gurl(maintainer.email),
          }
        })
      }
    })
    const Label = useContextComponent<TLabel, PackageComponents>(this, 'labelInfo');
    return <React.Fragment>
      <div className="title">{name}</div>
      <div className="brands">
        {
          distTags.map(tag => {
            const version = this.formatVersionLabel(tag.value);
            return <img key={tag.key} src={`https://img.shields.io/badge/${tag.key}-${version}-${tag.key === 'latest' ? 'blue' : 'green'}`} alt={tag.value}/>
          })
        }
      </div>
      <Row>
        <Label name="Install" fulled>npm i {name}</Label>
        {/* <Label name="Weekly Downloads" fulled>
          <Flex className="weekly-item" blocked align="between">
            <span>7,511,919</span>
            <span>图片</span>
          </Flex>
        </Label> */}
        <Label name="Version">{version}</Label>
        <Label name="License">{license}</Label>
        {/* <Label name="Unpacked Size">204KB</Label>
        <Label name="Total Files">10</Label>
        <Label name="Issues">490</Label>
        <Label name="Pull Requests">104</Label> */}
        <Label name="Homepage" fulled>
          <a href={homepage} target="_blank" rel="noopener noreferrer"><LinkOutlined /> {this.getUrlHost(homepage)}</a>
        </Label>
        <Label name="Repository" fulled>
          <a href={repository} target="_blank" rel="noopener noreferrer"><BranchesOutlined /> {this.getUrlHostAndPathname(repository)}</a>
        </Label>
      <Label name="Last publish" fulled>{dayjs(time).fromNow()}</Label>
        <Label name="Collaborators" fulled noBorder>
          {
            maintainers.map(maintainer => {
              return <Avatar shape="square" key={maintainer.name} src={maintainer.url + '?size=100&default=retro'} alt={maintainer.name} style={{ marginRight: 8 }} />
            })
          }
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

  private formatVersionLabel(version: string) {
    return version ? version.replace(/-/g, ' ') : null;
  }

  private getUrlHost(url: string) {
    if (!url) return null;
    const val = Parse(url);
    return val.hostname;
  }

  private getUrlHostAndPathname(url: string) {
    if (!url) return null;
    const val = Parse(url);
    return val.hostname + val.pathname;
  }

  private getGitUrl(url: string) {
    if (!url) return null;
    return url.startsWith('git+') ? url.substring(4) : url;
  }
}