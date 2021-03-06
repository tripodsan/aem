import { document, Node } from 'global';
import dedent from 'ts-dedent';
import { RenderMainArgs } from './types';
import * as Runtime from '@adobe/htlengine/src/runtime/Runtime';
import ComponentLoader from './helpers/ComponentLoader';
import ResourceResolver from './helpers/ResourceResolver';

const rootElement = document.getElementById('root');

export default async function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
}: RenderMainArgs) {
  const errorMessage = {
    title: `Expecting an HTML snippet or DOM node from the story: "${selectedStory}" of "${selectedKind}".`,
    description: dedent`
      Did you forget to return the HTML snippet from the story in the template parameter?
      Use "template: <your snippet, node, or template>" or when defining the story.
    `,
  };
  const storyObj = storyFn() as any;
  const { resourceLoaderPath, resourceType, props, content, wcmmode = {}, decorationTag = {} } = storyObj;
  let { template } = storyObj;
  const runtime = new Runtime();
  runtime.setGlobal({
    wcmmode: wcmmode,
    component: {
      properties: props
    },
    content: content,
  });
  runtime.withDomFactory(new Runtime.VDOMFactory(window.document.implementation).withKeepFragment(true));
  const compLoader = new ComponentLoader();
  const resolver = new ResourceResolver(content || {}, compLoader);
  runtime.withResourceLoader(resolver.createResourceLoader(resourceLoaderPath || '/'));

  showMain();

  const decorationElementType = decorationTag.hasOwnProperty('tagName') ? decorationTag.tagName : 'div';
  const decorationElementClass = decorationTag.hasOwnProperty('cssClasses') ? decorationTag.cssClasses.join(' ') : 'component';

  const decorationElement = document.createElement(decorationElementType);
  decorationElement.setAttribute('class',decorationElementClass);

  if (!template && resourceType) {
    const info = compLoader.resolve(resourceType);
    if (!info) {
      template = `unable to load ${resourceType}`;
    } else {
      template = info.module;
    }
  }

  if (typeof template === 'string') {
    if (decorationTag === null) {
      rootElement.innerHTML = template;
    } else {
      rootElement.innerHTML = '';
      decorationElement.innerHTML = template;
      rootElement.appendChild(decorationElement);
    }
  } else if (typeof template === 'function') {
    const element = await template(runtime);
    if (element instanceof Node !== true) {
      showError(errorMessage);
    } else {
      // Don't re-mount the element if it didn't change and neither did the story
      if (forceRender === true &&
        (rootElement.firstChild === element ||
        (rootElement.firstChild === decorationElement && decorationElement.firstChild === element) ) ) {
        return;
      }

      rootElement.innerHTML = '';
      if (decorationTag === null) {
        rootElement.appendChild(element);
      } else {
        decorationElement.appendChild(element);
        rootElement.appendChild(decorationElement);
      }
    }
  } else {
    showError(errorMessage);
  }
}
