"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackStats, ArtistStats, AlbumStats } from "@/lib/analytics";
import { Music2, Mic2, Disc3 } from "lucide-react";
import { StatsList } from "@/components/StatsList";

interface TopStatsProps {
  tracks: TrackStats[];
  artists: ArtistStats[];
  albums: AlbumStats[];
}

export function TopStats({ tracks, artists, albums }: TopStatsProps) {
  const renderTrack = (track: TrackStats) => (
    <div className="text-sm border-l-2 border-primary pl-3 py-1">
      <div className="font-medium">{track.name}</div>
      <div className="text-muted-foreground">{track.artist}</div>
      <div className="text-xs text-primary">
        Played {track.playCount} times
      </div>
    </div>
  );

  const renderArtist = (artist: ArtistStats) => (
    <div className="text-sm border-l-2 border-primary pl-3 py-1">
      <div className="font-medium">{artist.name}</div>
      <div className="text-muted-foreground">
        {artist.tracks.size} tracks • {artist.albums.size} albums
      </div>
      <div className="text-xs text-primary">
        Played {artist.playCount} times
      </div>
    </div>
  );

  const renderAlbum = (album: AlbumStats) => (
    <div className="text-sm border-l-2 border-primary pl-3 py-1">
      <div className="font-medium">{album.name}</div>
      <div className="text-muted-foreground">{album.artist}</div>
      <div className="text-xs text-primary">
        {album.tracks.size} tracks • Played {album.playCount} times
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-primary/20 bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Top Tracks
            <Music2 className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsList items={tracks} renderItem={renderTrack} />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Top Artists
            <Mic2 className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsList items={artists} renderItem={renderArtist} />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Top Albums
            <Disc3 className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsList items={albums} renderItem={renderAlbum} />
        </CardContent>
      </Card>
    </div>
  );
}