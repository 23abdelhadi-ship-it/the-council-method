# Rapport de fragilité de session

Sujet : Informatiser les stocks de la coopérative Amal ?
Poids : standard · Durée totale : 360 s · Quorum : ATTEINT
Appels : 30 (ronde 1 : 20, ronde 2 : 10) · Échecs : 13
Échecs par classe : timeout × 5 ; 429 (saturation/quotas) × 3 ; 4xx (voie ou modele indisponible) × 3 ; reseau × 1 ; 413 (dossier trop grand pour la voie) × 1

## Membres (ronde 1)

| Membre | Ligne | Modèle déclaré | Modèle servi | Statut | Caractères |
|---|---|---|---|---|---|
| gemini-gemini-3-6-flash | Gemini API | gemini-3.6-flash | gemini-3.6-flash | OK (substantielle) | 4821 |
| gemini-gemini-3-flash-preview | Gemini API | gemini-3-flash-preview | gemini-3-flash-preview | OK (substantielle) | 2562 |
| gemini-gemini-3-8-flash | Gemini API | gemini-3.8-flash | — | ÉCHEC | 0 |
| gemini-gemma-4-31b-it | Gemini API | gemma-4-31b-it | — | ÉCHEC | 0 |
| openrouter-nemotron-3-ultra-550b-a55b-free | OpenRouter | nvidia/nemotron-3-ultra-550b-a55b:free | nvidia/nemotron-3-ultra-550b-a55b:free | OK (substantielle) | 2915 |
| openrouter-north-mini-code-free | OpenRouter | cohere/north-mini-code:free | cohere/north-mini-code:free | OK (substantielle) | 1693 |
| openrouter-ling-3-2-flash-free | OpenRouter | inclusionai/ling-3.2-flash:free | — | ÉCHEC | 0 |
| openrouter-gemma-4-31b-it-free | OpenRouter | google/gemma-4-31b-it:free | — | ÉCHEC | 0 |
| openrouter-nemotron-3-5-lightning-free | OpenRouter | nvidia/nemotron-3.5-lightning:free | — | ÉCHEC | 0 |
| kilo-auto-free | Kilo (sans cle) | kilo-auto/free | reflection/beam-free | OK (substantielle) | 2973 |
| kilo-ling-3-2-flash-free | Kilo (sans cle) | inclusionai/ling-3.2-flash:free | — | ÉCHEC | 0 |
| kilo-ernie-5-5-flash-preview-free | Kilo (sans cle) | baidu/ernie-5.5-flash-preview:free | baidu/ernie-5.5-flash-preview:free | OK (substantielle) | 7160 |
| groq-gpt-oss-120b | Groq | openai/gpt-oss-120b | openai/gpt-oss-120b | OK (substantielle) | 1861 |
| groq-qwen3-8-27b | Groq | qwen/qwen3.8-27b | qwen/qwen3.8-27b | OK (substantielle) | 4237 |
| cerebras-gpt-oss-120b | Cerebras | gpt-oss-120b | — | ÉCHEC | 0 |
| cerebras-qwen-3-8-27b | Cerebras | qwen-3.8-27b | — | ÉCHEC | 0 |
| cohere-command-a-03-2025 | Cohere | command-a-03-2025 | command-a-03-2025 | OK (substantielle) | 1833 |
| nvidia-deepseek-r1 | NVIDIA | deepseek-ai/deepseek-r1 | — | ÉCHEC | 0 |
| zai-glm-4-5-flash | Z.AI | glm-4.5-flash | glm-4.5-flash | OK (substantielle) | 3861 |
| freellmapi-auto | FreeLLMAPI (local) | auto | — | ÉCHEC | 0 |

## Écarts d'identité déclaré/servi

- **kilo-auto-free** : déclaré « kilo-auto/free », servi « reflection/beam-free » — à vérifier par le président (les lignes agrégées peuvent servir un autre modèle que leur nom).
