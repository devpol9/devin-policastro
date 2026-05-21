import {
  Dumbbell, GlassWater, Building2, Gamepad2, User, Factory, Sparkles,
  Briefcase, Code2, ShoppingBag, Camera, Heart, Zap, Target, TrendingUp,
  Rocket, Coins, Car, Wrench, Palette, Activity, Flame, Crown, Beaker,
  Lightbulb, Layers, Cpu, Waves, Trophy, Droplet, Mountain, Diamond,
  Spade, Brain, Leaf, Anchor, Compass, Music, Film, Tv, type LucideIcon,
} from "lucide-react";

export const VENTURE_ICONS: Record<string, LucideIcon> = {
  Dumbbell, Flame, Activity, Trophy, Mountain,
  GlassWater, Droplet, Beaker, Waves, Leaf,
  Building2, Briefcase, Factory, Layers, Anchor, Compass,
  Gamepad2, Spade, Diamond, Crown, Coins,
  Zap, Cpu, Code2, Brain, Lightbulb, Rocket, Sparkles,
  User, Heart, Target, TrendingUp, Camera, ShoppingBag,
  Car, Wrench, Palette, Music, Film, Tv,
};

export const VENTURE_ICON_NAMES = Object.keys(VENTURE_ICONS);

export const getVentureIcon = (name: string | null | undefined): LucideIcon =>
  (name && VENTURE_ICONS[name]) || Sparkles;
