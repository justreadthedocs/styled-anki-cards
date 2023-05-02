import setupTemplateAdapter, { Template, NoteType } from './adapters/template';
import { ComponentName as BasicCardComponentName } from './components/basic-card';

type CardTags = BasicCardComponentName;

const noteTypeToCardTag: { [key in NoteType]: CardTags } = {
  'quiz-time': 'basic-card',
  'quiz-time-reverse': 'basic-card',
  'say-what': 'basic-card',
};

async function importScripts() {
  try {
    await Promise.all([import('./styles/global.css'), import('./components')]);
  } catch (err) {
    console.log('Failed to import: ', err);
  }
}

function createOrUpdateCard(template: Template) {
  const { 'note-type': noteType, ...attributes } = template;
  const cardContainer = document.querySelector('#qa')!;
  const cardTag = noteTypeToCardTag[noteType];

  let card = cardContainer.querySelector(cardTag);
  if (!card) {
    card = document.createElement(cardTag);
    cardContainer.appendChild(card);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    card?.setAttribute(key, value);
  });
}

setupTemplateAdapter(createOrUpdateCard);
importScripts();
