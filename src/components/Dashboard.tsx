import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Target, 
  Droplets, 
  Moon, 
  ChefHat, 
  Calendar,
  TrendingUp,
  Plus
} from "lucide-react";
import { UserProfile } from "./OnboardingFlow";

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard = ({ profile }: DashboardProps) => {
  const [dailyData, setDailyData] = useState({
    caloriesConsumed: 1250,
    steps: 7800,
    waterIntake: 1.8,
    sleep: 7.5,
    mood: 4
  });

  const caloriesRemaining = (profile.calorieTarget || 2000) - dailyData.caloriesConsumed;
  const caloriesProgress = (dailyData.caloriesConsumed / (profile.calorieTarget || 2000)) * 100;
  
  const stepsProgress = (dailyData.steps / 10000) * 100;
  const waterProgress = (dailyData.waterIntake / 2.5) * 100;

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😕", "😐", "😊", "😄"];
    return emojis[mood - 1] || "😐";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your nutrition and fitness overview for today
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Calories */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
              <Target className="h-4 w-4 text-food-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dailyData.caloriesConsumed}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {caloriesRemaining > 0 ? `${caloriesRemaining} remaining` : `${Math.abs(caloriesRemaining)} over`}
              </div>
              <Progress value={caloriesProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Activity className="h-4 w-4 text-fitness-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dailyData.steps.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Goal: 10,000
              </div>
              <Progress value={stepsProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Water */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
              <Droplets className="h-4 w-4 text-fitness-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dailyData.waterIntake}L
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Goal: 2.5L
              </div>
              <Progress value={waterProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Mood & Sleep */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellness</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                {getMoodEmoji(dailyData.mood)}
                <span className="text-lg">{dailyData.sleep}h</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Mood & Sleep
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Meals */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-food-orange" />
                  Today's Meals
                </CardTitle>
                <Button size="sm" className="bg-food-orange hover:bg-food-orange/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Breakfast */}
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                  <div>
                    <h4 className="font-semibold">Breakfast</h4>
                    <p className="text-sm text-muted-foreground">Oatmeal with berries</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">320 kcal</div>
                    <div className="text-xs text-muted-foreground">P:12g C:45g F:8g</div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                  <div>
                    <h4 className="font-semibold">Lunch</h4>
                    <p className="text-sm text-muted-foreground">Grilled chicken salad</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">450 kcal</div>
                    <div className="text-xs text-muted-foreground">P:35g C:20g F:22g</div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                  <div>
                    <h4 className="font-semibold">Dinner</h4>
                    <p className="text-sm text-muted-foreground">Salmon with quinoa</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">480 kcal</div>
                    <div className="text-xs text-muted-foreground">P:30g C:35g F:18g</div>
                  </div>
                </div>
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
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Weight Change</span>
                      <span className="font-semibold text-success-green">-0.3kg</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Workouts</span>
                      <span className="font-semibold">4/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Profile Summary */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Goal</span>
                    <Badge variant="secondary">{profile.goal}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Diet</span>
                    <Badge variant="outline">{profile.dietType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cuisine</span>
                    <Badge variant="outline">{profile.cuisine}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Target</span>
                    <span className="font-semibold">{profile.calorieTarget} kcal</span>
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
                  <Button variant="outline" className="w-full justify-start">
                    Generate Weekly Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Find Recipes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Track Workout
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Shopping List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;