import { useEffect, useRef, useState } from "react";
import "./sound-control.styles.css";
import { SOUND_ICON_PATHS } from "consts";

export type SoundControlProps = {
  volume: number;
  onVolumeChange: (volume: number) => void;
  containerClassName?: string;
  audioRef?: React.RefObject<HTMLAudioElement>;
  gainNodeRef?: React.RefObject<GainNode | null>;
};

export const SoundControl = ({
  volume,
  onVolumeChange,
  containerClassName = "",
  audioRef,
  gainNodeRef,
}: SoundControlProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const soundControlRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const className = ["sound-control", containerClassName].filter(Boolean).join(" ");

  const volumeIcon =
    volume === 0 ? SOUND_ICON_PATHS.soundOff : volume < 60 ? SOUND_ICON_PATHS.soundMedium : SOUND_ICON_PATHS.soundLoud;

  const handleSliderChange = (newVolume: number) => {
    const volumeValue = newVolume / 600;
    
    // Обновляем громкость в Web Audio API если доступна (для iOS)
    if (gainNodeRef?.current) {
      gainNodeRef.current.gain.value = volumeValue;
    }
    
    // Также обновляем на audio элементе
    if (audioRef?.current) {
      audioRef.current.volume = volumeValue;
    }
    
    // Обновляем состояние
    onVolumeChange(newVolume);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!sliderRef.current) return;
    
    const touch = e.touches[0];
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newVolume = Math.round(percentage * 100);
    
    // Обновляем значение input
    slider.value = String(newVolume);
    
    // Обновляем громкость напрямую для немедленного эффекта на iPhone
    const volumeValue = newVolume / 600;
    
    if (gainNodeRef?.current) {
      gainNodeRef.current.gain.value = volumeValue;
    }
    
    if (audioRef?.current) {
      audioRef.current.volume = volumeValue;
    }
    
    // И через callback
    onVolumeChange(newVolume);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showVolumeSlider &&
        soundControlRef.current &&
        !soundControlRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showVolumeSlider]);

  return (
    <div className={className} ref={soundControlRef}>
      <button
        type="button"
        className="sound-toggle"
        onClick={() => setShowVolumeSlider((prev) => !prev)}
        aria-label={
          showVolumeSlider ? "Скрыть громкость" : "Показать громкость"
        }
        aria-expanded={showVolumeSlider}
      >
        <img 
          src={volumeIcon} 
          alt="" 
          className={`sound-icon ${volumeIcon === SOUND_ICON_PATHS.soundLoud ? 'sound-icon--loud' : ''}`}
        />
      </button>

      {showVolumeSlider && (
        <div 
          className="sound-panel"
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={sliderRef}
            className="sound-slider"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onInput={(e) => handleSliderChange(Number((e.target as HTMLInputElement).value))}
            onTouchMove={handleTouchMove}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            aria-label="Громкость музыки"
          />
        </div>
      )}
    </div>
  );
};
