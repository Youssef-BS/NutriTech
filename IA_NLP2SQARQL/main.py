from fastapi import FastAPI
from typing import Optional
from rdflib.plugins.sparql.parser import parseUpdate
from google import genai
import re
from SPARQLWrapper import SPARQLWrapper, JSON, POST
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi.responses import JSONResponse

client = genai.Client(api_key="AIzaSyBuzdqLkRf0ZRjJWE5G9590eDzrSttM5co")

print("Gemini Client Initialized Successfully.")


import re
from SPARQLWrapper import SPARQLWrapper, POST
from fastapi.responses import JSONResponse
from typing import Optional

def extract_sparql_query(response_text):
    """
    Extract SPARQL query from AI response, handling code blocks and formatting.
    """
    # Remove code block markers if present
    match = re.search(r"```(?:sparql)?\s*(.*?)```", response_text, re.DOTALL)
    if match:
        sparql_query = match.group(1).strip()
    else:
        sparql_query = response_text.strip()
    
    # Clean up any extra whitespace or quotes
    sparql_query = sparql_query.strip('"\'')
    
    return sparql_query

def is_update_query(query):
    query_upper = query.upper()
    update_keywords = ['INSERT', 'DELETE', 'LOAD', 'CLEAR', 'CREATE', 'DROP', 'COPY', 'MOVE', 'ADD']
    # Check if any keyword appears as a whole word
    for keyword in update_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', query_upper):
            return True
    return False

@app.get("/nlp2sparql")
def nlp_2_sparql(prompt: Optional[str] = None):
    """
    Converts a natural language question (prompt) into a SPARQL query
    using the Gemini model and the NutriTech ontology context.
    """

    if not prompt:
        return JSONResponse(
            content={"error": "Missing required parameter: prompt"},
            status_code=400
        )

    model_name = "gemini-2.5-flash"

    # Ontology and instruction context
    ontology_context = f"""
    Use the following prefixes and ontology description to convert the question to a SPARQL query.

    PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    === Ontology Classes ===
    nutritech-ontology-3.Utilisateur
    nutritech-ontology-3.Adulte
    nutritech-ontology-3.Enfant
    nutritech-ontology-3.ContrainteMédicale
    nutritech-ontology-3.AllergieAuGluten
    nutritech-ontology-3.PréférenceAlimentaire
    nutritech-ontology-3.ObjectifPersonnel
    nutritech-ontology-3.ActivitéPhysique
    nutritech-ontology-3.TypeActivite
    nutritech-ontology-3.Aliment
    nutritech-ontology-3.Légume
    nutritech-ontology-3.Nutriment

    === Ontology Properties ===
    nutritech-ontology-3.Age
    nutritech-ontology-3.NomUtilisateurDT
    nutritech-ontology-3.PrenomDT
    nutritech-ontology-3.SexDT
    nutritech-ontology-3.PoidsDT
    nutritech-ontology-3.TailleDT
    nutritech-ontology-3.AlimentNameDT
    nutritech-ontology-3.CaloriesDT
    nutritech-ontology-3.NutrimentNameDT
    nutritech-ontology-3.aContrainte
    nutritech-ontology-3.aObjectif
    nutritech-ontology-3.aPreference
    nutritech-ontology-3.pratique
    nutritech-ontology-3.typeActivitePhysique

    === Ontology Individuals ===
    nutritech-ontology-3.Velo
    nutritech-ontology-3.Marche
    nutritech-ontology-3.Sport
    nutritech-ontology-3.activitéphysique1
    nutritech-ontology-3.Activite1
    nutritech-ontology-3.Activite2
    nutritech-ontology-3.Allergie1
    nutritech-ontology-3.Allergie2
    nutritech-ontology-3.Objectif1
    nutritech-ontology-3.Objectif2
    nutritech-ontology-3.Preference1
    nutritech-ontology-3.Preference2
    nutritech-ontology-3.Karim
    nutritech-ontology-3.Ahmed
    nutritech-ontology-3.Aymen
    nutritech-ontology-3.Carotte
    nutritech-ontology-3.Tomate
    nutritech-ontology-3.Epinard
    nutritech-ontology-3.Laitue
    nutritech-ontology-3.Omega3
    nutritech-ontology-3.VitamineB
    nutritech-ontology-3.Fer
    nutritech-ontology-3.Magnesium

    The question is: "{prompt}"
    the question maybe converted to a query or update sparql
    Note: When referring to a superclass (e.g., Utilisateur), 
    include all its subclasses (e.g., Adulte, Enfant) using rdfs:subClassOf.  
    don't forget to use the prefixes PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    """

    try:
        # Step 1: Generate SPARQL query from AI
        result = client.models.generate_content(
            model=model_name,
            contents=ontology_context
        )

        response_text = result.text if hasattr(result, "text") else str(result)

        # Extract SPARQL query from response
        sparql_query = extract_sparql_query(response_text)

        if not sparql_query:
            raise ValueError("No SPARQL query returned from AI endpoint.")

        print("Final SPARQL to execute:\n", sparql_query)

        
                # Determine query type automatically based on content
        query_upper = sparql_query.strip().upper()
        if is_update_query(query_upper):
             sparql = SPARQLWrapper("http://localhost:3030/ontologie/update") 
             sparql.setMethod(POST)
             sparql.setQuery(sparql_query)

             try:
                results = sparql.query()
             except Exception as e:
                raise RuntimeError(f"SPARQL execution error: {e}")
             results_text = "Updated"
        else:
            sparql = SPARQLWrapper("http://localhost:3030/ontologie/sparql") 
            sparql.setQuery(sparql_query)
            sparql.setReturnFormat(JSON)
            try:
                results = sparql.query()
                 # Convert SPARQL results to JSON format
                results = results.convert()
                print("Results:", results)  # Should show a dictionary, not XML object
            except Exception as e:
                raise RuntimeError(f"SPARQL execution error: {e}")

            # Step 3: Optionally, generate a human-readable response via AI
            response = client.models.generate_content(
                model=model_name,
                contents=f"""Please take the following list of users and reformulate it into a clear, human-readable message:

                {results['results']['bindings']}

                Make it readable and well-presented, for example like:
                - Samir
                - Ahmed
                - Aymen
                - Karim
                """
                        )
            results_text = response.candidates[0].content.parts[0].text

        
              # sparql.setQuery(sparql_query)
      

        return JSONResponse(
            content={"message": results_text},
            status_code=200
        )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

