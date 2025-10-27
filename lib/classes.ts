// Data classes and types for NutriTech

export interface ActivitePhysique {
  id: string
  nom: string
  intensite: "faible" | "modérée" | "élevée"
  caloriesBrulees: number
}

export interface Aliment {
  id: string
  nom: string
  categorie: string
  calories: number
  proteines: number
  glucides: number
  lipides: number
}

export interface ContrainteMedicale {
  id: string
  nom: string
  type: "allergieAuGluten" | "diabete" | "intoléranceAuLactose" | "obésité"
  description: string
}

export interface Nutriment {
  id: string
  nom: string
  unite: string
  valeurQuotidienne: number
}

export interface ObjectifPersonnel {
  id: string
  nom: string
  description: string
  dateDebut: Date
  dateFin: Date
}

export interface PreferenceAlimentaire {
  id: string
  userId: string
  alimentsPreferences: string[]
  alimentsEvites: string[]
}

export interface Recette {
  id: string
  nom: string
  ingredients: string[]
  instructions: string
  tempsPreparation: number
  calories: number
}

export interface Utilisateur {
  id: string
  email: string
  nom: string
  type: "adulte" | "enfant"
  age: number
  poids: number
  taille: number
  role: "admin" | "user"
}


const FUSEKI_ENDPOINT = "http://localhost:3030/ontologie/query"; // change this to your actual Fuseki endpoint


async function getAlimenDataByName(name: string ): Promise<any> {
  const prefixes = `
    PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  `;
    // Example: Query aliment by name
    const query = `
    ${prefixes}
    SELECT ?aliment ?property ?value
    WHERE {
      ?aliment rdf:type ?type .
      ?type rdfs:subClassOf* nutri:Aliment .
      ?aliment ?property ?value .
      ?aliment nutri:AlimentNameDT ?label .
      FILTER(CONTAINS(LCASE(?label), LCASE("${name}")))
    }
  `;
  const url = `${FUSEKI_ENDPOINT}?query=${encodeURIComponent(query)}`;
  // Send request to Fuseki
  const response = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
  });

  const json = await response.json();

  // Extract results
  const results = json.results.bindings.map((b: any) => ({
    aliment: b.aliment?.value,
    property: b.property?.value,
    value: b.value?.value,
  }));

  return results;
} 

// Mock data for demonstration
export const mockAliments: Aliment[] =
 [
  { id: "1", nom: "Riz", categorie: "cereal", calories: 130, proteines: 2.7, glucides: 28, lipides: 0.3 },
  { id: "2", nom: "Pomme", categorie: "fruit", calories: 52, proteines: 0.3, glucides: 14, lipides: 0.2 },
  { id: "3", nom: "Carotte", categorie: "legume", calories: 41, proteines: 0.9, glucides: 10, lipides: 0.2 },
  { id: "4", nom: "Poulet", categorie: "viande", calories: 165, proteines: 31, glucides: 0, lipides: 3.6 },
  { id: "5", nom: "Lentilles", categorie: "proteineVegetale", calories: 116, proteines: 9, glucides: 20, lipides: 0.4 },
]

export const mockContraintes: ContrainteMedicale[] = [
  { id: "1", nom: "Allergie au Gluten", type: "allergieAuGluten", description: "Intolérance au gluten" },
  { id: "2", nom: "Diabète", type: "diabete", description: "Diabète de type 2" },
  { id: "3", nom: "Intolérance au Lactose", type: "intoléranceAuLactose", description: "Intolérance au lactose" },
  { id: "4", nom: "Obésité", type: "obésité", description: "Gestion du poids" },
]

export const mockRecettes: Recette[] = [
  {
    id: "1",
    nom: "Salade de Poulet",
    ingredients: ["Poulet", "Laitue", "Tomate", "Concombre"],
    instructions: "Mélanger tous les ingrédients",
    tempsPreparation: 15,
    calories: 250,
  },
  {
    id: "2",
    nom: "Riz aux Légumes",
    ingredients: ["Riz", "Carotte", "Pois", "Oignon"],
    instructions: "Cuire le riz et ajouter les légumes",
    tempsPreparation: 30,
    calories: 350,
  },
]
