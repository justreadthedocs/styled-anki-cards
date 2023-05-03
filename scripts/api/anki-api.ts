import axios from 'axios';
import http from 'http';

type AnkiApiResponse<T> = {
  result: T;
  error: string | null;
};

const api = axios.create({
  baseURL: 'http://localhost:8765/' || process.env.ANKI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  httpAgent: new http.Agent({ keepAlive: false }),
});

export async function getMediaDirPath() {
  const response = await api.post<AnkiApiResponse<string>>('/', {
    action: 'getMediaDirPath',
    version: 6,
  });

  return response.data.result;
}

export async function getAllNoteTypes() {
  const response = await api.post<AnkiApiResponse<string[]>>('/', {
    action: 'modelNames',
    version: 6,
  });

  return response.data.result;
}

export async function getNoteTypeTemplates(noteType: string) {
  type GetNoteTemplatesResponse = AnkiApiResponse<{
    [card: string]: {
      Front: string;
      Back: string;
    };
  }>;

  const response = await api.post<GetNoteTemplatesResponse>('/', {
    action: 'modelTemplates',
    version: 6,
    params: {
      modelName: noteType,
    },
  });

  return response.data.result;
}

export async function updateNoteTypeTemplate(
  noteType: string,
  cardType: string,
  cardSide: string,
  templateContents: string
) {
  await api.post<AnkiApiResponse<null>>('/', {
    action: 'updateModelTemplates',
    version: 6,
    params: {
      model: {
        name: noteType,
        templates: {
          [cardType]: {
            [cardSide]: templateContents,
          },
        },
      },
    },
  });
}

export async function syncWithAnkiWeb() {
  await api.post<AnkiApiResponse<null>>('/', {
    action: 'sync',
    version: 6,
  });

  console.log('Synced with AnkiWeb');
}
