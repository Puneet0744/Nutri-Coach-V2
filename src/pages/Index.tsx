import { useState } from "react";
import Hero from "@/components/Hero";
import OnboardingFlow, { UserProfile } from "@/components/OnboardingFlow";
import Dashboard from "@/components/Dashboard";
import RecipeGenerator from "@/components/RecipeGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ChefHat, Calendar, TrendingUp, Settings } from "lucide-react";

type AppState = "hero" | "onboarding" | "dashboard" | "recipes" | "planning" | "progress";

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>("hero");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleGetStarted = () => {
    setCurrentView("onboarding");
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView("dashboard");
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "recipes", label: "Recipes", icon: ChefHat },
    { id: "planning", label: "Meal Plans", icon: Calendar },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  const renderNavigation = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">NutriCoach Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id as AppState)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "hero":
        return <Hero onGetStarted={handleGetStarted} />;
      case "onboarding":
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case "dashboard":
        return userProfile ? <Dashboard profile={userProfile} /> : null;
      case "recipes":
        return userProfile ? <RecipeGenerator profile={userProfile} /> : null;
      case "planning":
        return <ComingSoonView title="Meal Planning" />;
      case "progress":
        return <ComingSoonView title="Progress Tracking" />;
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <>
      {currentView !== "hero" && currentView !== "onboarding" && renderNavigation()}
      <div className={currentView !== "hero" && currentView !== "onboarding" ? "pt-16" : ""}>
        {renderContent()}
      </div>
    </>
  );
};

const ComingSoonView = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <Card className="max-w-md w-full text-center shadow-soft">
      <CardContent className="p-8">
        <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">
          This feature is coming soon! We're working hard to bring you an amazing {title.toLowerCase()} experience.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default Index;
