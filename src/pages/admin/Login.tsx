import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const RETURN_TO_KEY = "devhq.return_to";

const resolveDestination = () => {
  try {
    const stored = sessionStorage.getItem(RETURN_TO_KEY);
    if (stored && stored.startsWith("/hq") && !stored.startsWith("/hq/login")) {
      sessionStorage.removeItem(RETURN_TO_KEY);
      return stored;
    }
  } catch {}
  return "/hq/today";
};

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate(resolveDestination(), { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(resolveDestination(), { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/hq/login",
      extraParams: { prompt: "select_account" },
    });
    if (error) console.error("Login error:", error);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 noise-overlay">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <SectionHeader
          as="h1"
          numeral="00"
          eyebrow="Restricted"
          align="center"
          title={<>Dev<span className="italic font-light text-accent">HQ.</span></>}
          description="Authorized personnel only. Sign in to enter the command center."
        />
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-display font-semibold text-sm bg-foreground text-background"
        >
          <LogIn size={18} />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
