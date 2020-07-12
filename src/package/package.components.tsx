import React from 'react';
import { injectable } from 'inversify';
import { Component } from '@typeclient/react';

@injectable()
export class PackageComponents {
  @Component()
  test() {
    return <p>hello world</p>
  }
}