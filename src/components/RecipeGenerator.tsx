import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils, Star } from "lucide-react";
import { UserProfile } from "./OnboardingFlow";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servings: number;
  cookTime: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  pantryMatch: number;
}

interface RecipeGeneratorProps {
  profile: UserProfile;
}

const RecipeGenerator = ({ profile }: RecipeGeneratorProps) => {
  const [availableIngredients, setAvailableIngredients] = useState(profile.pantryItems);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const mockRecipes: Recipe[] = [
    {
      id: "1",
      name: "Mediterranean Chicken Bowl",
      calories: 485,
      protein: 35,
      carbs: 28,
      fats: 22,
      servings: 2,
      cookTime: 25,
      difficulty: "Medium",
      ingredients: [
        "200g chicken breast",
        "1 cup quinoa",
        "1 cucumber",
        "200g cherry tomatoes",
        "100g feta cheese",
        "2 tbsp olive oil",
        "1 lemon",
        "Fresh herbs"
      ],
      instructions: [
        "Season and grill chicken breast until cooked through (165°F internal temp)",
        "Cook quinoa according to package instructions",
        "Dice cucumber and halve cherry tomatoes",
        "Crumble feta cheese",
        "Make dressing with olive oil, lemon juice, and herbs",
        "Assemble bowl with quinoa base, top with chicken and vegetables",
        "Drizzle with dressing and serve"
      ],
      tags: ["High Protein", "Mediterranean", "Gluten-Free"],
      pantryMatch: 75
    },
    {
      id: "2",
      name: "Veggie Stir-Fry with Tofu",
      calories: 320,
      protein: 18,
      carbs: 35,
      fats: 12,
      servings: 2,
      cookTime: 15,
      difficulty: "Easy",
      ingredients: [
        "200g firm tofu",
        "1 bell pepper",
        "1 broccoli head",
        "1 carrot",
        "2 cloves garlic",
        "2 tbsp soy sauce",
        "1 tbsp sesame oil",
        "1 tsp ginger"
      ],
      instructions: [
        "Press tofu and cut into cubes",
        "Chop all vegetables into bite-sized pieces",
        "Heat sesame oil in large pan or wok",
        "Sauté tofu until golden, remove and set aside",
        "Stir-fry vegetables starting with harder ones first",
        "Add garlic and ginger, cook for 30 seconds",
        "Return tofu to pan, add soy sauce",
        "Toss everything together and serve hot"
      ],
      tags: ["Vegetarian", "Quick", "Asian"],
      pantryMatch: 85
    },
    {
      id: "3",
      name: "Salmon with Sweet Potato",
      calories: 520,
      protein: 32,
      carbs: 42,
      fats: 20,
      servings: 1,
      cookTime: 30,
      difficulty: "Medium",
      ingredients: [
        "150g salmon fillet",
        "1 large sweet potato",
        "100g asparagus",
        "1 tbsp olive oil",
        "1 lemon",
        "Salt and pepper",
        "Fresh dill"
      ],
      instructions: [
        "Preheat oven to 400°F (200°C)",
        "Cube sweet potato and toss with olive oil",
        "Roast sweet potato for 20 minutes",
        "Season salmon with salt, pepper, and lemon",
        "Add salmon and asparagus to pan",
        "Roast for 12-15 minutes until salmon flakes easily",
        "Garnish with fresh dill and lemon wedge"
      ],
      tags: ["High Protein", "Omega-3", "Paleo"],
      pantryMatch: 60
    }
  ];

  const generateRecipes = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter recipes based on diet type
    let filteredRecipes = mockRecipes;
    
    if (profile.dietType === "vegetarian" || profile.dietType === "vegan") {
      filteredRecipes = mockRecipes.filter(recipe => 
        recipe.tags.includes("Vegetarian") || recipe.tags.includes("Vegan")
      );
    }
    
    setRecipes(filteredRecipes);
    setIsGenerating(false);
    
    toast({
      title: "Recipes Generated!",
      description: `Found ${filteredRecipes.length} recipes matching your preferences.`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-success-green";
      case "medium": return "bg-food-orange";
      case "hard": return "bg-food-red";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Recipe Generator
          </h1>
          <p className="text-muted-foreground">
            Get personalized recipes based on your pantry and preferences
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-food-orange" />
              Available Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border rounded-md min-h-24 resize-none"
                value={availableIngredients}
                onChange={(e) => setAvailableIngredients(e.target.value)}
                placeholder="Enter ingredients you have: chicken, rice, onions, tomatoes..."
              />
              <Button 
                onClick={generateRecipes}
                disabled={isGenerating}
                className="bg-food-orange hover:bg-food-orange/90"
              >
                {isGenerating ? "Generating..." : "Generate Recipes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="shadow-soft hover:shadow-deep transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`${getDifficultyColor(recipe.difficulty)} text-white`}
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.cookTime}m
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {recipe.pantryMatch}% match
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Nutrition Info */}
                  <div className="mb-4 p-3 bg-gradient-card rounded-lg">
                    <div className="text-lg font-semibold text-center mb-2">
                      {recipe.calories} kcal
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{recipe.protein}g</div>
                        <div className="text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{recipe.carbs}g</div>
                        <div className="text-muted-foreground">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{recipe.fats}g</div>
                        <div className="text-muted-foreground">Fats</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-1">
                      <Utensils className="h-4 w-4" />
                      Ingredients
                    </h4>
                    <ul className="text-sm space-y-1">
                      {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {ingredient}
                        </li>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <li className="text-muted-foreground">
                          + {recipe.ingredients.length - 4} more ingredients
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Full Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {recipes.length === 0 && !isGenerating && (
          <Card className="text-center py-12 shadow-soft">
            <CardContent>
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Cook?</h3>
              <p className="text-muted-foreground mb-4">
                Add your available ingredients and let our AI generate personalized recipes for you.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;