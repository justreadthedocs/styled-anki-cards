import MarkdownIt from 'markdown-it';
import markdownItMark from 'markdown-it-mark';
import markdownItContainer from 'markdown-it-container';
import markdownItKatex from 'markdown-it-katex';
import hljs from 'highlight.js';

const markdownIt = new MarkdownIt({
  typographer: true,
  html: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value;
    }

    return '';
  },
})
  .use(markdownItMark)
  .use(markdownItKatex)
  .use(markdownItContainer, 'notes');

function replaceAnkiHtmlTagsAndEntities(markdownString: string) {
  return markdownString
    .replace(/<\/?span>/g, '')
    .replace(/<\/?div>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#96;/g, '`');
}

export default function renderAnkiMarkdownStringToHtml(markdownString: string) {
  if (!markdownString) {
    return ``;
  }

  markdownString = replaceAnkiHtmlTagsAndEntities(markdownString);

  return markdownIt.render(markdownString);
}
