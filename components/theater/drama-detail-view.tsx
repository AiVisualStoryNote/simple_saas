"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EpisodeList } from "./episode-list";
import { PurchaseConfirmDialog } from "./purchase-confirm-dialog";
import { ArrowLeft, Play, Lock, Loader2, Smartphone, Monitor } from "lucide-react";
import { getDramaDetail, purchaseEpisode, getFileUrl, type DramaDetail, type DramaEpisodeWithPrice } from "@/lib/drama";
import { getUserCredits } from "@/lib/drama";

interface DramaDetailViewProps {
  dramaId: number;
}

export function DramaDetailView({ dramaId }: DramaDetailViewProps) {
  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEpisode, setSelectedEpisode] = useState<DramaEpisodeWithPrice | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const [userCredits, setUserCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState<DramaEpisodeWithPrice | null>(null);

  const fetchDrama = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getDramaDetail(dramaId);
      if (result.error) {
        setError(result.error);
      } else if (result.drama) {
        setDrama(result.drama);

        if (result.drama.episodes.length > 0 && !selectedEpisode) {
          const firstEpisode = result.drama.episodes[0];
          setSelectedEpisode(firstEpisode);

          if (firstEpisode.price === 0 || firstEpisode.is_purchased) {
            loadVideo(firstEpisode);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drama');
    } finally {
      setLoading(false);
    }
  }, [dramaId]);

  const loadVideo = async (episode: DramaEpisodeWithPrice) => {
    if (!episode.composite_video_key) return;

    setLoadingVideo(true);
    setVideoUrl(null);

    try {
      const url = await getFileUrl(episode.composite_video_key);
      setVideoUrl(url);
    } catch (err) {
      console.error('Failed to load video:', err);
      setVideoUrl(null);
    } finally {
      setLoadingVideo(false);
    }
  };

  const fetchCredits = async () => {
    setLoadingCredits(true);
    try {
      const credits = await getUserCredits();
      setUserCredits(credits);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    fetchDrama();
    fetchCredits();
  }, [fetchDrama]);

  const handleEpisodeSelect = (episode: DramaEpisodeWithPrice) => {
    setSelectedEpisode(episode);
    setVideoUrl(null);

    if (episode.price === 0 || episode.is_purchased) {
      loadVideo(episode);
    }
  };

  const handlePurchaseClick = (episode: DramaEpisodeWithPrice) => {
    setPurchaseTarget(episode);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!purchaseTarget || !drama) return;

    const result = await purchaseEpisode({
      dramaId: drama.id,
      episodeId: purchaseTarget.id,
      dramaName: drama.name,
      episodeName: purchaseTarget.name,
      price: purchaseTarget.price,
    });

    if (result.success) {
      await fetchDrama();
      await fetchCredits();

      if (purchaseTarget.price === 0) {
        const updatedEpisode = drama.episodes.find(e => e.id === purchaseTarget.id);
        if (updatedEpisode) {
          setSelectedEpisode({ ...updatedEpisode, is_purchased: true });
          loadVideo({ ...updatedEpisode, is_purchased: true });
        }
      }
    } else {
      throw new Error(result.error || 'Purchase failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !drama) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <p className="text-red-500">{error || 'Drama not found'}</p>
          <Link href="/theater">
            <Button variant="outline" className="mt-4">
              Back to Theater
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVertical = drama.orientation === '竖屏';
  const selectedHasAccess = selectedEpisode && (selectedEpisode.price === 0 || selectedEpisode.is_purchased);

  return (
    <div className="container py-8">
      <Link
        href="/theater"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Theater
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{drama.name}</h1>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            {isVertical ? (
              <>
                <Smartphone className="h-4 w-4" />
                竖屏
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                横屏
              </>
            )}
          </span>
          <span className="text-sm text-muted-foreground">{drama.resolution}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {drama.tags?.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-md text-xs font-medium text-white"
              style={{ backgroundColor: tag.color || '#6366f1' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        {drama.description && (
          <p className="text-muted-foreground text-sm">{drama.description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div
            className={`relative ${
              isVertical ? 'aspect-[3/4] max-w-[400px]' : 'aspect-video'
            } bg-black rounded-lg overflow-hidden`}
          >
            {loadingVideo ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : selectedHasAccess && videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : selectedHasAccess && !videoUrl ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Video unavailable</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {selectedEpisode
                    ? `EP ${selectedEpisode.episode_number}: ${selectedEpisode.name}`
                    : 'Select an episode'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Purchase to unlock this episode
                </p>
              </div>
            )}
          </div>

          {selectedEpisode && (
            <div className="mt-4 p-4 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">
                EP {selectedEpisode.episode_number}: {selectedEpisode.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedEpisode.summary}
              </p>
              <details className="group">
                <summary className="cursor-pointer text-sm text-primary hover:underline">
                  View Outline
                </summary>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {selectedEpisode.outline}
                </p>
              </details>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 border-l lg:border-t-0 border-t">
          <div className="lg:max-h-[600px] overflow-hidden">
            <EpisodeList
              episodes={drama.episodes}
              selectedEpisodeId={selectedEpisode?.id || null}
              onEpisodeSelect={handleEpisodeSelect}
              onPurchaseClick={handlePurchaseClick}
            />
          </div>
        </div>
      </div>

      {purchaseTarget && drama && (
        <PurchaseConfirmDialog
          open={showPurchaseDialog}
          dramaName={drama.name}
          episodeName={purchaseTarget.name}
          episodeNumber={purchaseTarget.episode_number}
          price={purchaseTarget.price}
          userCredits={userCredits}
          onClose={() => {
            setShowPurchaseDialog(false);
            setPurchaseTarget(null);
          }}
          onConfirm={handlePurchaseConfirm}
        />
      )}
    </div>
  );
}