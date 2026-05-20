import {
  Dumbbell, GlassWater, Building2, Gamepad2, User, Factory, Sparkles,
  Briefcase, Code2, ShoppingBag, Camera, Heart, Zap, Target, TrendingUp,
  Rocket, Coins, Car, Wrench, Palette, type LucideIcon,
} from "lucide-react";

export const VENTURE_ICONS: Record<string, LucideIcon> = {
  Dumbbell, GlassWater, Building2, Gamepad2, User, Factory, Sparkles,
  Briefcase, Code2, ShoppingBag, Camera, Heart, Zap, Target, TrendingUp,
  Rocket, Coins, Car, Wrench, Palette,
};

export const VENTURE_ICON_NAMES = Object.keys(VENTURE_ICONS);

export const getVentureIcon = (name: string | null | undefined): LucideIcon =>
  (name && VENTURE_ICONS[name]) || Sparkles;
