import React, { useCallback } from 'react';
import { Controller, Route, Context, State, useMiddleware, useException } from "@typeclient/core";
import { TCustomRouteData, CustomRouteData } from "./custom.interface";
import { Template, useContextState, useContextComponent } from '@typeclient/react';
import { CustomTemplate } from './custom.template';
import { CustomMiddleware } from './custom.middleware';
import { CustomError } from './custom.error';
import { inject } from 'inversify';
import { CustomService } from './custom.service';
import { Button } from 'antd';

@Controller()
@Template(CustomTemplate)
@useException(CustomError)
export class CustomController {
  @inject(CustomService) private readonly CustomService: CustomService;

  @Route()
  @State(CustomRouteData)
  @useMiddleware(CustomMiddleware)
  IndexPage(ctx: Context<TCustomRouteData>) {
    const { count } = useContextState(() => {
      return {
        count: ctx.state.count,
      }
    });
    const click = useCallback(() => ctx.state.count = ctx.state.count + 2, [ctx.state.count]);
    const TestComponent = useContextComponent<TCustomRouteData, CustomService>(this.CustomService, 'cumstomComponent');
    return <React.Fragment>
      <p>Count++: {count} | Random Number: {this.CustomService.getdefaultCount()}</p>
      <span>
        <Button type="primary">Text Button</Button>
        Edit <code>src/custom/custom.controller.tsx</code> and save to reload. <br />
        <button onClick={click}>Click +</button>
        <TestComponent count={count} />
      </span>
    </React.Fragment>
  }
}