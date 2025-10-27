"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { mockAliments, mockContraintes, mockRecettes } from "@/lib/classes"

export default function ClassManager() {
  const [aliments] = useState(mockAliments)
  const [contraintes] = useState(mockContraintes)
  const [recettes] = useState(mockRecettes)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Management</CardTitle>
        <CardDescription>Manage all system classes and data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aliments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aliments">Aliments</TabsTrigger>
            <TabsTrigger value="contraintes">Contraintes</TabsTrigger>
            <TabsTrigger value="recettes">Recettes</TabsTrigger>
          </TabsList>

          {/* Aliments Tab */}
          <TabsContent value="aliments" className="mt-6">
            <div className="space-y-4">
              <Button className="gap-2">
                <Plus size={16} />
                Add Aliment
              </Button>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Category</th>
                      <th className="text-left py-2 px-4">Calories</th>
                      <th className="text-left py-2 px-4">Proteins</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aliments.map((aliment) => (
                      <tr key={aliment.id} className="border-b hover:bg-accent">
                        <td className="py-2 px-4">{aliment.nom}</td>
                        <td className="py-2 px-4 capitalize">{aliment.categorie}</td>
                        <td className="py-2 px-4">{aliment.calories}</td>
                        <td className="py-2 px-4">{aliment.proteines}g</td>
                        <td className="py-2 px-4 flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Contraintes Tab */}
          <TabsContent value="contraintes" className="mt-6">
            <div className="space-y-4">
              <Button className="gap-2">
                <Plus size={16} />
                Add Contrainte
              </Button>
              <div className="space-y-2">
                {contraintes.map((contrainte) => (
                  <div key={contrainte.id} className="p-4 border rounded-lg flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{contrainte.nom}</h3>
                      <p className="text-sm text-muted-foreground">{contrainte.description}</p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2 inline-block">
                        {contrainte.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recettes Tab */}
          <TabsContent value="recettes" className="mt-6">
            <div className="space-y-4">
              <Button className="gap-2">
                <Plus size={16} />
                Add Recette
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recettes.map((recette) => (
                  <div key={recette.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{recette.nom}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p>Time: {recette.tempsPreparation} min</p>
                      <p>Calories: {recette.calories}</p>
                      <p>Ingredients: {recette.ingredients.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-red-500 hover:text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
