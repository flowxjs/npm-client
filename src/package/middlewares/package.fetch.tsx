import { MiddlewareTransform, Context, ComposeNextCallback } from "@typeclient/core";
import { injectable, inject } from 'inversify';
import { AxiosRequest } from "../../utils/axios";
import { TPackageRouteData } from "../package.interface";

@injectable()
export class PackageFetchMiddleware implements MiddlewareTransform<Context<TPackageRouteData>> {
  @inject(AxiosRequest) private readonly AxiosRequest: AxiosRequest;

  async use(ctx: Context<TPackageRouteData>, next: ComposeNextCallback) {
    console.log('in')
    const scope: string = ctx.params.scope;
    const pathname: string = ctx.params.pathname;
    const version: string = ctx.params.version;

    let entry: string;
    if (scope) {
      if (version) {
        entry = `/@${scope}/${pathname}/v/${version}`;
      } else {
        entry = `/@${scope}/${pathname}`;
      }
    } else {
      if (version) {
        entry = `/${pathname}/v/${version}`;
      } else {
        entry = `/${pathname}`;
      }
    }
    
    console.log(`/--/package${entry}`)
    const result = await this.AxiosRequest.get(ctx, `/--/package${entry}`);
    console.log(result)
    ctx.state.packageMetaData = result.data;
    await next();
  }
}