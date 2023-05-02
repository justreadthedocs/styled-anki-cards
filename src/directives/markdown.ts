import { Directive, CWCO } from 'cwco';

import renderAnkiMarkdownStringToHtml from '../helpers/markdown';

class MarkdownDirective extends Directive {
  render(val: any, { element }: CWCO.directiveRenderOptions) {
    element.innerHTML = renderAnkiMarkdownStringToHtml(val);

    return element;
  }
}

MarkdownDirective.register('markdown');

export default MarkdownDirective;
