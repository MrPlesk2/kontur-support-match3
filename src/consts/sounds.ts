import sound1 from "@/assets/sounds/chpok1.mp3";
import sound2 from "@/assets/sounds/chpok2.mp3";
import sound3 from "@/assets/sounds/chpok3.mp3";
import backgroundMusic from "@/assets/music/background_music.mp3";
import soundOffIcon from "@/assets/icons/sound-off.svg";
import soundMediumIcon from "@/assets/icons/sound-medium.svg";
import soundLoudIcon from "@/assets/icons/sound-loud.svg";

export const SOUND_PATHS = {
  sounds: [sound1, sound2, sound3],
  background: backgroundMusic,
} as const;

export const SOUND_ICON_PATHS = {
  soundOff: soundOffIcon,
  soundMedium: soundMediumIcon,
  soundLoud: soundLoudIcon,
} as const;
