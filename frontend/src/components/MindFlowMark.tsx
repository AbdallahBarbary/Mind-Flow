import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme/tokens";

type Props = {
  size?: number;
};

export function MindFlowMark({ size = 48 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect width="64" height="64" rx="20" fill="#f3f5ef" />
      <Rect x="4" y="4" width="56" height="56" rx="17" fill="#dce3d3" />
      <Circle cx="32" cy="30" r="12" fill="#1f271f" />
      <Rect x="26" y="24" width="12" height="12" rx="4" fill="#f3f5ef" />
      <Path
        d="M15 42C22 52 42 55 51 41"
        stroke="#1f271f"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <Path d="M24 41C27 44 37 44 40 41" stroke="#7b8b75" strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}
