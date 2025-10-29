import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UserProfile as OnboardingProfile } from "./OnboardingFlow";
import {
  Activity,
  Target,
  Droplets,
  Moon,
  ChefHat,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL = "http://localhost:4000";

interface ExtendedUserProfile extends OnboardingProfile {
  name?: string;
}

interface DashboardProps {
  profile: ExtendedUserProfile;
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [dailyData, setDailyData] = useState({
    caloriesConsumed: 0,
    steps: 0,
    waterIntake: 0,
    sleep: 0,
    mood: 3,
  });

  useEffect(() => {
    const fetchProfileAndDashboard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        navigate("/signin");
        return;
      }

      try {
        // 🔹 Fetch profile
        const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (profileRes.status === 404) {
          navigate("/onboarding");
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        // 🔹 Fetch dashboard data
        console.log("🚀 Fetching dashboard data from:", `${API_BASE_URL}/api/dashboard`);
        const dashboardRes = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const dashboardData = await dashboardRes.json();
        const defaultData = {
          caloriesConsumed: 0,
          steps: 0,
          waterIntake: 0,
          sleep: 0,
          mood: 3,
        };

        setDailyData({ ...defaultData, ...dashboardData });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchProfileAndDashboard();
  }, [navigate]);

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your dashboard...
      </div>
    );

  const caloriesRemaining =
    (profile.calorieTarget || 2000) - dailyData.caloriesConsumed;
  const caloriesProgress =
    (dailyData.caloriesConsumed / (profile.calorieTarget || 2000)) * 100;
  const stepsProgress = (dailyData.steps / 10000) * 100;
  const waterProgress = (dailyData.waterIntake / 2.5) * 100;

  const getMoodEmoji = (mood: number) =>
    ["😢", "😕", "😐", "😊", "😄"][mood - 1] || "😐";

  return (
    <>
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {profile.name || "User"} 👋
          </h1>
          <p className="text-muted-foreground">
            Here’s your nutrition and fitness overview for today
          </p>
        </div>

        {/* --- Quick Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Calories */}
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
              <Target className="h-4 w-4 text-food-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dailyData.caloriesConsumed}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {caloriesRemaining > 0
                  ? `${caloriesRemaining} remaining`
                  : `${Math.abs(caloriesRemaining)} over`}
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
              <div className="text-2xl font-bold text-foreground">
                {dailyData.steps.toLocaleString()}
              </div>
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
              <div className="text-2xl font-bold text-foreground">
                {dailyData.waterIntake}L
              </div>
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

        {/* --- Main Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meals Section */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-food-orange" />
                  Today's Meals
                </CardTitle>
                <Button size="sm" className="bg-food-orange hover:bg-food-orange/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Meal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { meal: "Breakfast", desc: "Oatmeal with berries", kcal: 320, macro: "P:12g C:45g F:8g" },
                  { meal: "Lunch", desc: "Grilled chicken salad", kcal: 450, macro: "P:35g C:20g F:22g" },
                  { meal: "Dinner", desc: "Salmon with quinoa", kcal: 480, macro: "P:30g C:35g F:18g" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                    <div>
                      <h4 className="font-semibold">{item.meal}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.kcal} kcal</div>
                      <div className="text-xs text-muted-foreground">{item.macro}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success-green" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Adherence Score</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2 mt-1" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weight Change</span>
                    <span className="font-semibold text-success-green">-0.3kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Workouts</span>
                    <span className="font-semibold">4/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Goal</span>
                    <Badge variant="secondary">{profile.goal || "—"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Diet</span>
                    <Badge variant="outline">{profile.dietType || "—"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cuisine</span>
                    <Badge variant="outline">{profile.cuisine || "—"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Target</span>
                    <span className="font-semibold">{profile.calorieTarget || 2000} kcal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-food-green" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">Generate Weekly Plan</Button>
                  <Button variant="outline" className="w-full justify-start">Find Recipes</Button>
                  <Button variant="outline" className="w-full justify-start">Track Workout</Button>
                  <Button variant="outline" className="w-full justify-start">Shopping List</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
