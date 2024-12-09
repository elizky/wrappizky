import { SpotifyListeningData } from '@/types/spotify';
import path from 'path';
import fs from 'fs/promises';

export async function getJSONData(): Promise<SpotifyListeningData[]> {
  const filenames = [
    'Streaming_History_Audio_2014-2017_0.json',
    'Streaming_History_Audio_2017-2018_1.json',
    'Streaming_History_Audio_2018-2019_2.json',
    'Streaming_History_Audio_2019-2020_3.json',
    'Streaming_History_Audio_2020-2021_4.json',
    'Streaming_History_Audio_2021-2022_5.json',
    'Streaming_History_Audio_2022-2023_6.json',
    'Streaming_History_Audio_2023-2024_7.json',
    'Streaming_History_Video_2017-2024.json',
  ];

  try {
    // Construir la ruta completa para el directorio `public/data`
    const dataDir = path.join(process.cwd(), 'public', 'data');

    // Leer y parsear todos los archivos
    const readPromises = filenames.map(async (filename) => {
      const filePath = path.join(dataDir, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    });

    // Combinar todos los arrays en un solo array
    const allData = await Promise.all(readPromises);
    const combinedData = allData.flat(); // Aplana los arrays en uno solo

    return combinedData;
  } catch (error) {
    console.error('Error loading listening data:', error);
    return [];
  }
}
