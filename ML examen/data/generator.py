import pandas as pd
import os

def check_winner(b):
    wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for c in wins:
        if b[c[0]] == b[c[1]] == b[c[2]] != "": return b[c[0]]
    return "Draw" if "" not in b else None

def minimax(b, is_max):
    res = check_winner(b)
    if res == "X": return 1
    if res == "O": return -1
    if res == "Draw": return 0
    
    scores = []
    for i in range(9):
        if b[i] == "":
            b[i] = "X" if is_max else "O"
            scores.append(minimax(b, not is_max))
            b[i] = ""
    return max(scores) if is_max else min(scores)

def generate_all_states():
    all_rows = []
    seen = set()

    def backtrack(b, turn):
        key = "".join([x if x != "" else "." for x in b])
        if key in seen: return
        seen.add(key)

        # Encodage 18 colonnes
        row = []
        for cell in b:
            row.extend([1 if cell == "X" else 0, 1 if cell == "O" else 0])
        
        # Labels via Minimax
        res = minimax(list(b), True if turn == "X" else False)
        row.extend([1 if res == 1 else 0, 1 if res == 0 else 0])
        all_rows.append(row)

        if check_winner(b): return

        for i in range(9):
            if b[i] == "":
                b[i] = turn
                backtrack(b, "O" if turn == "X" else "X")
                b[i] = ""

    backtrack([""]*9, "X")
    
    cols = []
    for i in range(9): cols.extend([f"c{i}_x", f"c{i}_o"])
    cols.extend(["x_wins", "is_draw"])
    
    df = pd.DataFrame(all_rows, columns=cols)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/dataset.csv', index=False)
    print(f"Dataset généré : {len(df)} lignes.")

if __name__ == "__main__":
    generate_all_states()