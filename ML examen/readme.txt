Groupe: Fi/Mi
Membres du groupe: -ANDRIAMBOLASOA Radoniaina Fitahiana (num 16)
		   -ANDRIAMIHAJAMANANA Mialitiana (num 17)
Filière: ESIIA 4



5-Réponses (Q1-Q4)

Q1- Analyse des coefficients

--> Pour le modèle x_wins, c4_x est le coefficient le plus élevé car si X occupe le centre, ses chances de gagner augmentent sévèrement. Inversement, un coefficient négatif élevé pour ci_o indique qu'une occupation par l'adversaire (O) réduit fortement les chances de victoire de X.

 
--> Oui, la case centrale est influente car elle fait partie de 4 alignements gagnants possibles (horizontale, verticale et les deux diagonales), contrairement aux bords (3 alignements) ou aux coins (3 alignements).

--> Avec la stratégie humaine c'est cohérente pour prendre le centre dès le premier tour est l'ouverture la plus forte pour maximiser les options d'attaque et bloquer l'adversaire.



Q2- Déséquilibre des classes 

--> Le dataset sera déséquilibré. Pour is_draw = 1, en jouant parfaitement, la majorité des parties se terminent par une nulle. Et entre x_wins = 1 et x_wins =0, les états menant à une victoire forcée de X sont moins nombreux que ceux menant à une nulle ou une défaite.

--> Il faut privilégier le F1-Score ou l'AUC plutôt que l'accuracy car l'accuracy est trompeuse sur un dataset déséquilibré. Si 90% des positions mènent à une nulle, un modèle qui prédit "nulle" tout le temps aura 90% d'accuracy mais sera inutile pour jouer. Le F1-Score assure que le modèle est performant sur les classes minoritaires (victoires).


Q3- Comparaison des deux modèles 

--> Le modèle x_wins obtient le meilleure score que is_draw car x_wins est souvent lié à des motifs géométriques simples (alignements immédiats).Et is_draw est plus difficile car il nécessite de reconnaître que toutes les voies de victoire sont bloquées, ce qui implique une analyse plus globale et subtile du plateau.

--> Les modèles se trompent souvent quand un joueur prépare deux alignements simultanés ou dans les états de fin de partie très denses où un seul coup change radicalement l'issue théorique.


Q4- Mode hybride Différence de comportement 


--> En IA-ML pur, la probabilité nulle monte peu à peu

-->En mode hybride, Le joueur hybride semble plus "prudent" et tactiquement infaillible sur le court terme, tout en ayant une meilleure vision stratégique globale grâce aux probabilités fournies par le modèle ML.



	