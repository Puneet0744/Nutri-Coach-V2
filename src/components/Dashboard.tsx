import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, Droplets, Moon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL = "http://localhost:4000";

interface UserProfile {
  name: string;
  calorieTarget?: number;
  // other fields...
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyData, setDailyData] = useState({
    caloriesConsumed: 0,
    steps: 0,
    waterIntake: 0,
    sleep: 0,
    mood: 3,
  });

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          navigate("/onboarding");
          return;
        }

        const data = await res.json();
        setProfile(data);

        // fetch daily stats
        const dailyRes = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const dailyStats = await dailyRes.json();
        setDailyData(dailyStats);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your dashboard...
      </div>
    );

  const caloriesRemaining = (profile.calorieTarget || 2000) - dailyData.caloriesConsumed;
  const caloriesProgress = (dailyData.caloriesConsumed / (profile.calorieTarget || 2000)) * 100;
  const stepsProgress = (dailyData.steps / 10000) * 100;
  const waterProgress = (dailyData.waterIntake / 2.5) * 100;

  const getMoodEmoji = (mood: number) => ["😢", "😕", "😐", "😊", "😄"][mood - 1] || "😐";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {profile.name || "User"} 👋
        </h1>

        <p className="text-muted-foreground mb-8">
          Here’s your nutrition and fitness overview for today
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calories */}
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
              <Target className="h-4 w-4 text-food-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dailyData.caloriesConsumed}</div>
              <div className="text-xs text-muted-foreground mb-2">
                {caloriesRemaining > 0 ? `${caloriesRemaining} remaining` : `${Math.abs(caloriesRemaining)} over`}
              </div>
              <Progress value={caloriesProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Activity className="h-4 w-4 text-fitness-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dailyData.steps.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mb-2">Goal: 10,000</div>
              <Progress value={stepsProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Water */}
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
              <Droplets className="h-4 w-4 text-fitness-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dailyData.waterIntake}L</div>
              <div className="text-xs text-muted-foreground mb-2">Goal: 2.5L</div>
              <Progress value={waterProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Wellness */}
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wellness</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                {getMoodEmoji(dailyData.mood)}
                <span className="text-lg">{dailyData.sleep}h</span>
              </div>
              <div className="text-xs text-muted-foreground">Mood & Sleep</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
