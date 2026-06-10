# kikwit_backend
# Système de Gestion des Établissements de Santé

Ce projet repose sur un modèle de données conçu pour centraliser les informations administratives, techniques et financières des établissements de santé.

## 📋 Description du Modèle

Le diagramme représente la structure relationnelle des données permettant de suivre la performance et les ressources des centres médicaux.

### Entités Principales

| Entité | Description |
| :--- | :--- |
| **ETABLISSEM** | Table centrale contenant l'identifiant (PK), le nom, la zone et la province. |
| **CATEO** | Catégorisation des établissements. |
| **Cartographie_struct** | Informations géographiques et techniques (Population couverte, présence de bloc opératoire, capacité de transfusion). |
| **Indicateur_Tech** | Suivi des indicateurs de santé (Césariennes, infections, hospitalisations, taux de mortalité néonatale). |
| **Financé_di** | Gestion budgétaire par période (Capital de départ vs Capital de fin). |
| **Personnel** | Registre des agents (Matricules, noms, statut). |
| **Source** | Suivi des sources d'énergie (SNEEL, Panneaux solaires). |

## 🔗 Relations Clés

* **Établissement ↔ Catégorie** : Un établissement appartient à une catégorie spécifique (1:1).
* **Établissement ↔ Indicateurs** : Un établissement génère plusieurs indicateurs techniques au fil du temps (1:N).
* **Établissement ↔ Personnel** : Un établissement emploie plusieurs agents (1:N).
* **Établissement ↔ Source** : Un établissement peut être alimenté par différentes sources d'énergie.

## 🛠️ Spécifications Techniques

* **Identifiants** : Utilisation de clés primaires `Id (PK)` et de clés étrangères `Id_ESS (FK)` pour assurer l'intégrité référentielle.
* **Indicateurs de Performance** : Le système permet de calculer des ratios basés sur les accouchements, les chirurgies et les données de transfusion.