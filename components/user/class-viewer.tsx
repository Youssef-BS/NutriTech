"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAliments, mockContraintes, mockRecettes } from "@/lib/classes"

interface ClassViewerProps {
  type: "aliments" | "contraintes" | "recettes" | "nutriments"
}

export default function ClassViewer({ type }: ClassViewerProps) {
  if (type === "aliments") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aliments</CardTitle>
          <CardDescription>Browse available food items and their nutritional information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-left py-2 px-4">Calories</th>
                  <th className="text-left py-2 px-4">Proteins</th>
                  <th className="text-left py-2 px-4">Carbs</th>
                  <th className="text-left py-2 px-4">Fats</th>
                </tr>
              </thead>
              <tbody>
                {mockAliments.map((aliment) => (
                  <tr key={aliment.id} className="border-b hover:bg-accent">
                    <td className="py-2 px-4">{aliment.nom}</td>
                    <td className="py-2 px-4 capitalize">{aliment.categorie}</td>
                    <td className="py-2 px-4">{aliment.calories}</td>
                    <td className="py-2 px-4">{aliment.proteines}g</td>
                    <td className="py-2 px-4">{aliment.glucides}g</td>
                    <td className="py-2 px-4">{aliment.lipides}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === "contraintes") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contraintes Médicales</CardTitle>
          <CardDescription>Medical constraints and dietary restrictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockContraintes.map((contrainte) => (
              <div key={contrainte.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{contrainte.nom}</h3>
                <p className="text-sm text-muted-foreground mb-3">{contrainte.description}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{contrainte.type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === "recettes") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recettes</CardTitle>
          <CardDescription>Browse available recipes and meal ideas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRecettes.map((recette) => (
              <div key={recette.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{recette.nom}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>Prep Time: {recette.tempsPreparation} min</p>
                  <p>Calories: {recette.calories}</p>
                  <p>Ingredients: {recette.ingredients.join(", ")}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{recette.instructions}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutriments</CardTitle>
        <CardDescription>Nutritional information and tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nutriments information coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
