# Git

- **Каждая задача — в отдельной ветке** от свежего `main`: `feature/<номер>-<кратко>` (`feature/1-workspace`),
  исправления — `fix/<кратко>`. В `main` — только через PR после зелёного CI, напрямую не коммитим. Перед мёржем
  ветку ребейзим на свежий `main` (`git rebase main`, `git push --force-with-lease`), мёрж — «Create a merge commit».
- Коммиты — `[тип] Кратко в повелительном наклонении` по-английски: `[feat] 2: Theme tokens`,
  `[fix] …`, `[refactor] …`, `[docs] …`, `[ci] …`, `[chore] …`.
