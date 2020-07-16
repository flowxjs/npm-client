import { injectable } from 'inversify';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { Context } from '@typeclient/core';
@injectable()
export class AxiosRequest {
  private readonly ajax: AxiosInstance;
  private readonly token = axios.CancelToken;
  constructor() {
    this.ajax = axios.create();
    this.ajax.interceptors.response.use(data => data, error => {
      if (axios.isCancel(error)) return;
      if (error.response) {
        message.error(error.response.message);
      } else if (error.request) {
        message.error(error.request.message);
      } else {
        message.error(error.message);
      }
      return Promise.reject(error);
    })
  }

  get<T extends object = {}>(ctx: Context<T>, url: string, configs: AxiosRequestConfig = {}) {
    const source = this.token.source();
    const unbind = ctx.useReject(() => source.cancel());
    return this.ajax.get(url, Object.assign(configs, {
      cancelToken: source.token
    })).finally(unbind);
  }
}