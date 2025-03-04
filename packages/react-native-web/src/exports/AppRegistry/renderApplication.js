/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ComponentType, Node } from 'react';

import AppContainer from './AppContainer';
import invariant from 'fbjs/lib/invariant';
import render, { hydrate } from '../render';
import StyleSheet from '../StyleSheet';
import React from 'react';

export default function renderApplication<Props: Object>(
  RootComponent: ComponentType<Props>,
  WrapperComponent?: ?ComponentType<*>,
  callback?: () => void,
  options: {
    hydrate: boolean,
    initialProps: Props,
    rootTag: any
  }
) {
  const { hydrate: shouldHydrate, initialProps, rootTag } = options;
  const renderFn = shouldHydrate ? hydrate : render;

  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  renderFn(
    <AppContainer WrapperComponent={WrapperComponent} rootTag={rootTag}>
      <RootComponent {...initialProps} />
    </AppContainer>,
    rootTag,
    callback
  );
}

export function getApplication(
  RootComponent: ComponentType<Object>,
  initialProps: Object,
  WrapperComponent?: ?ComponentType<*>
): {| element: Node, getStyleElement: (Object) => Node |} {
  // Reset all styles generated after the last getApplication call
  StyleSheet.resetSheet();

  const element = (
    <AppContainer WrapperComponent={WrapperComponent} rootTag={{}}>
      <RootComponent {...initialProps} />
    </AppContainer>
  );
  // Don't escape CSS text
  const getStyleElement = (props) => {
    const sheet = StyleSheet.getSheet();
    return (
      <style
        {...props}
        dangerouslySetInnerHTML={{ __html: sheet.textContent }}
        id={sheet.id}
      />
    );
  };
  return { element, getStyleElement };
}
