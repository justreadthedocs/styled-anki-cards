import fs from 'fs';
import path from 'path';

import * as AnkiApi from './api/anki-api.ts';

const DIST_DIR_PATH = './dist';
const BOOTSTRAP_SCRIPT_PARTIAL_NAME = '__bootstrap';

function removeOldFilesFrom(ankiMediaDirPath: string) {
  const files = fs.readdirSync(ankiMediaDirPath);

  files.forEach((file) => {
    const isOldFile = file.startsWith('__');
    if (isOldFile) {
      fs.unlinkSync(path.join(ankiMediaDirPath, file));
    }
  });

  console.log(`Removed old files from ${ankiMediaDirPath}`);
}

function copyNewFiles(distDirPath: string, ankiMediaDirPath: string) {
  const files = fs.readdirSync(distDirPath);

  files.forEach((file) => {
    fs.copyFileSync(
      path.join(distDirPath, file),
      path.join(ankiMediaDirPath, file)
    );
  });

  console.log(`Copied new files from ${distDirPath} to ${ankiMediaDirPath}`);
}

async function updateScriptSrcInAllNoteTypes() {
  const noteTypes = await AnkiApi.getAllNoteTypes();
  const bootstrapScriptName = getBootstrapScriptName();

  for (const noteType of noteTypes) {
    const noteTypeTemplates = await AnkiApi.getNoteTypeTemplates(noteType);

    for (let [cardType, templates] of Object.entries(noteTypeTemplates)) {
      for (let [cardSide, template] of Object.entries(templates)) {
        const updatedTemplate = replaceBootstrapScriptSrc(
          template,
          bootstrapScriptName
        );

        await AnkiApi.updateNoteTypeTemplate(
          noteType,
          cardType,
          cardSide,
          updatedTemplate
        );
      }
    }
  }

  console.log(`Updated all note types: ${noteTypes.join(', ')}`);
}

function getBootstrapScriptName() {
  const files = fs.readdirSync(DIST_DIR_PATH);

  const bootstrapScriptName = files.find((file) =>
    file.startsWith(BOOTSTRAP_SCRIPT_PARTIAL_NAME)
  );

  if (!bootstrapScriptName) {
    throw new Error('No bootstrap script found in directory.');
  }

  return bootstrapScriptName;
}

function replaceBootstrapScriptSrc(template: string, newScriptSrc: string) {
  const bootstrapScriptSrcRegex = new RegExp(
    `src=['"]${BOOTSTRAP_SCRIPT_PARTIAL_NAME}[^'"]*['"]`,
    'i'
  );

  if (!bootstrapScriptSrcRegex.test(template)) {
    return template;
  }

  return template.replace(bootstrapScriptSrcRegex, `src="${newScriptSrc}"`);
}

const ankiMediaDirPath = await AnkiApi.getMediaDirPath();

removeOldFilesFrom(ankiMediaDirPath);
copyNewFiles(DIST_DIR_PATH, ankiMediaDirPath);
await updateScriptSrcInAllNoteTypes();

AnkiApi.syncWithAnkiWeb();
