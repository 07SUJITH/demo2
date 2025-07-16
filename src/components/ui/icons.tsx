import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  UserPlus,
} from "lucide-react";

export const Icons = {
  spinner: Loader2,
  mail: Mail,
  lock: Lock,
  eye: Eye,
  eyeOff: EyeOff,
  login: LogIn,
  userPlus: UserPlus,
  google: LogIn, // Using LogIn as a fallback for Google icon
  alertCircle: AlertCircle,
} as const;

export type IconName = keyof typeof Icons;
