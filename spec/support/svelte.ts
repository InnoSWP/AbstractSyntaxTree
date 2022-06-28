import { JSDOM } from 'jsdom'

import { bind, binding_callbacks } from 'svelte/internal'

const setupGlobalJsdom = (url = 'https://localhost') => {
  const dom = new JSDOM('', { url, pretendToBeVisual: true })
  global.document = dom.window.document
  const win: any = { ...global.window, ...dom.window }
  global.window = win
  global.navigator = dom.window.navigator
}
const createContainer = () => {
  global.container = document.createElement('div')
  document.body.appendChild(global.container)
}

let mountedComponents

export const setDomDocument = url => {
  setupGlobalJsdom(url)
  createContainer()
  mountedComponents = []
}

const setBindingCallbacks = (bindings, component) =>
  Object.keys(bindings).forEach(binding => {
    binding_callbacks.push(() => {
      bind(component, binding, value => {
        bindings[binding] = value
      })
    })
  })

export const mount = (component, props = {}, { bindings = {} } = {}) => {
  const mounted = new component({
    target: global.container,
    props
  })
  setBindingCallbacks(bindings, mounted)
  mountedComponents = [mounted, ...mountedComponents]
  return mounted
}
export const unmountAll = () => {
  mountedComponents.forEach(component => {
    component.$destroy()
  })
  mountedComponents = []
}
