import { SunIcon } from "../_components/icons/SunIcon";
import { CloudyIcon } from "../_components/icons/CloudyIcon";
import { RainyIcon } from "../_components/icons/RainyIcon";

const toneToIconMap = {
  sunny: SunIcon,
  cloudy: CloudyIcon,
  rainy: RainyIcon,
};

export const getIconForTone = (tone: string) => {
  const iconComponent = toneToIconMap[tone];

  return iconComponent;
};
