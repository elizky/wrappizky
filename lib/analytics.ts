import { SpotifyListeningData } from '@/types/spotify';

export interface TrackStats {
  name: string;
  artist: string;
  playCount: number;
  totalMs: number;
  uri: string;
}

export interface ArtistStats {
  name: string;
  playCount: number;
  totalMs: number;
  tracks: Set<string>;
  albums: Set<string>;
}

export interface AlbumStats {
  name: string;
  artist: string;
  playCount: number;
  totalMs: number;
  tracks: Set<string>;
}

export function getMostPlayedTracks(data: SpotifyListeningData[]): TrackStats[] {
  const trackMap = new Map<string, TrackStats>();

  data.forEach((entry) => {
    if (!entry.master_metadata_track_name || entry.episode_name) return;

    const key = entry.spotify_track_uri;
    const existing = trackMap.get(key) || {
      name: entry.master_metadata_track_name,
      artist: entry.master_metadata_album_artist_name,
      playCount: 0,
      totalMs: 0,
      uri: entry.spotify_track_uri,
    };

    trackMap.set(key, {
      ...existing,
      playCount: existing.playCount + 1,
      totalMs: existing.totalMs + entry.ms_played,
    });
  });

  return Array.from(trackMap.values()).sort((a, b) => b.playCount - a.playCount);
}

export function getMostPlayedArtists(data: SpotifyListeningData[]): ArtistStats[] {
  const artistMap = new Map<string, ArtistStats>();

  data.forEach((entry) => {
    if (!entry.master_metadata_album_artist_name || entry.episode_name) return;

    const key = entry.master_metadata_album_artist_name;
    const existing = artistMap.get(key) || {
      name: entry.master_metadata_album_artist_name,
      playCount: 0,
      totalMs: 0,
      tracks: new Set<string>(),
      albums: new Set<string>(),
    };

    existing.playCount += 1;
    existing.totalMs += entry.ms_played;
    existing.tracks.add(entry.master_metadata_track_name);
    existing.albums.add(entry.master_metadata_album_album_name);

    artistMap.set(key, existing);
  });

  return Array.from(artistMap.values())
    .sort((a, b) => b.playCount - a.playCount)
    .map((artist) => ({
      ...artist,
      tracks: artist.tracks,
      albums: artist.albums,
    }));
}

export function getMostPlayedAlbums(data: SpotifyListeningData[]): AlbumStats[] {
  const albumMap = new Map<string, AlbumStats>();

  data.forEach((entry) => {
    if (!entry.master_metadata_album_album_name || entry.episode_name) return;

    const key = `${entry.master_metadata_album_album_name}-${entry.master_metadata_album_artist_name}`;
    const existing = albumMap.get(key) || {
      name: entry.master_metadata_album_album_name,
      artist: entry.master_metadata_album_artist_name,
      playCount: 0,
      totalMs: 0,
      tracks: new Set<string>(),
    };

    existing.playCount += 1;
    existing.totalMs += entry.ms_played;
    existing.tracks.add(entry.spotify_track_uri);

    albumMap.set(key, existing);
  });

  return Array.from(albumMap.values())
    .sort((a, b) => b.playCount - a.playCount)
    .map((album) => ({
      ...album,
      tracks: album.tracks,
    }));
}

export function getListeningHistoryByDate(
  data: SpotifyListeningData[],
  date: Date
): SpotifyListeningData[] {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return data
    .filter((entry) => {
      const entryDate = new Date(entry.ts);
      return entryDate >= targetDate && entryDate < nextDate;
    })
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
}

export function getLocationData(data: SpotifyListeningData[]) {
  const locations = data.reduce((acc, entry) => {
    const location = entry.conn_country;
    if (location) {
      acc[location] = (acc[location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(locations).map(([location, listens]) => ({
    location,
    listens,
  }));
}

export function getTimeData(data: SpotifyListeningData[]) {
  const ranges = {
    'Midnight - 6 AM': { listens: 0, tracks: new Map<string, number>(), artists: new Map<string, number>() },
    '6 AM - 12 PM': { listens: 0, tracks: new Map<string, number>(), artists: new Map<string, number>() },
    '12 PM - 6 PM': { listens: 0, tracks: new Map<string, number>(), artists: new Map<string, number>() },
    '6 PM - Midnight': { listens: 0, tracks: new Map<string, number>(), artists: new Map<string, number>() },
  };

  data.forEach((entry) => {
    const date = new Date(entry.ts);
    const hour = date.getHours();
    let range: keyof typeof ranges;

    if (hour >= 0 && hour < 6) range = 'Midnight - 6 AM';
    else if (hour >= 6 && hour < 12) range = '6 AM - 12 PM';
    else if (hour >= 12 && hour < 18) range = '12 PM - 6 PM';
    else range = '6 PM - Midnight';

    ranges[range].listens += 1;
    if (entry.master_metadata_track_name) {
      const track = entry.master_metadata_track_name;
      ranges[range].tracks.set(track, (ranges[range].tracks.get(track) || 0) + 1);
    }
    if (entry.master_metadata_album_artist_name) {
      const artist = entry.master_metadata_album_artist_name;
      ranges[range].artists.set(artist, (ranges[range].artists.get(artist) || 0) + 1);
    }
  });

  return ranges;
}

export function getTimeRangeChartData(timeData: ReturnType<typeof getTimeData>) {
  return Object.entries(timeData).map(([range, { listens, tracks, artists }]) => {
    const topTrack = [...tracks.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const topArtist = [...artists.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return {
      range,
      listens,
      topTrack,
      topArtist,
    };
  });
}
