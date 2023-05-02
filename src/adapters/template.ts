/* Anki injects a template string of the following format:

  <style></style><script type="text/javascript" src="__bootstrap-fef39159.js"></script>

  note-type @@@ quiz-time
  ~~~
  template-side @@@ front
  ~~~
  field-front @@@ {{Front}}
  ~~~
  field-back @@@ {{Back}}
  ~~~
  field-source @@@ {{Source}}
  ~~~
  field-tags @@@ {{Tags}}
*/

const noteTypes = ['quiz-time', 'quiz-time-reverse', 'say-what'] as const;
const templateSides = ['front', 'back'] as const;

export type NoteType = (typeof noteTypes)[number];
export type TemplateSide = (typeof templateSides)[number];

export type Template = {
  'note-type': NoteType;
  'template-side': TemplateSide;
  [field: string]: string;
};

export default function setupTemplateAdapter(
  callback: (template: Template) => any
) {
  const templateInjectee = document.querySelector('#qa')!;
  const initialTemplateString = templateInjectee.innerHTML;
  templateInjectee.innerHTML = '';

  Object.defineProperty(templateInjectee, 'innerHTML', {
    set: function (templateString) {
      this._innerHTML = templateString;

      try {
        const template = parseTemplate(templateString);

        callback(template);
      } catch (error) {
        if (error instanceof Error) {
          templateInjectee.textContent = error.message;
        }
      }
    },
    get: function () {
      return this._innerHTML;
    },
  });

  templateInjectee.innerHTML = initialTemplateString;
}

const ATTRIBUTES_DELIMITER = '~~~' as const;
const ATTRIBUTE_KEY_VALUE_DELIMITER = '@@@' as const;

export function parseTemplate(templateString: string): Template {
  const parsedTemplate: Record<string, string> = {};

  const [_removedStyleAndScriptTags, ...restLinesOfTemplate] = templateString
    .trim()
    .split('\n');

  const attributes = restLinesOfTemplate
    .join('\n')
    .trim()
    .split(ATTRIBUTES_DELIMITER)
    .map((attribute) => attribute.trim());

  attributes.forEach((attribute) => {
    let [attributeKey, attributeValue] = attribute
      .split(ATTRIBUTE_KEY_VALUE_DELIMITER)
      .map((keyOrValue) => keyOrValue.trim());

    attributeValue = replaceBacktickWithHtmlEntity(attributeValue);

    parsedTemplate[attributeKey] = attributeValue;
  });

  if (!isTemplate(parsedTemplate)) {
    throw new Error(`Invalid Anki template: ${templateString}`);
  }

  return parsedTemplate;
}

// Handling edge case when "`value`" would turn into "value"
// Thus replace backticks with HTML entities to keep them
function replaceBacktickWithHtmlEntity(str: string) {
  if (str.startsWith('`') && str.endsWith('`')) {
    return str.replace(/`/g, '&#96;');
  }

  return str;
}

function isTemplate(obj: any): obj is Template {
  if (!('note-type' in obj) || !('template-side' in obj)) {
    return false;
  }

  if (
    !noteTypes.includes(obj['note-type']) ||
    !templateSides.includes(obj['template-side'])
  ) {
    return false;
  }

  return true;
}
