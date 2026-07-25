import { useEffect, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Logo } from "../../components/branding";
import { Button, Card } from "../../ui";
import { completeOnboarding, shouldShowOnboarding } from "./onboarding";
import { supabase } from "../../lib/supabase";
import "./onboarding.css";

const steps = ["Set your monthly income", "Add your first bill", "Explore Budget, Savings, and Debt"];

function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    let active = true;
    async function decide() {
      const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      if (active && !data.session) setVisible(shouldShowOnboarding());
    }
    decide();
    return () => { active = false; };
  }, []);
  if (!visible) return null;
  function finish() { completeOnboarding(); setVisible(false); }
  return <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><Card className="onboarding__card" variant="elevated" padding="lg"><Logo variant="mark" theme="dark" size="md" decorative /><p className="onboarding__eyebrow">Welcome to BudgetForge</p><h1 id="onboarding-title">Build your financial foundation.</h1><p className="onboarding__description">Start with these three practical steps. You can return to every workspace whenever you’re ready.</p><ol className="onboarding__steps">{steps.map((item, index) => <li className={index <= step ? "is-active" : ""} key={item}><span>{index < step ? <Check size={14} aria-hidden="true" /> : index + 1}</span>{item}</li>)}</ol><div className="onboarding__actions"><Button variant="secondary" onClick={finish} leftIcon={<X size={16} />}>Skip for now</Button>{step < steps.length - 1 ? <Button onClick={() => setStep((current) => current + 1)} rightIcon={<ArrowRight size={16} />}>Get started</Button> : <Button onClick={finish} leftIcon={<Check size={16} />}>Finish setup</Button>}</div></Card></div>;
}
export default Onboarding;
