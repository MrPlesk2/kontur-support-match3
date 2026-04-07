import { useCallback, useRef } from "react";
import {
  Board,
  Match,
  GameModifiers,
  ActiveBonus,
  Bonus,
  Goal,
  Level,
  SpecialCell,
  Position,
  BonusType,
  Figure,
  FigureType,
  createFigure,
} from "types";
import { ANIMATION_DURATION, BOARD_ROWS } from "consts";
import {
  findAllMatches,
  updateBoardAfterMatches,
  applyGravity,
  fillEmptySlots,
  applyHorizontalGravity,
  shuffleBoardWithoutMatches,
} from "@utils/game-logic";
import { BONUS_EFFECTS } from "@utils/bonus-effects";
import { calculateRoundScore } from "@utils/modifiers-utils";
import {
  progressTeamHappyOne,
  progressTeamHappyTwo,
  progressTeamHappyThree,
} from "@utils/game-team-utils";

type UseMatchProcessingProps = {
  setBoard: (board: Board) => void;
  setMatches: (matches: Match[]) => void;
  setScore: (updater: (score: number) => number) => void;
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void;
  modifiers: GameModifiers;
  setModifiers: (modifiers: GameModifiers) => void;
  activeBonus: ActiveBonus | null;
  setActiveBonus: (bonus: ActiveBonus | null) => void;
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void;
  currentLevel?: Level;
  onSpecialCellsUpdate?: (specialCells: SpecialCell[]) => void;
  onShuffleWarning?: () => void;
};

const DEBUG_MATCH_PROCESSING = true;
const log = (...args: any[]) => {
  if (DEBUG_MATCH_PROCESSING) console.log(...args);
};

const normalizeBoard = (inputBoard: Board): Board => {
  const rows = inputBoard.length;
  const cols = inputBoard[0]?.length ?? 0;

  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => inputBoard[r]?.[c] ?? null)
  );
};

const makeStableFigure = (type: FigureType, row: number, col: number) =>
  createFigure(type, `${type}-${row}-${col}`);

export const useMatchProcessing = ({
  setBoard,
  setMatches,
  setScore,
  setGoals,
  modifiers,
  setModifiers,
  activeBonus,
  setActiveBonus,
  setBonuses,
  currentLevel,
  onSpecialCellsUpdate,
  onShuffleWarning,
}: UseMatchProcessingProps) => {
  const isProcessingMatchesRef = useRef(false);
  const MAX_SHUFFLE_ATTEMPTS = 7;

  const getRandomBonus = useCallback((): BonusType => {
    const allBonuses: BonusType[] = [
      "friendlyTeam",
      "careerGrowth",
      "sportCompensation",
      "knowledgeBase",
      "remoteWork",
      "openGuide",
      "modernProducts",
      "dms",
    ];
    return allBonuses[Math.floor(Math.random() * allBonuses.length)];
  }, []);

  const getRandomFigure = useCallback(
    (availableFigures: FigureType[], excludeFigures: FigureType[] = []): FigureType => {
      const forbidden: FigureType[] = [
        "star",
        "diamond",
        "team",
        "teamImage0",
        "teamImage1",
        "teamImage2",
        "teamImage3",
        "goldenCell",
        "teamCell",
      ];

      const filteredFigures = availableFigures.filter(
        (fig) => !forbidden.includes(fig)
      );

      const availableFiltered = filteredFigures.filter(
        (fig) => !excludeFigures.includes(fig)
      );

      if (availableFiltered.length > 0) {
        return availableFiltered[Math.floor(Math.random() * availableFiltered.length)];
      }

      return filteredFigures[Math.floor(Math.random() * filteredFigures.length)];
    },
    []
  );

  const replaceCompletedGoalsForLevel6 = useCallback(
    (goals: Goal[]): { goals: Goal[]; bonuses: BonusType[] } => {
      if (currentLevel?.id !== 6) return { goals, bonuses: [] };

      const updatedGoals = [...goals];
      const completedIndices: number[] = [];
      const newBonuses: BonusType[] = [];

      updatedGoals.forEach((goal, index) => {
        if (goal.collected >= goal.target) {
          completedIndices.push(index);
          newBonuses.push(getRandomBonus());
        }
      });

      if (completedIndices.length > 0) {
        completedIndices.forEach((index) => {
          const currentFigures = updatedGoals.map((g) => g.figure);
          const newFigure = getRandomFigure(
            currentLevel.availableFigures || [],
            currentFigures
          );
          const newTarget = updatedGoals[index].target + 1;

          updatedGoals[index] = {
            figure: newFigure,
            target: newTarget,
            collected: 0,
          };
        });
      }

      return { goals: updatedGoals, bonuses: newBonuses };
    },
    [currentLevel, getRandomBonus, getRandomFigure]
  );

  const checkPossibleMoves = useCallback((board: Board): boolean => {
    const safeBoard = normalizeBoard(board);
    const rows = safeBoard.length;
    const cols = safeBoard[0].length;

    const UNMOVABLE_FIGURES: FigureType[] = [
      "team",
      "teamImage0",
      "teamImage1",
      "teamImage2",
      "teamImage3",
      "goldenCell",
      "teamCell",
    ];

    const canSwapFigure = (figure: Figure | null): boolean => {
      if (!figure) return false;
      if (UNMOVABLE_FIGURES.includes(figure.type)) return false;
      return true;
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentFigure = safeBoard[row][col];
        if (!canSwapFigure(currentFigure)) continue;

        if (col < cols - 1) {
          const rightFigure = safeBoard[row][col + 1];
          if (canSwapFigure(rightFigure)) {
            if (currentFigure?.type === "star" && rightFigure?.type === "star") {
              continue;
            }

            const tempBoard = safeBoard.map((r) => [...r]);
            tempBoard[row][col] = rightFigure;
            tempBoard[row][col + 1] = currentFigure;

            if (findAllMatches(tempBoard).length > 0) {
              return true;
            }
          }
        }

        if (row < rows - 1) {
          const bottomFigure = safeBoard[row + 1][col];
          if (canSwapFigure(bottomFigure)) {
            if (currentFigure?.type === "star" && bottomFigure?.type === "star") {
              continue;
            }

            const tempBoard = safeBoard.map((r) => [...r]);
            tempBoard[row][col] = bottomFigure;
            tempBoard[row + 1][col] = currentFigure;

            if (findAllMatches(tempBoard).length > 0) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }, []);

  const applyGravityAndFillStepwise = async (
    boardState: Board,
    level?: Level
  ): Promise<Board> => {
    let boardToProcess = boardState;

    while (boardToProcess.some((row) => row.some((cell) => cell === null))) {
      boardToProcess = applyGravity(boardToProcess);
      setBoard([...boardToProcess]);
      await new Promise((r) => setTimeout(r, ANIMATION_DURATION));

      if (level?.id === 5) {
        const horizontalResult = applyHorizontalGravity(boardToProcess);
        if (horizontalResult.isChanged) {
          boardToProcess = horizontalResult.board;
          setBoard([...boardToProcess]);
          await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
        }
      }

      boardToProcess = fillEmptySlots(boardToProcess, level);
      setBoard([...boardToProcess]);
      await new Promise((r) => setTimeout(r, ANIMATION_DURATION));

      if (level?.id === 5) {
        const horizontalResult = applyHorizontalGravity(boardToProcess);
        if (horizontalResult.isChanged) {
          boardToProcess = horizontalResult.board;
          setBoard([...boardToProcess]);
          await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
        }
      }
    }

    return boardToProcess;
  };

  const processMatches = useCallback(
    async (
      currentBoard: Board,
      currentSpecialCells: SpecialCell[] = [],
      options?: { skipGoldenRestore: boolean }
    ): Promise<Board> => {
      if (isProcessingMatchesRef.current) {
        console.warn("processMatches: already running, skipping duplicate call");
        return currentBoard;
      }

      isProcessingMatchesRef.current = true;

      const skipGoldenRestore = options?.skipGoldenRestore || false;

      let boardToProcess = currentBoard;
      let hasMatches = true;
      let totalRoundScore = 0;
      let usedModifiers = false;

      const initialSpecialCells =
        currentSpecialCells.length > 0
          ? currentSpecialCells
          : currentLevel?.specialCells || [];
      const updatedSpecialCells: SpecialCell[] = [...initialSpecialCells];

      let appliedLevel6Bonuses = 0;

      try {
        while (hasMatches) {
          const foundMatches = findAllMatches(boardToProcess);

          if (foundMatches.length > 0) {
            const goldenCellsInMatchesSet = new Set<string>();
            let collectedTeamMatches = 0;

            foundMatches.forEach((match) => {
              let matchHasTeam = false;

              match.positions.forEach((pos) => {
                const goldenCellIndex = updatedSpecialCells.findIndex(
                  (cell) =>
                    cell.row === pos.row &&
                    cell.col === pos.col &&
                    cell.type === "golden" &&
                    cell.isActive !== false
                );

                if (goldenCellIndex !== -1) {
                  goldenCellsInMatchesSet.add(`${pos.row},${pos.col}`);
                  updatedSpecialCells[goldenCellIndex] = {
                    ...updatedSpecialCells[goldenCellIndex],
                    isActive: false,
                  };
                }

                const teamCellIndex = updatedSpecialCells.findIndex(
                  (cell) =>
                    cell.row === pos.row &&
                    cell.col === pos.col &&
                    cell.type === "team" &&
                    cell.isActive !== false
                );

                if (teamCellIndex !== -1) {
                  matchHasTeam = true;
                }
              });

              if (matchHasTeam) {
                collectedTeamMatches += 1;
              }
            });

            const goldenCellsInMatches: Position[] = Array.from(
              goldenCellsInMatchesSet
            ).map((key) => {
              const [row, col] = key.split(",").map(Number);
              return { row, col };
            });

            if (onSpecialCellsUpdate) {
              onSpecialCellsUpdate(updatedSpecialCells);
            }

            if (goldenCellsInMatches.length > 0) {
              setGoals((prev) => {
                const next = [...prev];
                const idx = next.findIndex((g) => g.figure === "goldenCell");
                if (idx !== -1) {
                  const inc = modifiers.doubleGoalProgress
                    ? goldenCellsInMatches.length * 2
                    : goldenCellsInMatches.length;
                  next[idx] = {
                    ...next[idx],
                    collected: Math.min(next[idx].collected + inc, next[idx].target),
                  };
                }
                return next;
              });
            }

            if (collectedTeamMatches > 0) {
              setGoals((prev) => {
                const next = [...prev];
                const teamGoalIndex = next.findIndex((g) => g.figure === "teamCell");

                if (teamGoalIndex !== -1) {
                  const teamGoal = next[teamGoalIndex];
                  const inc = modifiers.doubleGoalProgress
                    ? collectedTeamMatches * 2
                    : collectedTeamMatches;
                  const oldCollected = teamGoal.collected;
                  const newCollected = Math.min(
                    oldCollected + inc,
                    teamGoal.target
                  );

                  next[teamGoalIndex] = {
                    ...teamGoal,
                    collected: newCollected,
                  };

                  if (currentLevel?.id === 5) {
                    if (newCollected >= 14 && oldCollected < 14) {
                      boardToProcess = progressTeamHappyThree(boardToProcess);
                      setBoard([...boardToProcess]);
                    } else if (newCollected >= 9 && oldCollected < 9) {
                      boardToProcess = progressTeamHappyTwo(boardToProcess);
                      setBoard([...boardToProcess]);
                    } else if (newCollected >= 4 && oldCollected < 4) {
                      boardToProcess = progressTeamHappyOne(boardToProcess);
                      setBoard([...boardToProcess]);
                    }
                  }
                }

                return next;
              });
            }

            setGoals((prevGoals) => {
              const updatedGoals = [...prevGoals];
              const figureCountMap = new Map<FigureType, number>();

              foundMatches.forEach((match) => {
                match.positions.forEach((pos) => {
                  const figure = boardToProcess[pos.row][pos.col];
                  if (
                    figure &&
                    figure.type !== "teamCell" &&
                    figure.type !== "goldenCell"
                  ) {
                    const count = figureCountMap.get(figure.type) || 0;
                    figureCountMap.set(figure.type, count + 1);
                  }
                });
              });

              updatedGoals.forEach((goal, index) => {
                if (figureCountMap.has(goal.figure)) {
                  const count = figureCountMap.get(goal.figure)!;
                  const increment = modifiers.doubleGoalProgress
                    ? count * 2
                    : count;
                  updatedGoals[index] = {
                    ...goal,
                    collected: Math.min(goal.collected + increment, goal.target),
                  };
                }
              });

              return updatedGoals;
            });

            const roundScore = calculateRoundScore(foundMatches, modifiers);
            totalRoundScore += roundScore;

            if (modifiers.doublePoints || modifiers.doubleGoalProgress) {
              usedModifiers = true;
            }

            setMatches(foundMatches);
            await new Promise((r) => setTimeout(r, ANIMATION_DURATION));

            boardToProcess = updateBoardAfterMatches(boardToProcess);
            setBoard(boardToProcess);
            await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
            setMatches([]);

            const lvl = currentLevel
              ? { ...currentLevel, specialCells: updatedSpecialCells }
              : undefined;

            boardToProcess = await applyGravityAndFillStepwise(
              boardToProcess,
              lvl
            );

            updatedSpecialCells.forEach((sc) => {
              if (!skipGoldenRestore && sc.type === "golden" && sc.isActive !== false) {
                if (
                  boardToProcess[sc.row] &&
                  boardToProcess[sc.row][sc.col] === null
                ) {
                  boardToProcess[sc.row][sc.col] = makeStableFigure(
                    "goldenCell",
                    sc.row,
                    sc.col
                  );
                }
              }
            });

            setBoard([...boardToProcess]);
            await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
          }

          const diamondsToRemove: Position[] = [];
          for (let col = 0; col < boardToProcess[0].length; col++) {
            if (boardToProcess[BOARD_ROWS - 1]?.[col]?.type === "diamond") {
              diamondsToRemove.push({ row: BOARD_ROWS - 1, col });
            }
          }

          if (diamondsToRemove.length > 0) {
            const collectedDiamonds = diamondsToRemove.length;

            diamondsToRemove.forEach(
              ({ row, col }) => (boardToProcess[row][col] = null)
            );

            setGoals((prev) => {
              const next = [...prev];
              const idx = next.findIndex((g) => g.figure === "diamond");
              if (idx !== -1) {
                const inc = modifiers.doubleGoalProgress
                  ? collectedDiamonds * 2
                  : collectedDiamonds;
                next[idx] = {
                  ...next[idx],
                  collected: Math.min(next[idx].collected + inc, next[idx].target),
                };
              }
              return next;
            });

            const lvl = currentLevel
              ? { ...currentLevel, specialCells: updatedSpecialCells }
              : undefined;

            boardToProcess = await applyGravityAndFillStepwise(
              boardToProcess,
              lvl
            );

            updatedSpecialCells.forEach((sc) => {
              if (!skipGoldenRestore && sc.type === "golden" && sc.isActive !== false) {
                if (boardToProcess[sc.row]) {
                  boardToProcess[sc.row][sc.col] =
                    boardToProcess[sc.row][sc.col] ??
                    makeStableFigure("goldenCell", sc.row, sc.col);
                }
              }
            });

            setBoard([...boardToProcess]);
            await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
          }

          const starsToRemove: Position[] = [];
          for (let col = 0; col < boardToProcess[0].length; col++) {
            if (boardToProcess[BOARD_ROWS - 1]?.[col]?.type === "star") {
              starsToRemove.push({ row: BOARD_ROWS - 1, col });
            }
          }

          if (starsToRemove.length > 0) {
            const collectedStars = starsToRemove.length;

            starsToRemove.forEach(
              ({ row, col }) => (boardToProcess[row][col] = null)
            );

            setGoals((prev) => {
              const next = [...prev];
              const idx = next.findIndex((g) => g.figure === "star");
              if (idx !== -1) {
                const inc = modifiers.doubleGoalProgress
                  ? collectedStars * 2
                  : collectedStars;
                next[idx] = {
                  ...next[idx],
                  collected: Math.min(next[idx].collected + inc, next[idx].target),
                };
              }
              return next;
            });

            const lvl = currentLevel
              ? { ...currentLevel, specialCells: updatedSpecialCells }
              : undefined;

            boardToProcess = await applyGravityAndFillStepwise(
              boardToProcess,
              lvl
            );

            updatedSpecialCells.forEach((sc) => {
              if (!skipGoldenRestore && sc.type === "golden" && sc.isActive !== false) {
                if (boardToProcess[sc.row]) {
                  boardToProcess[sc.row][sc.col] =
                    boardToProcess[sc.row][sc.col] ??
                    makeStableFigure("goldenCell", sc.row, sc.col);
                }
              }
            });

            setBoard([...boardToProcess]);
            await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
          }

          if (currentLevel?.id === 6) {
            setGoals((prev) => {
              const { goals: newGoals, bonuses: bonusesToAdd } =
                replaceCompletedGoalsForLevel6(prev);

              if (bonusesToAdd.length > 0) {
                const toApply = bonusesToAdd.slice(
                  0,
                  Math.max(0, bonusesToAdd.length - appliedLevel6Bonuses)
                );

                if (toApply.length > 0) {
                  setBonuses((prevBonuses) => {
                    let updatedBonuses = [...prevBonuses];

                    for (const bonusType of toApply) {
                      const existingIndex = updatedBonuses.findIndex(
                        (b) => b.type === bonusType
                      );

                      if (existingIndex !== -1) {
                        updatedBonuses[existingIndex] = {
                          ...updatedBonuses[existingIndex],
                          count: Math.min(updatedBonuses[existingIndex].count + 1, 3),
                        };
                      } else if (updatedBonuses.length < 2) {
                        updatedBonuses.push({ type: bonusType, count: 1 });
                      } else {
                        const randomIndex = Math.floor(
                          Math.random() * updatedBonuses.length
                        );
                        if (updatedBonuses[randomIndex].count < 3) {
                          updatedBonuses[randomIndex] = {
                            ...updatedBonuses[randomIndex],
                            count: Math.min(updatedBonuses[randomIndex].count + 1, 3),
                          };
                        }
                      }
                    }

                    return updatedBonuses;
                  });

                  appliedLevel6Bonuses += toApply.length;
                }
              }

              return newGoals;
            });

            await new Promise((r) => setTimeout(r, ANIMATION_DURATION / 2));
          }

          const newMatches = findAllMatches(boardToProcess);
          const moreStars: Position[] = [];
          const moreDiamonds: Position[] = [];

          for (let col = 0; col < boardToProcess[0].length; col++) {
            if (boardToProcess[BOARD_ROWS - 1]?.[col]?.type === "star") {
              moreStars.push({ row: BOARD_ROWS - 1, col });
            }
            if (boardToProcess[BOARD_ROWS - 1]?.[col]?.type === "diamond") {
              moreDiamonds.push({ row: BOARD_ROWS - 1, col });
            }
          }

          if (
            newMatches.length === 0 &&
            moreStars.length === 0 &&
            moreDiamonds.length === 0
          ) {
            hasMatches = false;

            const hasMoves = checkPossibleMoves(boardToProcess);
            if (!hasMoves) {
              let current = 0;
              while (current < MAX_SHUFFLE_ATTEMPTS) {
                if (onShuffleWarning) {
                  onShuffleWarning();
                  await new Promise((r) => setTimeout(r, 300));
                }

                current++;

                const shuffledBoard = shuffleBoardWithoutMatches(
                  boardToProcess,
                  currentLevel
                );

                if (shuffledBoard !== boardToProcess) {
                  boardToProcess = shuffledBoard;
                  setBoard([...boardToProcess]);
                  await new Promise((r) => setTimeout(r, ANIMATION_DURATION));

                  const hasMovesAfterShuffle =
                    checkPossibleMoves(boardToProcess);
                  if (hasMovesAfterShuffle) {
                    break;
                  } else {
                    hasMatches = true;
                  }
                }
              }
            }

            break;
          }
        }

        if (totalRoundScore > 0) {
          setScore((prev) => prev + totalRoundScore);
        }

        if (usedModifiers && activeBonus) {
          const effect = BONUS_EFFECTS[activeBonus.type];
          if (effect.reset) setModifiers(effect.reset());

          setActiveBonus(null);

          if (!effect.isInstant) {
            setBonuses((prev) => {
              const next = [...prev];
              const i = next.findIndex((b) => b.type === activeBonus.type);
              if (i !== -1 && next[i].count > 0) {
                const newCount = next[i].count - 1;

                if (currentLevel?.id === 6) {
                  if (newCount <= 0) {
                    next.splice(i, 1);
                  } else {
                    next[i] = { ...next[i], count: newCount };
                  }
                } else {
                  next[i] = { ...next[i], count: newCount };
                }
              }
              return next;
            });
          }
        }

        return boardToProcess;
      } finally {
        isProcessingMatchesRef.current = false;
      }
    },
    [
      setBoard,
      setMatches,
      setScore,
      setGoals,
      modifiers,
      setModifiers,
      setActiveBonus,
      setBonuses,
      activeBonus,
      currentLevel,
      onSpecialCellsUpdate,
      onShuffleWarning,
      getRandomBonus,
      getRandomFigure,
      replaceCompletedGoalsForLevel6,
      checkPossibleMoves,
    ]
  );

  return { processMatches };
};